import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import api from '../../services/api'

export default function PixApproximation() {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function simulatePayment() {
    if (!amount || Number(amount) <= 0) return

    setLoading(true)
    setSuccess(false)

    setTimeout(async () => {
      try {
        await api.post('/pix/approximation', {
          amount: Number(amount)
        })
        setSuccess(true)
        setAmount('')
      } catch {
        alert('Erro ao processar PIX')
      } finally {
        setLoading(false)
      }
    }, 1600)
  }

  return (
    <div className="login-wrapper">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="card"
        style={{ maxWidth: 420 }}
      >
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ textAlign: 'center', marginBottom: 24 }}
        >
          PIX por Aproximação
        </motion.h2>

        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          style={{
            fontSize: 64,
            textAlign: 'center',
            marginBottom: 28,
            color: '#facc15'
          }}
        >
          📱
        </motion.div>

        {!success && (
          <>
            <InputText
              placeholder="Valor"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full mb-4"
            />

            <Button
              label={loading ? 'Aguardando aproximação...' : 'Simular aproximação'}
              className="w-full"
              disabled={loading}
              onClick={simulatePayment}
            />
          </>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              marginTop: 24,
              textAlign: 'center',
              color: '#22c55e',
              fontWeight: 600
            }}
          >
            Pagamento realizado com sucesso
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}