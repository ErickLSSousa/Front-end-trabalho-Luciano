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
      setAccounts(response.data)
    } catch (error) {
      console.log(error)
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