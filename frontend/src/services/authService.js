import api from './api'

const TOKEN_KEY = 'token'

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

function isAuthenticated() {
  return Boolean(getToken())
}

async function login({ email, password }) {
  const response = await api.post('/auth/login', {
    email,
    password
  })

  const { token } = response.data
  if (!token) {
    throw new Error('Token inválido')
  }

  setToken(token)
  return token
}

async function register({
  fullName,
  cpf,
  email,
  phone,
  password
}) {
  const response = await api.post('/auth/register', {
    fullName,
    cpf,
    email,
    phone,
    password
  })

  return response.data
}

function logout() {
  removeToken()
}

function getAuthHeader() {
  const token = getToken()
  if (!token) return {}
  return {
    Authorization: `Bearer ${token}`
  }
}

export default {
  login,
  register,
  logout,
  isAuthenticated,
  getToken,
  getAuthHeader
}
