import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import api from '../services/api'
import { AuthContext } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const response = await api.post('/auth/login', {
        email,
        password
      })

      login(response.data.token)

      navigate('/')
    } catch (err) {
      setError('Email ou senha inválidos')
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>SenaiBank</h1>

        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Entrar</button>

        <Link to="/register">Criar conta</Link>
      </form>
    </div>
  )
}