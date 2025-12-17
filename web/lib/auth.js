// Simple authentication utility using localStorage
// In production, this should use a proper backend API

const ADMIN_KEY = 'homiebites_admin'
const ADMIN_CREDENTIALS = {
  username: 'adminHomieBites',
  password: 'Bless@@##12$$',
}

export const login = (username, password) => {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    localStorage.setItem(ADMIN_KEY, 'true')
    return { success: true }
  }
  return { success: false, error: 'Invalid credentials' }
}

export const logout = () => {
  localStorage.removeItem(ADMIN_KEY)
}

export const isAuthenticated = () => {
  return localStorage.getItem(ADMIN_KEY) === 'true'
}

export const requireAuth = () => {
  if (!isAuthenticated()) {
    return false
  }
  return true
}

