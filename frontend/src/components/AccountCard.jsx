import { Link } from 'react-router-dom'

export default function AccountCard({ account }) {
  return (
    <div className="account-card">
      <h2>{account.name}</h2>

      <p>Conta: {account.accountNumber}</p>

      <p>Saldo: R$ {account.balance}</p>

      <Link to={`/account/${account.accountNumber}`}>
        Ver detalhes
      </Link>
    </div>
  )
}