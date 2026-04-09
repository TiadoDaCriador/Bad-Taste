import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, 'data')

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

const db = new Database(path.join(dataDir, 'badtaste.db'))

// WAL mode: melhor performance para leituras/escritas simultâneas
db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    slug        TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    color       TEXT DEFAULT '#111111',
    video_full  TEXT DEFAULT '',
    preview_start INTEGER DEFAULT 0,
    video_preview TEXT,
    thumbnail   TEXT,
    description TEXT DEFAULT '',
    tags        TEXT DEFAULT '[]',
    sort_order  INTEGER DEFAULT 0,
    created_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id            INTEGER PRIMARY KEY DEFAULT 1,
    email         TEXT DEFAULT 'hello@badtaste.pt',
    instagram     TEXT DEFAULT '@badtaste',
    instagram_url TEXT DEFAULT 'https://instagram.com/badtaste',
    phone         TEXT DEFAULT '+351 900 000 000'
  );
  INSERT OR IGNORE INTO contacts (id) VALUES (1);

  CREATE TABLE IF NOT EXISTS gallery (
    id         TEXT PRIMARY KEY,
    path       TEXT NOT NULL,
    caption    TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    is_cover   INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS photo_projects (
    slug       TEXT PRIMARY KEY,
    title      TEXT NOT NULL,
    thumbnail  TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS photo_project_photos (
    id           TEXT PRIMARY KEY,
    project_slug TEXT NOT NULL REFERENCES photo_projects(slug) ON DELETE CASCADE,
    path         TEXT NOT NULL,
    caption      TEXT DEFAULT '',
    sort_order   INTEGER DEFAULT 0,
    created_at   TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS slideshow_images (
    id         TEXT PRIMARY KEY,
    path       TEXT NOT NULL UNIQUE,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );
`)

export default db
