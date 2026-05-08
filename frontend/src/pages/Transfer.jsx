import { useState } from 'react'
import { motion } from 'framer-motion'
import api from '../services/api'

export default function Transfer() {
    const [fromAccount, setFromAccount] = useState('')
    const [toAccount, setToAccount] = useState('')
    const [amount, setAmount] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    async function handleTransfer(e) {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        try {
            await api.post('/transactions/transfer', {
                fromAccountNumber,
                toAccountNumber,
                amount
            })

            setSuccess('Transferência realizada com sucesso')
            setAmount('')
            setToAccount('')
        } catch (err) {
            setError(
                err?.response?.data?.error ||
                'Erro ao realizar transferência'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fade-in">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="card"
                style={{ maxWidth: 520, margin: '0 auto' }}
            >
                <h2>Transferência</h2>

                <form onSubmit={handleTransfer}>
                    <div style={{ marginBottom: 16 }}>
                        <input
                            type="text"
                            placeholder="Conta de origem"
                            value={fromAccount}
                            onChange={e => setFromAccount(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <input
                            type="text"
                            placeholder="Conta de destino"
                            value={toAccount}
                            onChange={e => setToAccount(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <input
                            type="number"
                            placeholder="Valor"
                            min="0.01"
                            step="0.01"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div
                            style={{
                                color: '#ef4444',
                                marginBottom: 16,
                                fontSize: 14
                            }}
                        >
                            {error}
                        </div>
                    )}

                    {success && (
                        <div
                            style={{
                                color: '#22c55e',
                                marginBottom: 16,
                                fontSize: 14
                            }}
                        >
                            {success}
                        </div>
                    )}

                    <button disabled={loading}>
                        {loading ? 'Processando...' : 'Confirmar transferência'}
                    </button>
                </form>
            </motion.div>
        </div>
    )
}
