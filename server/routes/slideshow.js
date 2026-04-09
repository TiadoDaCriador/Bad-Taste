import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import db from '../db.js'

const router = express.Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

function toFrontend(row) {
  return {
    id: row.id,
    path: row.path,
    order: row.sort_order,
    createdAt: row.created_at,
  }
}

router.get('/', (_req, res) => {
  const rows = db.prepare('SELECT * FROM slideshow_images ORDER BY sort_order ASC').all()
  res.json(rows.map(toFrontend))
})

router.post('/', (req, res) => {
  const { path: imagePath } = req.body
  if (!imagePath) return res.status(400).json({ error: 'path is required' })

  // Check if already exists
  const existing = db.prepare('SELECT id FROM slideshow_images WHERE path = ?').get(imagePath)
  if (existing) return res.status(409).json({ error: 'Image already in slideshow' })

  const maxRow = db.prepare('SELECT MAX(sort_order) as m FROM slideshow_images').get()
  const order = (maxRow?.m ?? 0) + 1
  const id = uuidv4()

  db.prepare('INSERT INTO slideshow_images (id, path, sort_order) VALUES (?, ?, ?)')
    .run(id, imagePath, order)

  const row = db.prepare('SELECT * FROM slideshow_images WHERE id = ?').get(id)
  res.status(201).json(toFrontend(row))
})

router.put('/batch', (req, res) => {
  const images = req.body
  if (!Array.isArray(images)) return res.status(400).json({ error: 'Array expected' })

  const update = db.prepare('UPDATE slideshow_images SET sort_order = ? WHERE id = ?')
  const tx = db.transaction(() => {
    images.forEach((img, i) => update.run(i, img.id))
  })
  tx()
  res.json({ success: true })
})

router.delete('/:id', (req, res) => {
  const { id } = req.params
  const row = db.prepare('SELECT * FROM slideshow_images WHERE id = ?').get(id)
  if (!row) return res.status(404).json({ error: 'Not found' })

  db.prepare('DELETE FROM slideshow_images WHERE id = ?').run(id)

  // Try to delete file from disk (but don't fail if it doesn't exist)
  try {
    const filePath = path.join(__dirname, '../../public', row.path)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  } catch {}

  res.json({ success: true, id })
})

export default router
