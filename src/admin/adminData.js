import { projects as defaultProjects } from '../data/projects'

export const defaultContacts = {
  email: 'hello@badtaste.pt',
  instagram: '@badtaste',
  instagramUrl: 'https://instagram.com/badtaste',
  phone: '+351 900 000 000',
}

export async function getProjects() {
  try {
    const res = await fetch('/api/projects')
    if (!res.ok) throw new Error(`Failed: ${res.status}`)
    return await res.json()
  } catch {
    return defaultProjects
  }
}

export async function saveProjects(projects) {
  const res = await fetch('/api/projects/batch', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projects }),
  })
  if (!res.ok) throw new Error(`saveProjects failed: ${res.status}`)
  return res.json()
}

export async function getContacts() {
  try {
    const res = await fetch('/api/contacts')
    if (!res.ok) throw new Error(`Failed: ${res.status}`)
    return await res.json()
  } catch {
    return defaultContacts
  }
}

export async function saveContacts(contacts) {
  const res = await fetch('/api/contacts', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contacts),
  })
  if (!res.ok) throw new Error(`saveContacts failed: ${res.status}`)
  return res.json()
}

export function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
