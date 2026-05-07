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

    setStatement(response.data)
  }

  return (
    <div>
      <Navbar />

      <div className="details-container">
        <h1>Conta {accountNumber}</h1>

        <h2>Saldo: R$ {balance}</h2>

        <TransactionTabs accountNumber={accountNumber} />

        <div className="statement-list">
          {statement.map((item, index) => (
            <TransactionCard
              key={index}
              transaction={item}
            />
          ))}
        </div>
      </div>
    </div>
  )
}