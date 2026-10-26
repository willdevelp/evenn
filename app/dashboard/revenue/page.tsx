"use client";

import { useMemo, useState } from "react";
import { Download, Menu, Search, Wallet } from "lucide-react";
import Sidebar from "@/src/components/dashboard/Sidebar";

type Transaction = {
  id: string;
  event: string;
  date: string;
  amount: number;
  commission: number;
  net: number;
  status: "Payee" | "En attente";
};

const transactions: Transaction[] = [
  { id: "TR-2048", event: "Concert de Jazz", date: "2026-09-14", amount: 2125, commission: 106.25, net: 2018.75, status: "Payee" },
  { id: "TR-2047", event: "Festival de la Bière", date: "2026-09-12", amount: 1080, commission: 54, net: 1026, status: "Payee" },
  { id: "TR-2046", event: "Conférence Tech", date: "2026-09-10", amount: 2880, commission: 144, net: 2736, status: "En attente" },
  { id: "TR-2045", event: "Soirée DJ", date: "2026-09-08", amount: 580, commission: 29, net: 551, status: "Payee" },
  { id: "TR-2044", event: "Exposition d'Art", date: "2026-09-05", amount: 430, commission: 21.5, net: 408.5, status: "Payee" },
];

const formatCurrency = (amount: number) =>
  amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

export default function RevenuePage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((transaction) => {
        const matchesSearch = transaction.event.toLowerCase().includes(search.toLowerCase()) || transaction.id.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [search, statusFilter]
  );

  const totalGmv = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalCommission = totalGmv * 0.05;
  const netRevenue = totalGmv - totalCommission;

  const exportTransactions = () => {
    const csv = [
      "Transaction;Événement;Date;GMV;Commission;Revenu net;Statut",
      ...filteredTransactions.map((transaction) => [transaction.id, transaction.event, transaction.date, transaction.amount, transaction.commission, transaction.net, transaction.status].join(";")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "historique-transactions.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50/60">
      <div className="hidden md:block"><Sidebar /></div>
      {mobileSidebarOpen && (
        <>
          <button type="button" aria-label="Fermer la navigation" onClick={() => setMobileSidebarOpen(false)} className="fixed inset-0 z-40 bg-slate-900/30 md:hidden" />
          <div className="md:hidden"><Sidebar onClose={() => setMobileSidebarOpen(false)} /></div>
        </>
      )}

      <main className="min-w-0 md:ml-64">
        <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
          <button type="button" aria-label="Ouvrir la navigation" onClick={() => setMobileSidebarOpen(true)} className="rounded-lg border border-slate-200 p-2 text-slate-600 md:hidden"><Menu className="h-5 w-5" /></button>
          <div className="flex-1 md:flex-none"><p className="text-sm font-medium text-[#2563EB]">Finance</p><h1 className="mt-1 text-2xl font-bold text-slate-900">Revenus</h1><p className="mt-1 hidden text-sm text-slate-500 sm:block">Suivez vos ventes, commissions et reversements.</p></div>
          <button type="button" onClick={exportTransactions} className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-3 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8]"><Download className="h-4 w-4" /><span className="hidden sm:inline">Exporter</span></button>
        </header>

        <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
          <section className="grid gap-4 md:grid-cols-3">
            <SummaryCard label="Total GMV" value={formatCurrency(totalGmv)} detail="Volume brut des ventes" />
            <SummaryCard label="Commission Evenza (5 %)" value={formatCurrency(totalCommission)} detail="Prélevée sur les ventes" />
            <SummaryCard label="Revenu net organisateur" value={formatCurrency(netRevenue)} detail="Montant disponible au retrait" accent />
          </section>

          <section className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]"><Wallet className="h-5 w-5" /></span><div><p className="text-sm text-slate-500">Solde disponible</p><p className="text-xl font-bold text-slate-900">{formatCurrency(netRevenue)}</p></div></div>
            <button type="button" className="rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8]">Demander un retrait</button>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="font-semibold text-slate-900">Historique des transactions</h2><p className="mt-1 text-sm text-slate-500">Consultez les ventes et reversements de vos événements.</p></div><div className="flex flex-col gap-3 sm:flex-row"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher..." className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#2563EB] sm:w-56" /></div><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#2563EB]"><option value="all">Tous les statuts</option><option value="Payee">Payées</option><option value="En attente">En attente</option></select></div></div>
            <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="border-b border-slate-200 bg-slate-50"><tr>{["Transaction", "Événement", "Date", "GMV", "Commission", "Net organisateur", "Statut"].map((heading) => <th key={heading} className="whitespace-nowrap px-5 py-3 text-left font-semibold text-slate-600">{heading}</th>)}</tr></thead><tbody>{filteredTransactions.map((transaction) => <tr key={transaction.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50"><td className="whitespace-nowrap px-5 py-4 font-medium text-slate-800">{transaction.id}</td><td className="whitespace-nowrap px-5 py-4 text-slate-700">{transaction.event}</td><td className="whitespace-nowrap px-5 py-4 text-slate-500">{new Date(transaction.date).toLocaleDateString("fr-FR")}</td><td className="whitespace-nowrap px-5 py-4 text-slate-700">{formatCurrency(transaction.amount)}</td><td className="whitespace-nowrap px-5 py-4 text-slate-500">-{formatCurrency(transaction.commission)}</td><td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-800">{formatCurrency(transaction.net)}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${transaction.status === "Payee" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{transaction.status}</span></td></tr>)}</tbody></table></div>
            {filteredTransactions.length === 0 && <p className="p-8 text-center text-sm text-slate-500">Aucune transaction trouvée.</p>}
          </section>
        </div>
      </main>
    </div>
  );
}

function SummaryCard({ label, value, detail, accent = false }: { label: string; value: string; detail: string; accent?: boolean }) {
  return <div className={`rounded-lg border bg-white p-5 ${accent ? "border-[#2563EB]/40" : "border-slate-200"}`}><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-slate-900">{value}</p><p className="mt-2 text-xs text-slate-500">{detail}</p></div>;
}
