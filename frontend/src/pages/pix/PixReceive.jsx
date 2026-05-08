import { useState } from 'react'
import { motion } from 'framer-motion'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'

export default function PixReceive() {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [generated, setGenerated] = useState(false)

  const pixCode = `00020126330014BR.GOV.BCB.PIX0114+55119999999952040000530398654${amount
    .replace('.', '')
    .padStart(6, '0')}5802BR5909SenaiBank6009SaoPaulo62290525${description
    .slice(0, 25)
    .padEnd(25, '0')}6304ABCD`

  function handleGenerate(e) {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) return
    setGenerated(true)
  }

  function handleCopy() {
    navigator.clipboard.writeText(pixCode)
    alert('Código PIX copiado')
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
          Receber / Cobrar PIX
        </h2>

        {!generated && (
          <form onSubmit={handleGenerate}>
            <InputText
              placeholder="Valor"
              type="number"
              min="0.01"
              step="0.01"
              className="w-full mb-3"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />

            <InputText
              placeholder="Descrição (opcional)"
              className="w-full mb-4"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />

            <Button
              label="Gerar cobrança PIX"
              className="w-full"
            />
          </form>
        )}

        {generated && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                padding: 16,
                borderRadius: 12,
                wordBreak: 'break-all',
                marginBottom: 16,
                fontSize: 14
              }}
            >
              {pixCode}
            </div>

            <Button
              label="Copiar código PIX"
              className="w-full mb-2"
              onClick={handleCopy}
            />

            <Button
              label="Gerar nova cobrança"
              className="w-full"
              severity="secondary"
              onClick={() => {
                setGenerated(false)
                setAmount('')
                setDescription('')
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}