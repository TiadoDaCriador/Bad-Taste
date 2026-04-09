import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import uploadRoutes from './routes/upload.js'
import galleryRoutes from './routes/gallery.js'
import projectsRoutes from './routes/projects.js'
import contactsRoutes from './routes/contacts.js'
import photoProjectsRoutes from './routes/photoProjects.js'
import slideshowRoutes from './routes/slideshow.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = 3001

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}))
app.use(express.json())

app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  next()
})

app.use(express.static(path.join(__dirname, '../public')))

app.use('/api/upload', uploadRoutes)
app.use('/api/gallery', galleryRoutes)
app.use('/api/projects', projectsRoutes)
app.use('/api/contacts', contactsRoutes)
app.use('/api/photo-projects', photoProjectsRoutes)
app.use('/api/slideshow', slideshowRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`📸 Server running on http://localhost:${PORT}`)
  console.log(`   API: http://localhost:${PORT}/api`)
})
