import { Card } from "primereact/card";

export default function AccountCard({ account }) {
  return (
    <div className="col-12 md:col-4">
      <Card title={`Conta ${account.id}`}>
        <p>Saldo: R$ {account.balance.toFixed(2)}</p>
      </Card>
    </div>
  );
}