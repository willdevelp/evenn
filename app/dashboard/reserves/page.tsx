"use client";

export type Reserve = {
    id: string;
    title: string;
    price: number;
    quantity: number;
    amount: number;
    nameReserve: string,
};

export default function Reserves() {
    // 📝 Mock réservations
    const reserves: Reserve[] = [
        { id: "1", title: "Salon Tech 2025", price: 120, quantity: 2, amount: 240, nameReserve: "Salon Tech 2025" },
        { id: "2", title: "Festival Digital", price: 80, quantity: 1, amount: 80, nameReserve: "Festival Digital" },
        { id: "3", title: "Conférence RH", price: 60, quantity: 3, amount: 180, nameReserve: "Conférence RH" },
    ];

    return (
        <div className="py-6 px-2">
            <section className="bg-white p-6 rounded-xl shadow border">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Réservations récentes</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom de la réservation</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantité</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Prix unitaire</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {reserves.map((r) => (
                                <tr key={r.id}>
                                    <td className="px-4 py-3 text-gray-700">{r.nameReserve}</td>
                                    <td className="px-4 py-3 font-medium text-gray-900">{r.title}</td>
                                    <td className="px-4 py-3 text-gray-700">{r.quantity}</td>
                                    <td className="px-4 py-3 text-gray-700">{r.price} €</td>
                                    <td className="px-4 py-3 font-semibold text-gray-900">{r.amount} €</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}