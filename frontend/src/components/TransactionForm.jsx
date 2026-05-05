import { TabView, TabPanel } from "primereact/tabview";
import TransactionCard from "./TransactionCard";

export default function TransactionTabs({ accountId, onSuccess }) {
  return (
    <div className="glass-card p-4 mt-4">
      <TabView>
        <TabPanel header="💰 Depósito">
          <TransactionCard
            type="deposit"
            accountId={accountId}
            onSuccess={onSuccess}
          />
        </TabPanel>

        <TabPanel header="💸 Saque">
          <TransactionCard
            type="withdraw"
            accountId={accountId}
            onSuccess={onSuccess}
          />
        </TabPanel>

        <TabPanel header="🔁 Transferência">
          <TransactionCard
            type="transfer"
            accountId={accountId}
            onSuccess={onSuccess}
          />
        </TabPanel>
      </TabView>
    </div>
  );
}