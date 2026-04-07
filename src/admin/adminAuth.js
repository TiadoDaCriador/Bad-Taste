const ENV_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'badtaste2026'
const AUTH_KEY = 'bt_admin_auth'
const CUSTOM_PWD_KEY = 'bt_admin_custom_password'

function getActivePassword() {
  return localStorage.getItem(CUSTOM_PWD_KEY) || ENV_PASSWORD
}

export function isAuthenticated() {
  return sessionStorage.getItem(AUTH_KEY) === 'true'
}

export function login(password) {
  if (password === getActivePassword()) {
    sessionStorage.setItem(AUTH_KEY, 'true')
    return true
  }
  return false
}

export function logout() {
  sessionStorage.removeItem(AUTH_KEY)
}

export function changePassword(currentPassword, newPassword) {
  if (currentPassword !== getActivePassword()) {
    return { success: false, error: 'Palavra-passe atual incorreta' }
  }
  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: 'A nova palavra-passe deve ter pelo menos 6 caracteres' }
  }
  localStorage.setItem(CUSTOM_PWD_KEY, newPassword)
  return { success: true }
}
