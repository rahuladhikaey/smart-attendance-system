import React, { useState, useEffect } from 'react';
import { QrCode, Zap, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '../ui/Button';

export interface QRScannerProps {
  onScanSuccess: (tokenString: string) => void;
  onScanFailure?: (error: string) => void;
  status: 'IDLE' | 'SCANNING' | 'VALIDATING' | 'SUCCESS' | 'ERROR';
  errorMessage?: string;
  onRetry?: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({
  onScanSuccess,
  status,
  errorMessage,
  onRetry,
}) => {
  const [torchOn, setTorchOn] = useState(false);
  const [scanMode, setScanMode] = useState<'VALID' | 'EXPIRED' | 'WRONG_CLASS'>('VALID');

  // Trigger simulated scan after 2 seconds when entering scanning state
  useEffect(() => {
    if (status === 'SCANNING') {
      const timer = setTimeout(() => {
        let fakePayload = `ATTENDANCE_V1::${btoa(
          JSON.stringify({
            sessionId: 'sess-live-101',
            classId: 'cls-1',
            nonce: 7492,
            issuedAt: Date.now(),
            expiresAt: Date.now() + 25000,
          })
        )}`;

        if (scanMode === 'EXPIRED') {
          fakePayload = `ATTENDANCE_V1::${btoa(
            JSON.stringify({
              sessionId: 'sess-live-101',
              classId: 'cls-1',
              nonce: 1022,
              issuedAt: Date.now() - 60000,
              expiresAt: Date.now() - 30000,
            })
          )}`;
        } else if (scanMode === 'WRONG_CLASS') {
          fakePayload = `ATTENDANCE_V1::${btoa(
            JSON.stringify({
              sessionId: 'sess-other-999',
              classId: 'cls-99',
              nonce: 8841,
              issuedAt: Date.now(),
              expiresAt: Date.now() + 25000,
            })
          )}`;
        }

        onScanSuccess(fakePayload);
      }, 2200);

      return () => clearTimeout(timer);
    }
  }, [status, scanMode, onScanSuccess]);

  return (
    <div className="bg-[#0B0B0B] border border-[#262626] rounded-2xl p-6 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-2xl">
      {/* Scanner Viewfinder Box */}
      <div className="relative w-full max-w-xs aspect-square bg-[#050505] rounded-2xl overflow-hidden border border-[#262626] flex items-center justify-center">
        {/* Subtle camera noise/gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

        {/* Viewfinder Target Frame */}
        <div className="relative w-52 h-52 border border-neutral-700/60 rounded-xl flex items-center justify-center">
          {/* Laser Scanning Line */}
          {(status === 'SCANNING' || status === 'VALIDATING') && (
            <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_12px_#ffffff] animate-scan-line z-20" />
          )}

          {/* Corner Guides */}
          <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-white rounded-tl" />
          <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-white rounded-tr" />
          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-white rounded-bl" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-white rounded-br" />

          {/* Center QR watermark */}
          <QrCode className="w-20 h-20 text-neutral-800" />
        </div>

        {/* Top Controls Overlay */}
        <div className="absolute top-3 right-3 z-30">
          <button
            type="button"
            onClick={() => setTorchOn(!torchOn)}
            className={clsx(
              'p-2 rounded-full border text-xs transition-colors',
              torchOn ? 'bg-white text-black border-white' : 'bg-black/60 text-white border-[#333333]'
            )}
          >
            <Zap className="w-4 h-4" />
          </button>
        </div>

        {/* Flash Simulation */}
        {torchOn && <div className="absolute inset-0 bg-white/10 pointer-events-none z-10" />}
      </div>

      {/* State Feedback */}
      <div className="w-full mt-5 space-y-3">
        {status === 'SCANNING' && (
          <div className="flex items-center justify-center gap-2 text-neutral-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>Align camera with live class QR code...</span>
          </div>
        )}

        {status === 'VALIDATING' && (
          <div className="flex items-center justify-center gap-2 text-neutral-300 text-xs font-mono">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
            <span>Validating dynamic token & nonce...</span>
          </div>
        )}

        {status === 'SUCCESS' && (
          <div className="bg-[#121812] border border-emerald-900/60 rounded-xl p-3.5 text-left">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>QR Code Verified</span>
            </div>
            <p className="text-xs text-neutral-300 mt-1">
              Live token signature confirmed for this classroom session.
            </p>
          </div>
        )}

        {status === 'ERROR' && (
          <div className="bg-[#181111] border border-red-900/60 rounded-xl p-3.5 text-left">
            <div className="flex items-center gap-2 text-red-400 text-xs font-semibold">
              <AlertCircle className="w-4 h-4" />
              <span>QR Verification Failed</span>
            </div>
            <p className="text-xs text-neutral-300 mt-1">{errorMessage || 'Invalid QR code.'}</p>
            {onRetry && (
              <Button variant="secondary" size="sm" className="mt-3 w-full text-xs" onClick={onRetry}>
                Scan Again
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Demo QR Simulator Mode Selector */}
      <div className="w-full mt-5 pt-4 border-t border-[#1C1C1C] flex flex-col gap-2 text-[11px] text-neutral-400 text-left">
        <span className="font-mono text-neutral-500">Demo QR Test Scenarios:</span>
        <div className="grid grid-cols-3 gap-1.5 font-mono">
          <button
            type="button"
            onClick={() => setScanMode('VALID')}
            className={clsx(
              'px-2 py-1 rounded border text-[10px] text-center transition-colors',
              scanMode === 'VALID' ? 'bg-white text-black font-semibold border-white' : 'bg-[#141414] text-neutral-400 border-[#262626]'
            )}
          >
            Valid Live QR
          </button>
          <button
            type="button"
            onClick={() => setScanMode('EXPIRED')}
            className={clsx(
              'px-2 py-1 rounded border text-[10px] text-center transition-colors',
              scanMode === 'EXPIRED' ? 'bg-red-950/60 text-red-300 border-red-800 font-semibold' : 'bg-[#141414] text-neutral-400 border-[#262626]'
            )}
          >
            Expired Token
          </button>
          <button
            type="button"
            onClick={() => setScanMode('WRONG_CLASS')}
            className={clsx(
              'px-2 py-1 rounded border text-[10px] text-center transition-colors',
              scanMode === 'WRONG_CLASS' ? 'bg-amber-950/60 text-amber-300 border-amber-800 font-semibold' : 'bg-[#141414] text-neutral-400 border-[#262626]'
            )}
          >
            Wrong Class
          </button>
        </div>
      </div>
    </div>
  );
};
