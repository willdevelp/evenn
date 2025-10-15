import { getUser } from "@/lib/auth-server";
import { FaPlus } from "react-icons/fa";
import SalesChart from "@/src/components/ui/saleschart";
import { ChartData } from "chart.js";

export default async function DashboardPage() {
  const user = await getUser();

  // 📊 Données statistiques simulées
  const eventCount = 4;
  const ticketSold = 350;
  const revenue = "1.200.000 FCFA";

  // 📈 Données du graphique de ventes (simulées)
  const salesChartData: ChartData<"line"> = {
    labels: ["Juin", "Juil", "Août", "Sept"],
    datasets: [
      {
        label: "Billets vendus",
        data: [80, 150, 60, 100],
        fill: false,
        borderColor: "#6366f1",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="p-6">
      <header className="flex justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Bienvenue, {user?.name || "Entreprise Demo"} 👋
          </h1>
          <p className="text-gray-600 mt-1">Plan actuel : <strong>Entreprise</strong></p>
        </div>
        <div className="items-center">
          <button className="flex items-center space-x-2 border bg-indigo-500 text-white p-2 rounded-sm">
            <FaPlus />
            <span>Créer un évènement</span>
          </button>
        </div>
      </header>

      {/* Section des statistiques */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard label="Évènements créés" value={eventCount} />
        <StatCard label="Billets vendus" value={ticketSold} />
        <StatCard label="Revenu généré" value={revenue} />
      </section>

      {/* Graphique des ventes */}
      <section className="bg-white px-6 py-6 rounded-xl shadow-lg mb-10">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Ventes de billets (4 derniers mois)</h2>
        <SalesChart data={salesChartData} />
      </section>
    </div>
  );
}

// Composant carte de statistique
interface StatCardProps {
  label: string;
  value: string | number;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
  );
}