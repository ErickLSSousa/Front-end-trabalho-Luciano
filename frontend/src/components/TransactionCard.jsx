import { useState } from "react";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { api } from "../services/api";

export default function TransactionCard({ type, account }) {
  const [amount, setAmount] = useState(null);
  const [toAccount, setToAccount] = useState("");

  async function submit() {
    if (type === "deposit") {
      await api.post("/transactions/deposit", {
        accountId: account.id,
        amount,
      });
    }
  }

  return (
    <div className="glass-card p-4 flex flex-column gap-3">
      {type === "transfer" && (
        <InputText
          placeholder="Conta destino"
          value={toAccount}
          onChange={(e) => setToAccount(e.target.value)}
        />
      )}

      <InputNumber
        value={amount}
        onValueChange={(e) => setAmount(e.value)}
        mode="currency"
        currency="BRL"
        locale="pt-BR"
      />

      <Button label="Confirmar" onClick={submit} />
    </div>
  );
}