import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'

function getUserFromToken() {
  const token = localStorage.getItem('token')
  if (!token) return null

  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

export default function Dashboard() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const user = getUserFromToken()

    if (!user || !user.email) {
      setError('Usuário não autenticado')
      setLoading(false)
      return
    }

    api.get('/accounts')
      .then(res => {
        const list = Array.isArray(res.data)
          ? res.data
          : res.data.accounts || []

        const filtered = list.filter(
          account => account.email === user.email
        )

        setAccounts(filtered)
      })
      .catch(() => {
        setError('Erro ao carregar contas')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <p>Carregando...</p>
  }

  if (error) {
    return (
      <p style={{ color: '#ef4444', textAlign: 'center' }}>
        {error}
      </p>
    )
  }

  return (
    <div className="fade-in">
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>Visão geral</h2>
        <p>Suas contas vinculadas a este login</p>
      </motion.div>

      {accounts.length === 0 && (
        <p style={{ textAlign: 'center' }}>
          Nenhuma conta encontrada para este usuário.
        </p>
      )}

      {accounts.map(account => (
        <motion.div
          key={account.accountNumber}
          className="card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3>Conta {account.accountNumber}</h3>

          <p className="balance">
            R$ {Number(account.balance).toFixed(2)}
          </p>

          <p>
            Titular: {account.fullName}
          </p>

          <div style={{ display: 'flex', gap: 16 }}>
            <Link to={`/account/${account.accountNumber}`}>
              <button>Ver detalhes</button>
            </Link>

            <Link to="/transfer">
              <button>Transferir</button>
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  )
}