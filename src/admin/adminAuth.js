const PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'badtaste2026'
const AUTH_KEY = 'bt_admin_auth'

export function isAuthenticated() {
  return sessionStorage.getItem(AUTH_KEY) === 'true'
}

export function login(password) {
  if (password === PASSWORD) {
    sessionStorage.setItem(AUTH_KEY, 'true')
    return true
  }
  return false
}

export function logout() {
  sessionStorage.removeItem(AUTH_KEY)
}
