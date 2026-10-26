"use client";

import { useState, useEffect } from "react";
import { Search, Calendar, Download } from "lucide-react";

const mockHistory = [
  { id: 1, event: "Concert de Jazz", buyer: "Marie Dupont", ticket: "VIP", scannedAt: "2026-07-15 14:32", status: "valid" },
  { id: 2, event: "Concert de Jazz", buyer: "Jean Martin", ticket: "Standard", scannedAt: "2026-07-15 14:15", status: "valid" },
  { id: 3, event: "Festival de la Bière", buyer: "Sophie Lefèvre", ticket: "VIP", scannedAt: "2026-07-14 13:50", status: "valid" },
  { id: 4, event: "Concert de Jazz", buyer: "Paul Dubois", ticket: "Standard", scannedAt: "2026-07-14 12:10", status: "invalid" },
];

export default function ScanHistoryPage() {
  const [history, setHistory] = useState(mockHistory);
  const [search, setSearch] = useState("");

  const filtered = history.filter((h) =>
    h.event.toLowerCase().includes(search.toLowerCase()) ||
    h.buyer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Historique des entrées</h1>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Événement</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Acheteur</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Ticket</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Scanné à</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-800">{entry.event}</td>
                  <td className="px-4 py-3 text-gray-600">{entry.buyer}</td>
                  <td className="px-4 py-3 text-gray-600">{entry.ticket}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(entry.scannedAt).toLocaleString("fr-FR")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        entry.status === "valid"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {entry.status === "valid" ? "✅ Entrée validée" : "❌ Refusé"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}