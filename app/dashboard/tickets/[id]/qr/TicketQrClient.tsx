"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import { ArrowLeft, Download, Printer, Ticket } from "lucide-react";
import { toast } from "sonner";

import DashboardShell from "@/src/components/dashboard/DashboardShell";
import type { TicketQrData } from "@/lib/actions/dashboard/get-dashboard-data";

export default function TicketQrClient({ ticket }: { ticket: TicketQrData }) {
  const router = useRouter();
  const qrRef = useRef<HTMLDivElement>(null);

  const formatPrice = () => `${ticket.price.toLocaleString("fr-FR")} ${ticket.currency}`;

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) {
      toast.error("Impossible de générer le QR code.");
      return;
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
      toast.error("Impossible de générer le QR code.");
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const image = new Image();
    image.onload = () => {
      canvas.width = 600;
      canvas.height = 600;
      context.fillStyle = "#FFFFFF";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const link = document.createElement("a");
      link.download = `billet-${ticket.code}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("QR code téléchargé.");
    };
    image.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <DashboardShell
      title="Billet électronique"
      description="Présentez ce QR code à l’entrée de l’événement."
      action={
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <ArrowLeft className="size-4" /> Retour
        </button>
      }
    >
      <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50">
        <div className="flex items-center gap-3 bg-brand-600 p-6 text-white">
          <span className="flex size-11 items-center justify-center rounded-xl bg-white/15">
            <Ticket className="size-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold">Billet électronique</h2>
            <p className="text-sm text-brand-100">Un seul scan suffit pour valider l’entrée.</p>
          </div>
        </div>

        <div className="space-y-6 p-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-slate-500">Événement</dt>
              <dd className="mt-1 font-medium text-slate-900">{ticket.event}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Formule</dt>
              <dd className="mt-1 font-medium text-slate-900">{ticket.ticketType}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Titulaire</dt>
              <dd className="mt-1 font-medium text-slate-900">{ticket.holderName}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Email</dt>
              <dd className="mt-1 break-all font-medium text-slate-900">
                {ticket.holderEmail || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Prix</dt>
              <dd className="mt-1 font-medium text-slate-900">{formatPrice()}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Commande</dt>
              <dd className="mt-1 font-medium text-slate-900">{ticket.orderNumber ?? "—"}</dd>
            </div>
          </dl>

          <div className="flex flex-col items-center justify-center border-t border-slate-100 py-6">
            <div ref={qrRef} className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
              <QRCode
                value={ticket.code}
                size={220}
                level="H"
                fgColor="#0F172A"
                bgColor="#FFFFFF"
              />
            </div>
            <p className="mt-4 break-all text-center font-mono text-xs text-slate-400">
              {ticket.code}
            </p>
            <p className="mt-1 text-sm text-slate-500">Code unique • À scanner à l’entrée</p>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={downloadQR}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              <Download className="size-4" /> Télécharger
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Printer className="size-4" /> Imprimer
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
