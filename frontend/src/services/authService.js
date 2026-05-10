import api from './api'

const authService = {
  async register(data) {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  async login({ email, password }) {
    const response = await api.post('/auth/login', { email, password })
    const { token } = response.data

    // Salva o token — a chave DEVE ser 'token' para o api.js encontrar
    localStorage.setItem('token', token)

    return response.data
  },

  logout() {
    localStorage.removeItem('token')
    window.location.href = '/login'
  },

  getToken() {
    return localStorage.getItem('token')
  },

  isAuthenticated() {
    const token = localStorage.getItem('token')
    if (!token) return false

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      // Verifica se o token não expirou (exp é em segundos)
      return payload.exp > Date.now() / 1000
    } catch {
      return false
    }
  }
}

export default authService