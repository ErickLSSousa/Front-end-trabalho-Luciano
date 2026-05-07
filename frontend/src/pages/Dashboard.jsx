import { useEffect, useState } from 'react'

import api from '../services/api'
import Navbar from '../components/Navbar'
import AccountCard from '../components/AccountCard'

export default function Dashboard() {
  const [accounts, setAccounts] = useState([])

  useEffect(() => {
    loadAccounts()
  }, [])

  async function loadAccounts() {
  try {
    const response = await api.get('/accounts')

    console.log('RESPOSTA:', response.data)

    setAccounts(response.data.accounts || response.data)
  } catch (error) {
    console.log('ERRO COMPLETO:', error)

    console.log('RESPONSE:', error.response)

    console.log('DATA:', error.response?.data)
  }
}
  return (
    <div>
      <Navbar />

      <div className="dashboard">
        <h1>Contas Bancárias</h1>

        <div className="accounts-grid">
          {accounts.map((account) => (
            <AccountCard
              key={account.accountNumber}
              account={account}
            />
          ))}
        </div>
      </div>
    </div>
  )
}