import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import db from '../db.js'

const router = express.Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

function projectToFrontend(row) {
  return {
    slug: row.slug,
    title: row.title,
    thumbnail: row.thumbnail || '',
    order: row.sort_order,
    createdAt: row.created_at,
  }
}

function photoToFrontend(row) {
  return {
    id: row.id,
    projectSlug: row.project_slug,
    path: row.path,
    caption: row.caption,
    order: row.sort_order,
    createdAt: row.created_at,
  }
}

// GET /api/photo-projects — list all
router.get('/', (_req, res) => {
  const rows = db.prepare('SELECT * FROM photo_projects ORDER BY sort_order ASC').all()
  res.json(rows.map(projectToFrontend))
})

// POST /api/photo-projects — create
router.post('/', (req, res) => {
  const { slug, title, thumbnail = '' } = req.body
  if (!slug || !title) return res.status(400).json({ error: 'slug and title are required' })

  const exists = db.prepare('SELECT slug FROM photo_projects WHERE slug = ?').get(slug)
  if (exists) return res.status(409).json({ error: 'Slug already exists' })

  const maxRow = db.prepare('SELECT MAX(sort_order) as m FROM photo_projects').get()
  const order = (maxRow?.m ?? 0) + 1

  db.prepare('INSERT INTO photo_projects (slug, title, thumbnail, sort_order) VALUES (?, ?, ?, ?)')
    .run(slug, title, thumbnail, order)

  const row = db.prepare('SELECT * FROM photo_projects WHERE slug = ?').get(slug)
  res.status(201).json(projectToFrontend(row))
})

// PUT /api/photo-projects/batch — reorder all
router.put('/batch', (req, res) => {
  const projects = req.body
  if (!Array.isArray(projects)) return res.status(400).json({ error: 'Array expected' })

  const update = db.prepare('UPDATE photo_projects SET title = ?, thumbnail = ?, sort_order = ? WHERE slug = ?')
  const tx = db.transaction(() => {
    projects.forEach((p, i) => update.run(p.title, p.thumbnail || '', i, p.slug))
  })
  tx()
  res.json({ success: true })
})

// PUT /api/photo-projects/:slug — edit
router.put('/:slug', (req, res) => {
  const { slug } = req.params
  const { title, thumbnail } = req.body

  const row = db.prepare('SELECT * FROM photo_projects WHERE slug = ?').get(slug)
  if (!row) return res.status(404).json({ error: 'Not found' })

  if (title !== undefined) db.prepare('UPDATE photo_projects SET title = ? WHERE slug = ?').run(title, slug)
  if (thumbnail !== undefined) db.prepare('UPDATE photo_projects SET thumbnail = ? WHERE slug = ?').run(thumbnail, slug)

  res.json(projectToFrontend(db.prepare('SELECT * FROM photo_projects WHERE slug = ?').get(slug)))
})

// DELETE /api/photo-projects/:slug — delete project + all its photos
router.delete('/:slug', (req, res) => {
  const { slug } = req.params
  const row = db.prepare('SELECT * FROM photo_projects WHERE slug = ?').get(slug)
  if (!row) return res.status(404).json({ error: 'Not found' })

  // Delete photo files from disk
  const photos = db.prepare('SELECT * FROM photo_project_photos WHERE project_slug = ?').all(slug)
  for (const photo of photos) {
    try {
      const filePath = path.join(__dirname, '../../public', photo.path)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    } catch {}
  }
  // Delete thumbnail from disk if it's a local file
  if (row.thumbnail && row.thumbnail.startsWith('/images/')) {
    try {
      const filePath = path.join(__dirname, '../../public', row.thumbnail)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    } catch {}
  }

  db.prepare('DELETE FROM photo_projects WHERE slug = ?').run(slug)
  res.json({ success: true, slug })
})

// --- Photos within a project ---

// GET /api/photo-projects/:slug/photos
router.get('/:slug/photos', (req, res) => {
  const { slug } = req.params
  const rows = db.prepare('SELECT * FROM photo_project_photos WHERE project_slug = ? ORDER BY sort_order ASC').all(slug)
  res.json(rows.map(photoToFrontend))
})

// POST /api/photo-projects/:slug/photos
router.post('/:slug/photos', (req, res) => {
  const { slug } = req.params
  const { path: photoPath, caption = '' } = req.body
  if (!photoPath) return res.status(400).json({ error: 'path is required' })

  const project = db.prepare('SELECT slug FROM photo_projects WHERE slug = ?').get(slug)
  if (!project) return res.status(404).json({ error: 'Project not found' })

  const maxRow = db.prepare('SELECT MAX(sort_order) as m FROM photo_project_photos WHERE project_slug = ?').get(slug)
  const order = (maxRow?.m ?? 0) + 1
  const id = uuidv4()

  db.prepare('INSERT INTO photo_project_photos (id, project_slug, path, caption, sort_order) VALUES (?, ?, ?, ?, ?)')
    .run(id, slug, photoPath, caption, order)

  const row = db.prepare('SELECT * FROM photo_project_photos WHERE id = ?').get(id)
  res.status(201).json(photoToFrontend(row))
})

// PUT /api/photo-projects/:slug/photos/:id
router.put('/:slug/photos/:id', (req, res) => {
  const { id } = req.params
  const { caption, order } = req.body

  const row = db.prepare('SELECT * FROM photo_project_photos WHERE id = ?').get(id)
  if (!row) return res.status(404).json({ error: 'Photo not found' })

  if (caption !== undefined) db.prepare('UPDATE photo_project_photos SET caption = ? WHERE id = ?').run(caption, id)
  if (order !== undefined) db.prepare('UPDATE photo_project_photos SET sort_order = ? WHERE id = ?').run(order, id)

  res.json(photoToFrontend(db.prepare('SELECT * FROM photo_project_photos WHERE id = ?').get(id)))
})

// DELETE /api/photo-projects/:slug/photos/:id
router.delete('/:slug/photos/:id', (req, res) => {
  const { id } = req.params
  const row = db.prepare('SELECT * FROM photo_project_photos WHERE id = ?').get(id)
  if (!row) return res.status(404).json({ error: 'Photo not found' })

  db.prepare('DELETE FROM photo_project_photos WHERE id = ?').run(id)

  try {
    const filePath = path.join(__dirname, '../../public', row.path)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  } catch {}

  res.json({ success: true, id })
})

export default router
