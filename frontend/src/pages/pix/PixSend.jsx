import { useState } from 'react'
import { motion } from 'framer-motion'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import api from '../../services/api'

export default function PixSend() {
  const [key, setKey] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSend(e) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!key || !amount || Number(amount) <= 0) {
      setError('Preencha todos os campos corretamente')
      return
    }

    setLoading(true)

    try {
      await api.post('/pix/send', {
        key,
        amount: Number(amount),
        description
      })
      setSuccess(true)
      setKey('')
      setAmount('')
      setDescription('')
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        'Erro ao enviar PIX'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrapper">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="card"
        style={{ maxWidth: 460 }}
      >
        <h2 style={{ marginBottom: 20, textAlign: 'center' }}>
          Enviar PIX
        </h2>

        <form onSubmit={handleSend}>
          <InputText
            placeholder="Chave PIX (CPF, e-mail, telefone ou aleatória)"
            className="w-full mb-3"
            value={key}
            onChange={e => setKey(e.target.value)}
          />

          <InputText
            placeholder="Valor"
            type="number"
            min="0.01"
            step="0.01"
            className="w-full mb-3"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />

          <InputText
            placeholder="Descrição (opcional)"
            className="w-full mb-4"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                color: '#ef4444',
                fontSize: 14,
                marginBottom: 14,
                textAlign: 'center'
              }}
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                color: '#22c55e',
                fontSize: 14,
                marginBottom: 14,
                textAlign: 'center',
                fontWeight: 600
              }}
            >
              PIX enviado com sucesso
            </motion.div>
          )}

          <Button
            label={loading ? 'Enviando...' : 'Enviar PIX'}
            className="w-full"
            disabled={loading}
          />
        </form>
      </motion.div>
    </div>
  )
}