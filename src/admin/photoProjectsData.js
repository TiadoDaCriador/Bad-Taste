const BASE = '/api/photo-projects'

export async function getPhotoProjects() {
  try {
    const res = await fetch(BASE)
    if (!res.ok) throw new Error('API error')
    return await res.json()
  } catch {
    return []
  }
}

export async function createPhotoProject({ slug, title, thumbnail = '' }) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, title, thumbnail }),
  })
  if (!res.ok) throw new Error(await res.text())
  return await res.json()
}

export async function updatePhotoProject(slug, fields) {
  const res = await fetch(`${BASE}/${slug}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  })
  if (!res.ok) throw new Error(await res.text())
  return await res.json()
}

export async function savePhotoProjects(projects) {
  const res = await fetch(`${BASE}/batch`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projects),
  })
  if (!res.ok) throw new Error(await res.text())
  return await res.json()
}

export async function deletePhotoProject(slug) {
  const res = await fetch(`${BASE}/${slug}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(await res.text())
  return await res.json()
}

export async function getPhotoProjectPhotos(slug) {
  try {
    const res = await fetch(`${BASE}/${slug}/photos`)
    if (!res.ok) throw new Error('API error')
    return await res.json()
  } catch {
    return []
  }
}

export async function addPhotoToProject(slug, { path, caption = '' }) {
  const res = await fetch(`${BASE}/${slug}/photos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, caption }),
  })
  if (!res.ok) throw new Error(await res.text())
  return await res.json()
}

export async function updateProjectPhoto(slug, id, fields) {
  const res = await fetch(`${BASE}/${slug}/photos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  })
  if (!res.ok) throw new Error(await res.text())
  return await res.json()
}

export async function deleteProjectPhoto(slug, id) {
  const res = await fetch(`${BASE}/${slug}/photos/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(await res.text())
  return await res.json()
}

export function slugify(text) {
  return text
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
