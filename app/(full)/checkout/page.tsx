"use client";

import { useReserve } from "@/context/ReserveContext";
import Code from "@/src/components/ui/code";

export default function CheckOut() {
    const { reserve } = useReserve();

    if (!reserve) {
        return (
            <div className="p-6">
                <h1 className="text-xl font-bold mb-4">Aucune réservation trouvée</h1>
            </div>
        );
    }

    const total = reserve.price * reserve.quantity;

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Récapitulatif</h1>
            <p>Événement : {reserve.title}</p>
            <p>Prix unitaire : {reserve.price} FCFA</p>
            <p>Quantité : {reserve.quantity}</p>
            <p className="font-semibold">
                Total : {total} FCFA
            </p>
            <p>Amusez-vous bien !</p>

            <Code reserve={[reserve]} />
        </div>
    );
}