-- ============================================================
-- Bad Taste — Supabase Setup
-- Correr no SQL Editor: https://supabase.com/dashboard → SQL Editor
-- ============================================================

-- Projetos
CREATE TABLE IF NOT EXISTS projects (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  color TEXT DEFAULT '#111111',
  video_full TEXT DEFAULT '',
  preview_start INTEGER DEFAULT 0,
  video_preview TEXT,
  thumbnail TEXT,
  description TEXT DEFAULT '',
  tags JSONB DEFAULT '[]',
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contactos (linha única, id sempre = 1)
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY DEFAULT 1,
  email TEXT DEFAULT 'hello@badtaste.pt',
  instagram TEXT DEFAULT '@badtaste',
  instagram_url TEXT DEFAULT 'https://instagram.com/badtaste',
  phone TEXT DEFAULT '+351 900 000 000'
);
INSERT INTO contacts (id) VALUES (1) ON CONFLICT DO NOTHING;

-- Galeria de fotos
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL,
  caption TEXT DEFAULT '',
  "order" INTEGER DEFAULT 0,
  is_cover BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Permissões: permitir acesso via service_role (usado no backend)
-- (Por defeito o service_role já tem acesso total — não é necessário
--  configurar RLS se só o backend aceder às tabelas)
-- ============================================================
