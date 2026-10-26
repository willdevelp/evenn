"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { QRCodeCanvas } from "qrcode.react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Download, Loader2, Ticket } from "lucide-react";

export type TicketQr = {
  id: string;
  qrToken: string;
  holderName?: string | null;
  ticketTypeName?: string;
};

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "evenement";

export default function TicketCodes({
  tickets,
  eventTitle,
}: {
  tickets: TicketQr[];
  eventTitle: string;
}) {
  const [downloading, setDownloading] = useState(false);

  if (tickets.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
        Aucun billet n&apos;a encore été émis pour cette réservation.
      </div>
    );
  }

  const downloadAll = async () => {
    setDownloading(true);
    try {
      const zip = new JSZip();
      for (let index = 0; index < tickets.length; index += 1) {
        const dataUrl = await QRCode.toDataURL(tickets[index].qrToken, {
          width: 600,
          margin: 2,
        });
        zip.file(`billet-${index + 1}.png`, dataUrl.split(",")[1], {
          base64: true,
        });
      }
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `billets-${slugify(eventTitle)}.zip`);
    } finally {
      setDownloading(false);
    }
  };

  const downloadOne = async (ticket: TicketQr, index: number) => {
    const dataUrl = await QRCode.toDataURL(ticket.qrToken, {
      width: 600,
      margin: 2,
    });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `billet-${index + 1}.png`;
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {tickets.map((ticket, index) => (
          <div
            key={ticket.id}
            className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm"
          >
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <QRCodeCanvas value={ticket.qrToken} size={150} level="H" includeMargin />
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
              <Ticket size={14} className="text-blue-600" />
              Billet {index + 1} / {tickets.length}
            </p>
            {ticket.ticketTypeName && (
              <p className="text-xs text-slate-500">{ticket.ticketTypeName}</p>
            )}
            {ticket.holderName && (
              <p className="mt-1 text-xs text-slate-500">{ticket.holderName}</p>
            )}
            <button
              type="button"
              onClick={() => void downloadOne(ticket, index)}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Download size={13} /> Télécharger
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => void downloadAll()}
        disabled={downloading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
      >
        {downloading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Download size={16} />
        )}
        {downloading
          ? "Préparation du fichier..."
          : `Télécharger tous les billets (${tickets.length})`}
      </button>
      <p className="text-center text-xs text-slate-400">
        Présentez chaque QR code à l&apos;entrée de l&apos;événement.
      </p>
    </div>
  );
}
