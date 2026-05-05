import { useEffect, useState } from "react";
import { api } from "../services/api";
import Navbar from "../components/Navbar";
import AccountCard from "../components/AccountCard";

export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    api.get("/accounts").then(res => setAccounts(res.data));
  }, []);

  return (
    <div className="p-4">
      <Navbar />

      <h2 className="mb-4">Minhas Contas</h2>

      <div className="grid">
        {accounts.map(acc => (
          <AccountCard key={acc.id} account={acc} />
        ))}
      </div>
    </div>
  );
}