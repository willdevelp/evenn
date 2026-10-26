// app/dashboard/events/[id]/scan/page.js
'use client';

import { useState, useEffect, useRef, type FormEvent } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Html5Qrcode } from 'html5-qrcode';
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertCircle,
  QrCode,
  Edit,
  CalendarDays,
} from 'lucide-react';

type TicketValidationResult = {
  valid: boolean;
  used: boolean;
  message: string;
  participant?: string;
  ticket?: string;
};

// Mock API call to validate ticket
const validateTicket = async (code: string): Promise<TicketValidationResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock logic: codes starting with 'VALID' are valid, 'USED' are already used, others invalid
  if (code.startsWith('VALID')) {
    return { valid: true, used: false, message: '✅ Billet valide', participant: 'Jean Dupont', ticket: 'VIP' };
  } else if (code.startsWith('USED')) {
    return { valid: true, used: true, message: '❌ Billet déjà utilisé', participant: 'Marie Koffi', ticket: 'Standard' };
  } else {
    return { valid: false, used: false, message: '❌ Billet invalide' };
  }
};

export default function ScanPage() {
  const params = useParams<{ id?: string }>();
  const eventId = params.id ?? 'unknown';

  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<TicketValidationResult | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<InstanceType<typeof Html5Qrcode> | null>(null);

  // Start scanning
  const startScan = async () => {
    setError(null);
    setResult(null);
    setScanning(true);

    try {
      // Clean up any previous scanner
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
        } catch {
          // ignore cleanup errors
        }
        scannerRef.current = null;
      }

      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      await scanner.start(
        { facingMode: 'environment' },
        config,
        async (decodedText: string) => {
          // On successful scan
          setScanning(false);
          await scanner.stop();
          scannerRef.current = null;
          handleDecodedCode(decodedText);
        },
        () => {
          // Ignore errors (they are frequent while scanning)
        }
      );
    } catch (err) {
      setScanning(false);
      setError('Impossible d\'accéder à la caméra. Veuillez autoriser l\'accès ou saisir le code manuellement.');
      console.error(err);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.stop();
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, []);

  // Handle decoded code
  const handleDecodedCode = async (code: string) => {
    setLoading(true);
    try {
      const validation = await validateTicket(code);
      setResult(validation);
    } catch {
      setError('Erreur lors de la validation du billet.');
    } finally {
      setLoading(false);
    }
  };

  // Manual entry
  const handleManualSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    setResult(null);
    setError(null);
    await handleDecodedCode(manualCode.trim());
    setManualCode('');
  };

  // Reset scan
  const resetScan = () => {
    setResult(null);
    setError(null);
    setManualCode('');
    if (!scanning) {
      startScan();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/events/${eventId}`}
            className="p-2 hover:bg-gray-100 rounded-xl transition"
          >
            <ArrowLeft size={22} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-800">Scanner</h1>
            <p className="text-xs text-gray-500">Concert Afro Night</p>
          </div>
        </div>
        <span className="text-[#2563EB] font-medium text-sm flex items-center gap-1">
          <Camera size={16} /> Scan
        </span>
      </header>

      {/* Main content */}
      <div className="flex-1 p-4 max-w-lg mx-auto w-full space-y-4">
        {/* Camera view */}
        <div className="bg-black rounded-2xl overflow-hidden relative aspect-square max-h-[400px] w-full">
          <div id="qr-reader" className="w-full h-full" />
          {!scanning && !result && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 text-white">
              <QrCode size={64} className="text-white/50 mb-3" />
              <p className="text-sm font-medium">Appuyez pour scanner</p>
              <button
                onClick={startScan}
                className="mt-4 px-6 py-3 bg-[#2563EB] text-white rounded-xl font-semibold shadow-lg shadow-[#2563EB]/30 hover:shadow-[#2563EB]/50 transition"
              >
                Activer la caméra
              </button>
            </div>
          )}
          {scanning && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
              Recherche de QR Code...
            </div>
          )}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#2563EB] border-t-transparent" />
            </div>
          )}
        </div>

        {/* Result or error */}
        {result && (
          <div className={`p-4 rounded-2xl border ${
            result.valid && !result.used
              ? 'bg-emerald-50 border-emerald-200'
              : result.valid && result.used
              ? 'bg-amber-50 border-amber-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-3">
              {result.valid && !result.used ? (
                <CheckCircle size={28} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle size={28} className="text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-bold text-gray-800">{result.message}</p>
                {result.participant && (
                  <>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">{result.participant}</span> • {result.ticket}
                    </p>
                    {result.used && (
                      <p className="text-xs text-amber-700 mt-1">
                        Ce billet a déjà été scanné le 20/08/2026 à 19:45.
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={resetScan}
                className="flex-1 py-2 bg-[#2563EB] text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition"
              >
                <RefreshCw size={18} /> Scanner un autre
              </button>
              {result.valid && !result.used && (
                <button
                  className="flex-1 py-2 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Valider l&apos;entrée
                </button>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
            <AlertCircle size={24} className="text-red-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-700">Erreur</p>
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-sm text-[#2563EB] font-medium hover:underline"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Manual entry */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Edit size={16} className="text-gray-400" /> Saisie manuelle
          </p>
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Entrez le code du billet"
              className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition text-sm"
              disabled={scanning}
            />
            <button
              type="submit"
              disabled={scanning || !manualCode.trim()}
              className="px-4 py-2 bg-[#2563EB] text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1d4ed8] transition"
            >
              Vérifier
            </button>
          </form>
        </div>

        {/* Instructions */}
        <div className="text-center text-xs text-gray-400 space-y-1">
          <p>Scannez le QR Code présent sur le billet du participant.</p>
          <p>Assurez-vous d&apos;avoir une bonne luminosité.</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-3 px-4 text-center text-xs text-gray-400">
        <p className="flex items-center justify-center gap-1">
          <CalendarDays size={12} /> Evenza • Scan de billets
        </p>
      </footer>
    </div>
  );
}