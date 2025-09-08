"use client";

import QRCode from "qrcode";
import { QRCodeCanvas } from "qrcode.react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

type ReserveType = {
  title: string;
  price: number;
  quantity: number;
  amount: number;
}[] | null;

export default function QRCodes({ reserve }: { reserve: ReserveType }) {
  const firstTicket = 0;

  if (!reserve || reserve.length === 0) {
    return <div>Aucune réservation trouvée</div>;
  }

  // Télécharger tous les QR codes en ZIP
  const downloadAllQR = async () => {
    const zip = new JSZip();

    for (let i = 0; i < reserve[0].quantity; i++) {
      const qrData = await QRCode.toDataURL(
        JSON.stringify({
          event: reserve[0].title,
          ticket: i + 1,
          quantity: reserve[0].quantity,
        })
      );

      const base64Data = qrData.split(",")[1]; // enlever le préfixe
      zip.file(`ticket-${i + 1}.png`, base64Data, { base64: true });
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `tickets-${reserve[0].title}.zip`);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        🎟️ Aperçu de votre billet pour {reserve[0].title}
      </h1>

      {/* Aperçu d’un seul QR code */}
      <div className="flex flex-col items-center space-y-4 border p-6 rounded-lg shadow-md mb-6">
        <QRCodeCanvas
          value={JSON.stringify({
            event: reserve[0].title,
            ticket: firstTicket + 1,
            quantity: reserve[0].quantity,
          })}
          size={200}
          level="H"
          includeMargin={true}
        />
        <p>Billet {firstTicket + 1} sur {reserve[0].quantity}</p>
      </div>

      {/* Bouton pour télécharger tous les billets */}
      <button
        onClick={downloadAllQR}
        className="px-4 py-2 bg-green-600 text-white rounded-lg"
      >
        📦 Télécharger tous les tickets ({reserve[0].quantity})
      </button>
    </div>
  );
}