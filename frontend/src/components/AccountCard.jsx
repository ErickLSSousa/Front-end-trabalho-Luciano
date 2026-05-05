import { Card } from "primereact/card";

export default function AccountCard({ account }) {
  return (
    <div className="col-12 md:col-4">
      <Card className="glass-card">
        <h3>Conta</h3>
        <p className="text-2xl">
          R$ {account.balance.toFixed(2)}
        </p>
      </Card>
    </div>
  );
}