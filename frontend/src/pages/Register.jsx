import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import api from '../services/api'

export default function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    cpf: '',
    phone: '',
    password: ''
  })
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      await api.post('/auth/register', form)

      navigate('/login')
    } catch (err) {
      setError('Erro ao cadastrar usuário')
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Criar Conta</h1>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          name="fullname"
          placeholder="Nome"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          type="text"
          name="cpf"
          placeholder="CPF"
          onChange={handleChange}
        />


        <input
          type="text"
          name="phone"
          placeholder="Telefone"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Senha"
          onChange={handleChange}
        />

        <button type="submit">Cadastrar</button>

        <Link to="/login">Já tenho conta</Link>
      </form>
    </div>
  )
}