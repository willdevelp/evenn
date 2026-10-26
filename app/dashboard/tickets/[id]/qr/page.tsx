"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import QRCode from "react-qr-code"; // ✅ Import fonctionne par défaut
import { Download, Printer, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useRef } from "react";

// Données mockées (à remplacer par votre API)
const mockTicket = {
  id: "1",
  event: "Concert de Jazz",
  name: "VIP",
  price: 25,
  buyer: "Marie Dupont",
  email: "marie@example.com",
  seat: "A12",
  code: "TICKET-ABC-123-XYZ",
};

export default function TicketQRPage() {
  const params = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState(mockTicket);
  const [loading, setLoading] = useState(true);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, [params.id]);

  const downloadQR = () => {
    // Récupérer l'élément SVG du QR Code
    const svg = qrRef.current?.querySelector("svg");
    if (svg) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const link = document.createElement("a");
        link.download = `ticket-${ticket.code}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        toast.success("QR Code téléchargé !");
      };
      img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    } else {
      toast.error("Erreur lors du téléchargement");
    }
  };

  const printQR = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-gray-500">Chargement du ticket...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* En-tête */}
        <div className="bg-indigo-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Billet électronique</h1>
          <p className="text-indigo-100">Présentez ce QR Code à l&apos;entrée</p>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Événement</p>
              <p className="font-medium text-gray-900">{ticket.event}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type de ticket</p>
              <p className="font-medium text-gray-900">{ticket.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Acheteur</p>
              <p className="font-medium text-gray-900">{ticket.buyer}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{ticket.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Prix</p>
              <p className="font-medium text-gray-900">{ticket.price} €</p>
            </div>
            {ticket.seat && (
              <div>
                <p className="text-sm text-gray-500">Place</p>
                <p className="font-medium text-gray-900">{ticket.seat}</p>
              </div>
            )}
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center justify-center py-6 border-t border-gray-100">
            <div ref={qrRef} className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
              <QRCode
                value={ticket.code}
                size={200}
                level="H"
                fgColor="#1E1B4B"
                bgColor="#FFFFFF"
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400 font-mono">{ticket.code}</p>
              <p className="text-sm text-gray-500 mt-1">Code unique • À scanner à l&apos;entrée</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={downloadQR}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm"
            >
              <Download className="h-4 w-4" />
              Télécharger
            </button>
            <button
              onClick={printQR}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm"
            >
              <Printer className="h-4 w-4" />
              Imprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}