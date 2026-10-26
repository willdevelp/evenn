"use client";

import { useState } from "react";
import { useReserve } from "@/context/ReserveContext";
import { useRouter } from "next/navigation";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Ticket } from "@/lib/definition";
import { createReservation } from "@/lib/actions/reservations/create-reservation";
// import {
//   FaCalendar,
//   FaMapPin,
//   FaTicketAlt
// } from "react-icons/fa";

type EventData = {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  image: string;
  place: number;
  price: number;
  tickets?: Ticket[];
};

export default function ReserveForm({ data }: { data: EventData }) {
  const router = useRouter();
  const { setReserve } = useReserve();

  // États pour le calcul dynamique
  const [selectedTicketId, setSelectedTicketId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  // Trouver le ticket sélectionné
  const selectedTicket = data.tickets?.find(
    (t) => t.id === selectedTicketId
  );
  const unitPrice = selectedTicket?.price || 0;
  const total = unitPrice * quantity;

  const handleReserve = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      const reservation = await createReservation({
        eventId: data.id,
        ticketTypeId: selectedTicketId,
        quantity,
        buyerName: formData.get("buyerName"),
        buyerEmail: formData.get("buyerEmail"),
        buyerPhone: formData.get("buyerPhone") ?? "",
      });
      setReserve({
        title: reservation.eventTitle,
        price: reservation.price,
        quantity: reservation.quantity,
        amount: reservation.amount,
      });
      router.push(`/checkout?order=${reservation.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <DialogTrigger asChild>
        <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] text-lg">
          Réserver maintenant
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl border-0 shadow-2xl">
        <form onSubmit={handleReserve} className="bg-white rounded-2xl">
          {/* En-tête avec dégradé */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white">
                Réserver votre place
              </DialogTitle>
              <DialogDescription className="text-indigo-100">
                Complétez les informations ci-dessous pour finaliser votre réservation.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Corps du formulaire */}
          <div className="p-6 space-y-6">
            {/* Informations sur l'événement (résumé) */}
            {/* <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <FaCalendar className="w-5 h-5 text-indigo-600" />
                <span className="font-medium text-gray-700">{data.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapPin className="w-5 h-5 text-indigo-600" />
                <span className="text-gray-600">{data.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaTicketAlt className="w-5 h-5 text-indigo-600" />
                <span className="text-gray-600">
                  {data.tickets?.length || 0} catégorie(s) de billets
                </span>
              </div>
            </div> */}

            {/* Sélection du billet */}
            <div className="space-y-2">
              <Label htmlFor="ticket-select" className="text-base font-semibold">
                Choisissez votre billet
              </Label>
              <Select
                onValueChange={(value) => setSelectedTicketId(value)}
              >
                <SelectTrigger id="ticket-select" className="h-12 text-base">
                  <SelectValue placeholder="Sélectionner un billet" />
                </SelectTrigger>
                <SelectContent>
                  {data.tickets?.map((ticket) => (
                    <SelectItem key={ticket.id} value={ticket.id}>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-indigo-600 font-bold">
                           {ticket.name} – {ticket.price} FCFA
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTicket && (
                <p className="text-xs text-gray-500 mt-1">
                  {selectedTicket.name} – {selectedTicket.price} FCFA lunité
                </p>
              )}
            </div>

            {/* Quantité */}
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-base font-semibold">
                Nombre de billets
              </Label>
              <Input
                id="quantity"
                type="number"
                name="quantity"
                min="1"
                max={
                  selectedTicket
                    ? Math.max(selectedTicket.quantity - selectedTicket.sold, 1)
                    : 10
                }
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="h-12 text-base"
              />
              {selectedTicket && (
                <p className="text-xs text-gray-500">
                  Maximum {Math.max(selectedTicket.quantity - selectedTicket.sold, 0)} disponible(s)
                </p>
              )}
            </div>

            {/* Nom */}
            <div className="space-y-2">
              <Label htmlFor="buyerName" className="text-base font-semibold">
                Votre nom complet
              </Label>
              <Input
                id="buyerName"
                type="text"
                name="buyerName"
                placeholder="Nom et prénom"
                required
                minLength={2}
                className="h-12 text-base"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold">
                Votre adresse email
              </Label>
              <Input
                id="email"
                type="email"
                name="buyerEmail"
                placeholder="votre@email.com"
                required
                className="h-12 text-base"
              />
            </div>

            {/* Téléphone */}
            <div className="space-y-2">
              <Label htmlFor="buyerPhone" className="text-base font-semibold">
                Téléphone <span className="font-normal text-gray-400">(optionnel)</span>
              </Label>
              <Input
                id="buyerPhone"
                type="tel"
                name="buyerPhone"
                placeholder="+237 6 00 00 00 00"
                className="h-12 text-base"
              />
            </div>

            {/* Résumé et total */}
            {selectedTicket && quantity > 0 && (
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">Prix unitaire</span>
                  <span className="font-medium">{unitPrice} FCFA</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">Quantité</span>
                  <span className="font-medium">× {quantity}</span>
                </div>
                <div className="border-t border-indigo-200 mt-2 pt-2 flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-indigo-700">{total} FCFA</span>
                </div>
              </div>
            )}
          </div>

          {/* Pied de formulaire */}
          <DialogFooter className="p-6 pt-0 flex-col sm:flex-row gap-3">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                Annuler
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={!selectedTicket || quantity < 1}
              className="w-full sm:w-auto order-1 sm:order-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
            >
              Confirmer la réservation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </>
  );
}