import express from 'express'
import db from '../db.js'

const router = express.Router()

function toFrontend(row) {
  return {
    slug: row.slug,
    title: row.title,
    color: row.color,
    videoFull: row.video_full,
    previewStart: row.preview_start,
    videoPreview: row.video_preview,
    thumbnail: row.thumbnail,
    description: row.description,
    tags: JSON.parse(row.tags || '[]'),
  }
}

function toDatabase(p) {
  return {
    slug: p.slug,
    title: p.title,
    color: p.color || '#111111',
    video_full: p.videoFull || '',
    preview_start: Number(p.previewStart) || 0,
    video_preview: p.videoPreview || null,
    thumbnail: p.thumbnail || null,
    description: p.description || '',
    tags: JSON.stringify(Array.isArray(p.tags) ? p.tags : []),
  }
}

router.get('/', (_req, res) => {
  const rows = db.prepare('SELECT * FROM projects ORDER BY sort_order ASC').all()
  res.json(rows.map(toFrontend))
})

router.post('/', (req, res) => {
  const existing = db.prepare('SELECT slug FROM projects WHERE slug = ?').get(req.body.slug)
  if (existing) return res.status(409).json({ error: `Slug "${req.body.slug}" já existe` })

  const maxRow = db.prepare('SELECT MAX(sort_order) as m FROM projects').get()
  const order = (maxRow?.m ?? 0) + 1
  const p = toDatabase(req.body)

  db.prepare(`INSERT INTO projects (slug, title, color, video_full, preview_start, video_preview, thumbnail, description, tags, sort_order)
    VALUES (@slug, @title, @color, @video_full, @preview_start, @video_preview, @thumbnail, @description, @tags, @order)`)
    .run({ ...p, order })

  res.status(201).json(toFrontend(db.prepare('SELECT * FROM projects WHERE slug = ?').get(p.slug)))
})

// Batch: substitui todos os projetos (reorder / delete no admin)
router.put('/batch', (req, res) => {
  const { projects } = req.body
  if (!Array.isArray(projects)) return res.status(400).json({ error: 'projects array required' })

  const replaceAll = db.transaction((list) => {
    db.prepare('DELETE FROM projects').run()
    const insert = db.prepare(`INSERT INTO projects (slug, title, color, video_full, preview_start, video_preview, thumbnail, description, tags, sort_order)
      VALUES (@slug, @title, @color, @video_full, @preview_start, @video_preview, @thumbnail, @description, @tags, @order)`)
    list.forEach((p, i) => insert.run({ ...toDatabase(p), order: i }))
  })

  replaceAll(projects)
  const rows = db.prepare('SELECT * FROM projects ORDER BY sort_order ASC').all()
  res.json(rows.map(toFrontend))
})

router.put('/:slug', (req, res) => {
  const { slug } = req.params
  const row = db.prepare('SELECT * FROM projects WHERE slug = ?').get(slug)
  if (!row) return res.status(404).json({ error: 'Project not found' })

  const p = toDatabase(req.body)
  db.prepare(`UPDATE projects SET title=@title, color=@color, video_full=@video_full, preview_start=@preview_start,
    video_preview=@video_preview, thumbnail=@thumbnail, description=@description, tags=@tags WHERE slug=@slug`)
    .run({ ...p, slug })

  res.json(toFrontend(db.prepare('SELECT * FROM projects WHERE slug = ?').get(slug)))
})

router.delete('/:slug', (req, res) => {
  const { slug } = req.params
  db.prepare('DELETE FROM projects WHERE slug = ?').run(slug)
  res.json({ success: true, slug })
})

export default router
