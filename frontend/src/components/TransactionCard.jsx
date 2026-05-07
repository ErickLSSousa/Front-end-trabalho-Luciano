export default function TransactionCard({ transaction }) {
  return (
    <div className="transaction-card">
      <h3>{transaction.type}</h3>

      <p>Valor: R$ {transaction.amount}</p>

      <small>
        {new Date(transaction.date).toLocaleString('pt-BR')}
      </small>
    </div>
  )
}