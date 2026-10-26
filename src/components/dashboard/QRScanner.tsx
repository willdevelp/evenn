"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
import { Scan } from "lucide-react";

interface QRScannerProps {
  onScan: (data: string) => void;
  onError?: (error: Error) => void;
}

export default function QRScanner({ onScan, onError }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const [scanner, setScanner] = useState<BrowserMultiFormatReader | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    setScanner(reader);

    return () => {
      controlsRef.current?.stop(); // ✅ STOP PROPRE
    };
  }, []);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!scanner || !videoEl) return;

    const startScan = async () => {
      try {
        setScanning(true);

        const controls = await scanner.decodeFromVideoDevice(
          undefined,
          videoEl,
          (result) => {
            if (result) {
              onScan(result.getText());

              // 🔥 Stop après scan (optionnel mais recommandé)
              controlsRef.current?.stop();
              setScanning(false);
            }
          }
        );

        controlsRef.current = controls;
      } catch (error) {
        console.error("Erreur caméra:", error);
        onError?.(error as Error);
        setScanning(false);
      }
    };

    startScan();

    return () => {
      controlsRef.current?.stop(); // ✅ cleanup React
      setScanning(false);
    };
  }, [scanner]);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        className="w-full aspect-square object-cover rounded-xl bg-black"
        style={{ transform: "scaleX(-1)" }}
      />

      {!scanning && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
          <div className="text-white text-center">
            <Scan className="h-12 w-12 mx-auto mb-2 animate-pulse" />
            <p>Activation de la caméra...</p>
          </div>
        </div>
      )}
    </div>
  );
}