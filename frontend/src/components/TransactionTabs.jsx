import { TabView, TabPanel } from "primereact/tabview";
import TransactionCard from "./TransactionCard";

export default function TransactionTabs({ account }) {
  return (
    <TabView>
      <TabPanel header="Depósito">
        <TransactionCard type="deposit" account={account} />
      </TabPanel>

      <TabPanel header="Saque">
        <TransactionCard type="withdraw" account={account} />
      </TabPanel>

      <TabPanel header="Transferência">
        <TransactionCard type="transfer" account={account} />
      </TabPanel>
    </TabView>
  );
}