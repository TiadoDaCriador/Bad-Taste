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
    caption: row.caption,
    order: row.sort_order,
    isCover: row.is_cover === 1,
    createdAt: row.created_at,
  }
}

router.get('/', (_req, res) => {
  const rows = db.prepare('SELECT * FROM gallery ORDER BY sort_order ASC').all()
  res.json(rows.map(toFrontend))
})

router.post('/', (req, res) => {
  const { path: photoPath, caption = '' } = req.body
  if (!photoPath) return res.status(400).json({ error: 'path is required' })

  const maxRow = db.prepare('SELECT MAX(sort_order) as m FROM gallery').get()
  const order = (maxRow?.m ?? 0) + 1

  const id = uuidv4()
  db.prepare('INSERT INTO gallery (id, path, caption, sort_order, is_cover) VALUES (?, ?, ?, ?, 0)')
    .run(id, photoPath, caption, order)

  const row = db.prepare('SELECT * FROM gallery WHERE id = ?').get(id)
  res.status(201).json(toFrontend(row))
})

router.put('/:id', (req, res) => {
  const { id } = req.params
  const { caption, order, isCover } = req.body

  const row = db.prepare('SELECT * FROM gallery WHERE id = ?').get(id)
  if (!row) return res.status(404).json({ error: 'Photo not found' })

  if (caption !== undefined) db.prepare('UPDATE gallery SET caption = ? WHERE id = ?').run(caption, id)
  if (order !== undefined) db.prepare('UPDATE gallery SET sort_order = ? WHERE id = ?').run(order, id)
  if (isCover !== undefined) {
    if (isCover) db.prepare('UPDATE gallery SET is_cover = 0').run()
    db.prepare('UPDATE gallery SET is_cover = ? WHERE id = ?').run(isCover ? 1 : 0, id)
  }

  res.json(toFrontend(db.prepare('SELECT * FROM gallery WHERE id = ?').get(id)))
})

router.delete('/:id', (req, res) => {
  const { id } = req.params
  const row = db.prepare('SELECT * FROM gallery WHERE id = ?').get(id)
  if (!row) return res.status(404).json({ error: 'Photo not found' })

  db.prepare('DELETE FROM gallery WHERE id = ?').run(id)

  try {
    const filePath = path.join(__dirname, '../../public', row.path)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  } catch {}

  res.json({ success: true, id })
})

export default router
