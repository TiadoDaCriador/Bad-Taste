import { projects as defaultProjects } from '../data/projects'

const PROJECTS_KEY = 'bt_admin_projects'
const CONTACTS_KEY = 'bt_admin_contacts'

export const defaultContacts = {
  email: 'hello@badtaste.pt',
  instagram: '@badtaste',
  instagramUrl: 'https://instagram.com/badtaste',
  phone: '+351 900 000 000',
}

export function getProjects() {
  try {
    const stored = localStorage.getItem(PROJECTS_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return defaultProjects
}

export function saveProjects(projects) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
}

export function getContacts() {
  try {
    const stored = localStorage.getItem(CONTACTS_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return defaultContacts
}

export function saveContacts(contacts) {
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts))
}

export function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
