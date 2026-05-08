import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'

export default function AccountDetails() {
  const { accountNumber } = useParams()

  const [balance, setBalance] = useState(0)
  const [statement, setStatement] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadData() {
    setError('')
    setLoading(true)

    try {
      const balanceRes = await api.get(`/accounts/${accountNumber}/balance`)
      const statementRes = await api.get(`/accounts/${accountNumber}/statement`)

      setBalance(balanceRes.data.balance)
      setStatement(statementRes.data.statement || [])
    } catch (err) {
      setError('Erro ao carregar dados da conta')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [accountNumber])

  return (
    <div className="fade-in">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="card"
      >
        <h2>Conta {accountNumber}</h2>
        <p style={{ marginBottom: 12 }}>Saldo disponível</p>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15 }}
          style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg,#22d3ee,#facc15)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          R$ {Number(balance).toFixed(2)}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="card"
      >
        <h3 style={{ marginBottom: 16 }}>Ações</h3>

        <div
          style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap'
          }}
        >
          <Link to="/transfer">
            <button style={{ width: '180px' }}>
              Transferir
            </button>
          </Link>

          <Link to="/pix">
            <button style={{ width: '180px' }}>
              Área PIX
            </button>
          </Link>

          <button
            style={{ width: '180px' }}
            onClick={loadData}
          >
            Atualizar
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="card"
      >
        <h3 style={{ marginBottom: 20 }}>Extrato</h3>

        {loading && <p>Carregando...</p>}

        {!loading && statement.length === 0 && (
          <p>Nenhuma movimentação encontrada</p>
        )}

        {!loading && statement.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {statement.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <strong>{item.type}</strong>
                  <div style={{ fontSize: 13, color: '#94a3b8' }}>
                    {new Date(item.date).toLocaleString('pt-BR')}
                  </div>
                </div>

                <div
                  style={{
                    fontWeight: 600,
                    color:
                      item.type.includes('WITHDRAW') ||
                      item.type.includes('TRANSFER_OUT')
                        ? '#ef4444'
                        : '#22c55e'
                  }}
                >
                  R$ {Number(item.amount).toFixed(2)}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {error && (
          <div
            style={{
              marginTop: 12,
              color: '#ef4444',
              fontSize: 14
            }}
          >
            {error}
          </div>
        )}
      </motion.div>
    </div>
  )
}
