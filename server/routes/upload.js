import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

const router = express.Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const videoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, '../../public/videos/full')),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${path.basename(file.originalname, ext).replace(/\s/g, '_')}${ext}`)
  },
})

const photoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, '../../public/images')),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${path.basename(file.originalname, ext).replace(/\s/g, '_')}${ext}`)
  },
})

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']

const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 }, // 2GB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_VIDEO_TYPES.includes(file.mimetype)) cb(null, true)
    else cb(new Error('Formato inválido. Permitido: mp4, webm, mov, avi, mkv'))
  },
})

const uploadPhoto = multer({
  storage: photoStorage,
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) cb(null, true)
    else cb(new Error('Formato inválido. Permitido: jpg, png, webp, gif'))
  },
})

router.post('/video', uploadVideo.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  res.json({ success: true, path: `/videos/full/${req.file.filename}`, filename: req.file.filename })
})

router.post('/photo', uploadPhoto.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  res.json({ success: true, path: `/images/${req.file.filename}`, filename: req.file.filename })
})

router.use((error, _req, res, _next) => {
  res.status(400).json({ error: error.message })
})

export default router
