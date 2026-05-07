import TransactionForm from './TransactionForm'

export default function TransactionTabs({ accountNumber }) {
  return (
    <div className="tabs-container">
      <TransactionForm
        type="deposit"
        title="Depósito"
        accountNumber={accountNumber}
      />

      <TransactionForm
        type="withdraw"
        title="Saque"
        accountNumber={accountNumber}
      />
    </div>
  )
}