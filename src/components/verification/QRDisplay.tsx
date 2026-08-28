import React, { useState, useEffect } from 'react';
import { RefreshCw, Shield, Clock, Pause, Play, Square } from 'lucide-react';
import { AttendanceSession } from '../../types';
import { qrService } from '../../services/qrService';
import { Button } from '../ui/Button';

export interface QRDisplayProps {
  session: AttendanceSession;
  onPause?: () => void;
  onResume?: () => void;
  onEndSession?: () => void;
}

export const QRDisplay: React.FC<QRDisplayProps> = ({
  session,
  onPause,
  onResume,
  onEndSession,
}) => {
  const [qrData, setQrData] = useState(() => qrService.generateDynamicToken(session));
  const [secondsLeft, setSecondsLeft] = useState(qrData.remainingSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      const current = qrService.generateDynamicToken(session);
      setQrData(current);
      setSecondsLeft(current.remainingSeconds);
    }, 1000);

    return () => clearInterval(timer);
  }, [session]);

  const handleManualRegenerate = () => {
    const current = qrService.generateDynamicToken(session);
    setQrData(current);
    setSecondsLeft(current.remainingSeconds);
  };

  const progressPercent = ((30 - secondsLeft) / 30) * 100;

  return (
    <div className="bg-[#0B0B0B] border border-[#262626] rounded-2xl p-6 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-2xl">
      {/* Session Top Info */}
      <div className="w-full flex items-center justify-between pb-4 border-b border-[#262626]">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
              LIVE ROTATING QR
            </span>
          </div>
          <h3 className="text-sm font-semibold text-white mt-0.5">{session.className}</h3>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono text-neutral-400">SESSION ID</span>
          <div className="text-xs font-mono text-white font-bold">{session.id}</div>
        </div>
      </div>

      {/* QR Code Container */}
      <div className="my-6 relative p-5 bg-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-[#161616]">
        {/* High-res SVG representation of dynamic 2D Matrix code */}
        <svg
          viewBox="0 0 200 200"
          className="w-56 h-56 text-black select-none"
          fill="currentColor"
        >
          {/* Top Left Finder */}
          <rect x="10" y="10" width="50" height="50" rx="4" />
          <rect x="18" y="18" width="34" height="34" fill="white" rx="2" />
          <rect x="26" y="26" width="18" height="18" rx="1" />

          {/* Top Right Finder */}
          <rect x="140" y="10" width="50" height="50" rx="4" />
          <rect x="148" y="18" width="34" height="34" fill="white" rx="2" />
          <rect x="156" y="26" width="18" height="18" rx="1" />

          {/* Bottom Left Finder */}
          <rect x="10" y="140" width="50" height="50" rx="4" />
          <rect x="18" y="148" width="34" height="34" fill="white" rx="2" />
          <rect x="26" y="156" width="18" height="18" rx="1" />

          {/* Dynamic Matrix Data Cells varying with Nonce */}
          {Array.from({ length: 14 }).map((_, r) =>
            Array.from({ length: 14 }).map((_, c) => {
              const x = 70 + (c % 7) * 9;
              const y = 20 + (r % 14) * 11;
              const isFilled = ((r * 11 + c * 17 + qrData.payload.nonce) % 3 === 0);
              if (!isFilled) return null;
              return <rect key={`${r}-${c}`} x={x} y={y} width="7" height="7" rx="1" />;
            })
          )}

          {/* Central Logo Stamp */}
          <rect x="80" y="80" width="40" height="40" rx="6" fill="#000000" />
          <path
            d="M95 100 L99 105 L106 95"
            stroke="#FFFFFF"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Scan Target Corner Accents */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-black" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-black" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-black" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-black" />
      </div>

      {/* Countdown Timer & Nonce Bar */}
      <div className="w-full space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-neutral-300">
          <span className="flex items-center gap-1 text-neutral-400">
            <Clock className="w-3.5 h-3.5" />
            Token Rotates in:
          </span>
          <span className="font-bold text-white text-sm bg-[#161616] px-2 py-0.5 rounded border border-[#262626]">
            00:{secondsLeft.toString().padStart(2, '0')}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#161616] h-1.5 rounded-full overflow-hidden border border-[#262626]">
          <div
            className="bg-white h-full transition-all duration-1000 ease-linear"
            style={{ width: `${100 - progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-1">
          <span>NONCE: #{qrData.payload.nonce}</span>
          <span className="flex items-center gap-1 text-neutral-400">
            <Shield className="w-3 h-3 text-white" />
            SHA-256 Anti-Proxy Nonce
          </span>
        </div>
      </div>

      {/* Teacher Session Controls */}
      <div className="w-full mt-6 pt-4 border-t border-[#262626] flex items-center justify-between gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleManualRegenerate}
          className="text-xs flex-1"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Refresh QR
        </Button>

        {session.status === 'LIVE' ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onPause}
            className="text-xs text-amber-300 border-amber-800/40 hover:bg-amber-950/30"
          >
            <Pause className="w-3.5 h-3.5 mr-1" />
            Pause
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={onResume}
            className="text-xs text-emerald-300 border-emerald-800/40 hover:bg-emerald-950/30"
          >
            <Play className="w-3.5 h-3.5 mr-1" />
            Resume
          </Button>
        )}

        {onEndSession && (
          <Button
            variant="danger"
            size="sm"
            onClick={onEndSession}
            className="text-xs"
          >
            <Square className="w-3.5 h-3.5 mr-1" />
            End
          </Button>
        )}
      </div>
    </div>
  );
};
