import { useState } from 'react'

import api from '../services/api'

export default function TransactionForm({
  type,
  title,
  accountNumber
}) {
  const [amount, setAmount] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      await api.post(`/accounts/${accountNumber}/${type}`, {
        amount: Number(amount)
      })

      alert(`${title} realizado com sucesso!`)

      window.location.reload()
    } catch (error) {
      alert('Erro na transação')
    }
  }

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <h3>{title}</h3>

      <input
        type="number"
        placeholder="Valor"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button type="submit">Confirmar</button>
    </form>
  )
}