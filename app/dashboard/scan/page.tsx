"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Camera,
  CameraOff,
  CheckCircle2,
  History,
  Keyboard,
  Loader2,
  QrCode,
  XCircle,
} from "lucide-react";

import DashboardShell from "@/src/components/dashboard/DashboardShell";
import { validateTicket, type ScanValidation } from "@/lib/actions/scans/validate-ticket";

type ScannerHandle = {
  stop: () => Promise<void>;
  clear: () => void;
};

const outcomeStyles: Record<
  ScanValidation["outcome"],
  { title: string; wrapper: string; icon: typeof CheckCircle2; iconColor: string }
> = {
  valid: {
    title: "Entrée validée",
    wrapper: "border-emerald-200 bg-emerald-50",
    icon: CheckCircle2,
    iconColor: "text-emerald-600",
  },
  already_used: {
    title: "Billet déjà utilisé",
    wrapper: "border-amber-200 bg-amber-50",
    icon: AlertTriangle,
    iconColor: "text-amber-600",
  },
  cancelled: {
    title: "Billet non valable",
    wrapper: "border-red-200 bg-red-50",
    icon: XCircle,
    iconColor: "text-red-600",
  },
  invalid: {
    title: "Billet introuvable",
    wrapper: "border-red-200 bg-red-50",
    icon: XCircle,
    iconColor: "text-red-600",
  },
};

const formatDateTime = (value: string | null | undefined) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export default function ScanPage() {
  const [scanning, setScanning] = useState(false);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ScanValidation | null>(null);
  const [manualCode, setManualCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<ScannerHandle | null>(null);

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    scannerRef.current = null;
    if (!scanner) return;
    try {
      await scanner.stop();
      scanner.clear();
    } catch {
      // Le scanner est déjà arrêté.
    }
  }, []);

  useEffect(() => {
    return () => {
      void stopScanner();
    };
  }, [stopScanner]);

  const submitCode = useCallback(async (code: string) => {
    const value = code.trim();
    if (!value) return;

    setPending(true);
    setError(null);
    try {
      const validation = await validateTicket(
        value,
        typeof navigator === "undefined" ? undefined : navigator.userAgent,
      );
      setResult(validation);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "La validation a échoué.");
    } finally {
      setPending(false);
    }
  }, []);

  const startScan = async () => {
    setError(null);
    setResult(null);
    setScanning(true);

    try {
      await stopScanner();
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner as unknown as ScannerHandle;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          await stopScanner();
          setScanning(false);
          await submitCode(decodedText);
        },
        () => {
          // Les images sans QR code sont ignorées silencieusement.
        },
      );
    } catch {
      scannerRef.current = null;
      setScanning(false);
      setError(
        "Impossible d’accéder à la caméra. Autorisez l’accès ou saisissez le code manuellement.",
      );
    }
  };

  const handleStop = async () => {
    await stopScanner();
    setScanning(false);
  };

  const handleManualSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitCode(manualCode);
    setManualCode("");
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  const outcome = result ? outcomeStyles[result.outcome] : null;
  const OutcomeIcon = outcome?.icon;

  return (
    <DashboardShell
      title="Contrôle d’accès"
      description="Scannez les billets de vos événements pour valider les entrées."
      action={
        <Link
          href="/dashboard/scan/history"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <History className="size-4" /> Historique
        </Link>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <QrCode className="size-5" />
            </span>
            <div>
              <h2 className="font-semibold text-slate-900">Scanner un billet</h2>
              <p className="text-sm text-slate-500">
                Placez le QR code du billet dans le cadre.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-900/95">
            <div id="qr-reader" className="min-h-[280px] w-full [&_video]:w-full" />
            {!scanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900/95 p-6 text-center">
                <Camera className="size-8 text-slate-400" />
                <p className="text-sm text-slate-300">
                  La caméra n’est pas active.
                </p>
                <button
                  type="button"
                  onClick={startScan}
                  disabled={pending}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
                >
                  <Camera className="size-4" /> Activer la caméra
                </button>
              </div>
            )}
          </div>

          {scanning && (
            <button
              type="button"
              onClick={handleStop}
              className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <CameraOff className="size-4" /> Arrêter la caméra
            </button>
          )}

          <form onSubmit={handleManualSubmit} className="mt-6 space-y-3 border-t border-slate-100 pt-6">
            <label htmlFor="manual-code" className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Keyboard className="size-4 text-slate-400" /> Saisie manuelle
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id="manual-code"
                value={manualCode}
                onChange={(event) => setManualCode(event.target.value)}
                placeholder="Code du billet"
                autoComplete="off"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
              <button
                type="submit"
                disabled={pending || manualCode.trim().length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pending ? <Loader2 className="size-4 animate-spin" /> : <QrCode className="size-4" />}
                Valider
              </button>
            </div>
          </form>
        </section>

        <section className="space-y-4">
          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
              <AlertTriangle className="mt-0.5 size-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {!result && !error && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
              <QrCode className="mx-auto size-8 text-slate-300" />
              <p className="mt-3 text-sm font-semibold text-slate-700">Aucun scan en cours</p>
              <p className="mt-1 text-sm text-slate-500">
                Le résultat de la validation s’affichera ici.
              </p>
            </div>
          )}

          {result && outcome && OutcomeIcon && (
            <div className={`rounded-2xl border p-5 ${outcome.wrapper}`}>
              <div className="flex items-start gap-3">
                <OutcomeIcon className={`mt-0.5 size-6 shrink-0 ${outcome.iconColor}`} />
                <div className="min-w-0">
                  <h2 className="font-semibold text-slate-900">{outcome.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">{result.message}</p>
                </div>
              </div>

              <dl className="mt-5 space-y-3 border-t border-black/5 pt-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Participant</dt>
                  <dd className="text-right font-medium text-slate-800">
                    {result.holderName ?? "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Événement</dt>
                  <dd className="text-right font-medium text-slate-800">
                    {result.eventTitle ?? "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Formule</dt>
                  <dd className="text-right font-medium text-slate-800">
                    {result.ticketType ?? "—"}
                  </dd>
                </div>
                {formatDateTime(result.scannedAt) && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Scanné le</dt>
                    <dd className="text-right font-medium text-slate-800">
                      {formatDateTime(result.scannedAt)}
                    </dd>
                  </div>
                )}
              </dl>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Scanner un autre billet
                </button>
                <Link
                  href="/dashboard/scan/history"
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-white/60"
                >
                  Voir l’historique
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}
