"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { QRCodeCanvas } from "qrcode.react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Download, Loader2, Ticket } from "lucide-react";
import { toast } from "sonner";

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
  logoUrl,
}: {
  tickets: TicketQr[];
  eventTitle: string;
  logoUrl?: string | null;
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
        const dataUrl = await createTicketQrDataUrl(tickets[index].qrToken, logoUrl);
        zip.file(`billet-${index + 1}.png`, dataUrl.split(",")[1], {
          base64: true,
        });
      }
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `billets-${slugify(eventTitle)}.zip`);
    } catch (error) {
      console.error("Erreur lors de la génération des QR codes :", error);
      toast.error("Impossible de générer les QR codes.");
    } finally {
      setDownloading(false);
    }
  };

  const downloadOne = async (ticket: TicketQr, index: number) => {
    try {
      const dataUrl = await createTicketQrDataUrl(ticket.qrToken, logoUrl);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `billet-${index + 1}.png`;
      link.click();
    } catch (error) {
      console.error("Erreur lors de la génération du QR code :", error);
      toast.error("Impossible de générer le QR code.");
    }
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
              <QRCodeCanvas
                value={ticket.qrToken}
                size={150}
                level="H"
                marginSize={4}
                imageSettings={
                  logoUrl
                    ? {
                        src: logoUrl,
                        width: 32,
                        height: 32,
                        excavate: true,
                        crossOrigin: "anonymous",
                      }
                    : undefined
                }
              />
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

async function createTicketQrDataUrl(value: string, logoUrl?: string | null) {
  const dataUrl = await QRCode.toDataURL(value, {
    width: 600,
    margin: 2,
    errorCorrectionLevel: "H",
  });
  if (!logoUrl) return dataUrl;

  try {
    const logo = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Le logo n’a pas pu être chargé."));
      image.src = logoUrl;
    });

    const qrImage = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Le QR code n’a pas pu être chargé."));
      image.src = dataUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 600;
    const context = canvas.getContext("2d");
    if (!context) return dataUrl;
    context.drawImage(qrImage, 0, 0, 600, 600);
    context.fillStyle = "#FFFFFF";
    context.fillRect(240, 240, 120, 120);
    context.drawImage(logo, 250, 250, 100, 100);
    return canvas.toDataURL("image/png");
  } catch {
    return dataUrl;
  }
}
