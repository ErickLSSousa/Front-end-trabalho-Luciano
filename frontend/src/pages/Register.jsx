import { useState } from 'react'
import { motion } from 'framer-motion'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Button } from 'primereact/button'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../services/authService'

export default function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    cpf: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    setLoading(true)

    try {
      await authService.register({
        fullName: form.fullName,
        cpf: form.cpf,
        email: form.email,
        phone: form.phone,
        password: form.password
      })
      navigate('/login')
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        'Erro ao criar conta'
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
        <motion.h2
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Criar conta
        </motion.h2>

        <form onSubmit={handleSubmit}>
          <InputText
            name="fullName"
            placeholder="Nome completo"
            value={form.fullName}
            onChange={handleChange}
            required
          />

          <InputText
            name="cpf"
            placeholder="CPF"
            value={form.cpf}
            onChange={handleChange}
            required
          />

          <InputText
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            type="email"
            required
          />

          <InputText
            name="phone"
            placeholder="Telefone"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <Password
            name="password"
            placeholder="Senha"
            value={form.password}
            onChange={handleChange}
            toggleMask
            feedback
            required
          />

          <Password
            name="confirmPassword"
            placeholder="Confirmar senha"
            value={form.confirmPassword}
            onChange={handleChange}
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
            label={loading ? 'Criando conta...' : 'Criar conta'}
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
          Já tem conta?{' '}
          <Link
            to="/login"
            style={{ color: '#facc15', fontWeight: 600 }}
          >
            Entrar
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
