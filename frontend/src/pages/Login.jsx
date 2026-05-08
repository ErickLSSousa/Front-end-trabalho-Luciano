import { useState } from 'react'
import { motion } from 'framer-motion'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Button } from 'primereact/button'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../services/authService'

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await authService.login({ email, password })
      navigate('/')
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        'E-mail ou senha inválidos'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrapper">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="card login-card"
      >
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          SenaiBank
        </motion.h1>

        <form onSubmit={handleSubmit}>
          <InputText
            placeholder="E-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <Password
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            toggleMask
            feedback={false}
            required
          />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                color: '#ef4444',
                textAlign: 'center',
                fontSize: 14
              }}
            >
              {error}
            </motion.div>
          )}

          <Button
            label={loading ? 'Entrando...' : 'Entrar'}
            disabled={loading}
          />
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          style={{
            marginTop: 22,
            textAlign: 'center',
            fontSize: 14
          }}
        >
          Não tem conta?{' '}
          <Link
            to="/register"
            style={{ color: '#facc15', fontWeight: 600 }}
          >
            Criar agora
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
