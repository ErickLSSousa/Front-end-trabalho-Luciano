import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../../services/api'

export default function PixHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadHistory() {
    setLoading(true)
    setError('')

    try {
      const res = await api.get('/pix/history')
      setHistory(res.data.history || [])
    } catch {
      setError('Erro ao carregar histórico de PIX')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  return (
    <div className="fade-in">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="card"
        style={{ maxWidth: 900, margin: '0 auto' }}
      >
        <h2 style={{ marginBottom: 20 }}>Histórico de PIX</h2>

        {loading && <p>Carregando...</p>}

        {!loading && history.length === 0 && (
          <p>Nenhuma transação PIX encontrada</p>
        )}

        {!loading && history.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {history.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 18,
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}
              >
                <div>
                  <strong>{item.type}</strong>
                  <div style={{ fontSize: 13, color: '#94a3b8' }}>
                    {item.key || 'Chave PIX'}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>
                    {new Date(item.date).toLocaleString('pt-BR')}
                  </div>
                </div>

                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    color:
                      item.type === 'PIX_SENT'
                        ? '#ef4444'
                        : '#22c55e'
                  }}
                >
                  {item.type === 'PIX_SENT' ? '-' : '+'} R$ {Number(item.amount).toFixed(2)}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {error && (
          <div
            style={{
              marginTop: 16,
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