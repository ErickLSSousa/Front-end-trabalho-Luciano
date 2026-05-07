import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import api from '../services/api'
import Navbar from '../components/Navbar'
import TransactionTabs from '../components/TransactionTabs'
import TransactionCard from '../components/TransactionCard'

export default function AccountDetails() {
  const { accountNumber } = useParams()

  const [balance, setBalance] = useState(0)
  const [statement, setStatement] = useState([])

  useEffect(() => {
    loadBalance()
    loadStatement()
  }, [])

  async function loadBalance() {
    const response = await api.get(
      `/accounts/${accountNumber}/balance`
    )

    setBalance(response.data.balance)
  }

  async function loadStatement() {
    const response = await api.get(
      `/accounts/${accountNumber}/statement`
    )

    setStatement(response.data.statement || [])
  }

  return (
  <div>
    <Navbar />

    <div className="account-details">

      <div className="account-header">
        <h1>Conta {accountNumber}</h1>
      </div>

      <div className="balance-card">
        <p>Saldo disponível</p>

        <h2>
          R$ {Number(balance).toFixed(2)}
        </h2>
      </div>

      <div className="actions-grid">

        <div className="action-card">
          <h3>Movimentações</h3>

          <TransactionTabs accountNumber={accountNumber} />
        </div>

      </div>

      <div className="statement-section">

        <h2>Extrato</h2>

        <div className="transactions">

          {statement.length === 0 ? (
            <p>Nenhuma movimentação encontrada.</p>
          ) : (
            statement.map((item, index) => (
              <TransactionCard
                key={index}
                transaction={item}
              />
            ))
          )}

        </div>

      </div>

      <div className="see-also">

        <h2>Ver também</h2>

        <div className="see-also-links">

          <a href="/">
            Dashboard
          </a>

          <a href={`/account/${accountNumber}`}>
            Atualizar página
          </a>

        </div>

      </div>

    </div>
  </div>
  )
}