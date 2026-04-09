const BASE = '/api/slideshow'

export async function getSlideshow() {
  try {
    const res = await fetch(BASE)
    if (!res.ok) throw new Error('API error')
    return await res.json()
  } catch {
    return []
  }
}

export async function addImageToSlideshow(path) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path }),
  })
  if (!res.ok) throw new Error(await res.text())
  return await res.json()
}

export async function reorderSlideshow(images) {
  const res = await fetch(`${BASE}/batch`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(images),
  })
  if (!res.ok) throw new Error(await res.text())
  return await res.json()
}

export async function removeImageFromSlideshow(id) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(await res.text())
  return await res.json()
}
