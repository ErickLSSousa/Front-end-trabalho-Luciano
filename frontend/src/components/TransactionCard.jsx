import { useState } from "react";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { api } from "../services/api";

const ENDPOINTS = {
  deposit:  "/transactions/deposit",
  withdraw: "/transactions/withdraw",
  transfer: "/transactions/transfer",
};

export default function TransactionCard({ type, accountId, onSuccess }) {
  const [amount, setAmount]       = useState(null);
  const [toAccount, setToAccount] = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  async function submit() {
    setError("");

    if (!amount || amount <= 0) {
      setError("Informe um valor válido.");
      return;
    }
    if (type === "transfer" && !toAccount.trim()) {
      setError("Informe a conta destino.");
      return;
    }

    try {
      setLoading(true);
      await api.post(ENDPOINTS[type], {
        accountId,
        amount,
        ...(type === "transfer" && { toAccountId: toAccount }),
      });
      setAmount(null);
      setToAccount("");
      onSuccess?.(); // avisa o Dashboard para recarregar o saldo
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao processar transação.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-column gap-3 mt-3">
      {error && <p className="text-red-500 text-sm">{error}</p>}

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
        placeholder="R$ 0,00"
      />

      <Button
        label={loading ? "Processando..." : "Confirmar"}
        onClick={submit}
        disabled={loading}
        loading={loading}
      />
    </div>
  );
}