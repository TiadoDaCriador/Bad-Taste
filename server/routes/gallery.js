import express from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.join(__dirname, '../data/gallery.json');

// Ensure data directory exists
const dataDir = path.dirname(dataFile);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Helper: Load gallery data from JSON
const loadGallery = () => {
  if (!fs.existsSync(dataFile)) {
    return [];
  }
  try {
    const data = fs.readFileSync(dataFile, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

// Helper: Save gallery data to JSON
const saveGallery = (gallery) => {
  fs.writeFileSync(dataFile, JSON.stringify(gallery, null, 2), 'utf-8');
};

// GET - List all photos
router.get('/', (req, res) => {
  const gallery = loadGallery();
  res.json(gallery);
});

// POST - Add new photo to gallery
router.post('/', (req, res) => {
  const { path: photoPath, caption = '' } = req.body;

  if (!photoPath) {
    return res.status(400).json({ error: 'path is required' });
  }

  const gallery = loadGallery();
  const maxOrder = gallery.length > 0 ? Math.max(...gallery.map((p) => p.order || 0)) : 0;

  const newPhoto = {
    id: uuidv4(),
    path: photoPath,
    caption,
    order: maxOrder + 1,
    createdAt: new Date().toISOString(),
  };

  gallery.push(newPhoto);
  saveGallery(gallery);

  res.status(201).json(newPhoto);
});

// PUT - Update photo (caption, order, isCover)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { caption, order, isCover } = req.body;

  const gallery = loadGallery();
  const photoIndex = gallery.findIndex((p) => p.id === id);

  if (photoIndex === -1) {
    return res.status(404).json({ error: 'Photo not found' });
  }

  if (caption !== undefined) gallery[photoIndex].caption = caption;
  if (order !== undefined) gallery[photoIndex].order = order;
  if (isCover !== undefined) {
    // Only one cover at a time — clear all others first
    if (isCover) {
      gallery.forEach((p) => { p.isCover = false; });
    }
    gallery[photoIndex].isCover = isCover;
  }

  saveGallery(gallery);

  res.json(gallery[photoIndex]);
});

// DELETE - Delete photo (and file from disk if needed)
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const gallery = loadGallery();
  const photoIndex = gallery.findIndex((p) => p.id === id);

  if (photoIndex === -1) {
    return res.status(404).json({ error: 'Photo not found' });
  }

  const photo = gallery[photoIndex];
  gallery.splice(photoIndex, 1);
  saveGallery(gallery);

  // Optionally delete the file from disk
  try {
    const filePath = path.join(__dirname, '../../public', photo.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.warn(`Could not delete file ${photo.path}:`, err.message);
  }

  res.json({ success: true, id });
});

export default router;
