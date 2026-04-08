import express from 'express'
import db from '../db.js'

const router = express.Router()

const defaults = {
  email: 'hello@badtaste.pt',
  instagram: '@badtaste',
  instagramUrl: 'https://instagram.com/badtaste',
  phone: '+351 900 000 000',
}

function toFrontend(row) {
  return {
    email: row.email,
    instagram: row.instagram,
    instagramUrl: row.instagram_url,
    phone: row.phone,
  }
}

router.get('/', (_req, res) => {
  const row = db.prepare('SELECT * FROM contacts WHERE id = 1').get()
  res.json(row ? toFrontend(row) : defaults)
})

router.put('/', (req, res) => {
  const { email, instagram, instagramUrl, phone } = req.body
  db.prepare(`INSERT INTO contacts (id, email, instagram, instagram_url, phone) VALUES (1, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET email=excluded.email, instagram=excluded.instagram,
    instagram_url=excluded.instagram_url, phone=excluded.phone`)
    .run(email, instagram, instagramUrl, phone)

  res.json(toFrontend(db.prepare('SELECT * FROM contacts WHERE id = 1').get()))
})

export default router
