import React, { useState, useEffect } from 'react';
import { ShieldCheck, Fingerprint, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '../ui/Button';

export interface BiometricHUDProps {
  studentName: string;
  studentAvatar?: string;
  status: 'CAMERA_READY' | 'FACE_DETECTED' | 'LIVENESS_CHECK' | 'VERIFYING' | 'VERIFIED' | 'FAILED';
  errorMessage?: string;
  onVerificationComplete: (passed: boolean, error?: string) => void;
  onRetry?: () => void;
}

export const BiometricHUD: React.FC<BiometricHUDProps> = ({
  studentName,
  studentAvatar,
  status,
  errorMessage,
  onVerificationComplete,
  onRetry,
}) => {
  const [livenessPrompt, setLivenessPrompt] = useState('Position your face inside the frame');
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [testScenario, setTestScenario] = useState<'SUCCESS' | 'LIVENESS_FAIL' | 'MATCH_FAIL'>('SUCCESS');

  useEffect(() => {
    let timer1: ReturnType<typeof setTimeout>;
    let timer2: ReturnType<typeof setTimeout>;
    let timer3: ReturnType<typeof setTimeout>;

    if (status === 'CAMERA_READY' || status === 'FACE_DETECTED' || status === 'LIVENESS_CHECK') {
      setLivenessPrompt('Face detected. Performing anti-spoof liveness check...');
      
      timer1 = setTimeout(() => {
        setLivenessPrompt('Please blink once to verify physical presence...');
        setConfidenceScore(65);
      }, 1000);

      timer2 = setTimeout(() => {
        setLivenessPrompt('Verifying biometric facial vector against registered enrollment...');
        setConfidenceScore(88);
      }, 2000);

      timer3 = setTimeout(() => {
        if (testScenario === 'LIVENESS_FAIL') {
          onVerificationComplete(false, 'Anti-spoofing alert: Failed live motion check (photo/screen replay blocked).');
        } else if (testScenario === 'MATCH_FAIL') {
          onVerificationComplete(false, 'Biometric confidence (54%) below institutional match threshold (85%).');
        } else {
          setConfidenceScore(98);
          onVerificationComplete(true);
        }
      }, 3000);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [status, testScenario, onVerificationComplete]);

  return (
    <div className="bg-[#0B0B0B] border border-[#262626] rounded-2xl p-6 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-2xl">
      {/* Top HUD Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-[#262626]">
        <div className="flex items-center gap-2 text-left">
          <Fingerprint className="w-4 h-4 text-white" />
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
              IDENTITY ENGINE
            </span>
            <div className="text-xs font-semibold text-white">Neural Biometric Match</div>
          </div>
        </div>
        <span className="text-[10px] font-mono text-neutral-400 border border-[#262626] px-2 py-0.5 rounded bg-[#141414]">
          ISO 30107-3 LIVENESS
        </span>
      </div>

      {/* Face Frame Viewfinder */}
      <div className="relative w-64 h-72 my-4 bg-[#050505] rounded-2xl overflow-hidden border border-[#262626] flex items-center justify-center">
        {/* Subtle avatar simulation inside frame */}
        <img
          src={studentAvatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80'}
          alt={studentName}
          className="absolute inset-0 w-full h-full object-cover opacity-60 filter grayscale contrast-125"
        />

        {/* HUD Face Oval Guide */}
        <div className="relative z-10 w-40 h-52 rounded-[45%] border-2 border-white/70 shadow-[0_0_15px_rgba(255,255,255,0.2)] flex items-center justify-center animate-hud-pulse">
          {/* Facial feature landmark points */}
          <div className="absolute top-16 left-8 w-2 h-2 rounded-full bg-white shadow-sm" />
          <div className="absolute top-16 right-8 w-2 h-2 rounded-full bg-white shadow-sm" />
          <div className="absolute top-26 w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
          <div className="absolute bottom-12 w-8 h-1 rounded-full bg-white/70" />

          {/* Grid target crosshairs */}
          <div className="absolute inset-x-2 top-1/2 h-[1px] bg-white/20" />
          <div className="absolute inset-y-2 left-1/2 w-[1px] bg-white/20" />
        </div>

        {/* Viewfinder Corner Accents */}
        <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-white" />
        <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-white" />
        <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-white" />
        <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-white" />

        {/* Status pill overlay */}
        <div className="absolute bottom-3 inset-x-3 bg-black/80 backdrop-blur-sm py-1.5 px-2.5 rounded-lg border border-[#333333] text-[11px] font-mono text-white flex items-center justify-between">
          <span className="truncate">{studentName}</span>
          <span className="text-neutral-400 font-bold">{confidenceScore > 0 ? `${confidenceScore}%` : 'SCANNING'}</span>
        </div>
      </div>

      {/* State Feedback Text */}
      <div className="w-full space-y-3">
        {status !== 'VERIFIED' && status !== 'FAILED' && (
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-neutral-300">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
            <span>{livenessPrompt}</span>
          </div>
        )}

        {status === 'VERIFIED' && (
          <div className="bg-[#121812] border border-emerald-900/60 rounded-xl p-3.5 text-left">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Identity & Liveness Verified</span>
            </div>
            <p className="text-xs text-neutral-300 mt-1">
              Facial vector match confirmed (98.4% confidence score).
            </p>
          </div>
        )}

        {status === 'FAILED' && (
          <div className="bg-[#181111] border border-red-900/60 rounded-xl p-3.5 text-left">
            <div className="flex items-center gap-2 text-red-400 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4" />
              <span>Biometric Verification Failed</span>
            </div>
            <p className="text-xs text-neutral-300 mt-1">
              {errorMessage || 'Identity could not be verified against the registered student template.'}
            </p>
            {onRetry && (
              <Button variant="secondary" size="sm" className="mt-3 w-full text-xs" onClick={onRetry}>
                Try Biometric Scan Again
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Demo Biometric Simulation Scenarios */}
      <div className="w-full mt-5 pt-4 border-t border-[#1C1C1C] flex flex-col gap-2 text-[11px] text-neutral-400 text-left">
        <span className="font-mono text-neutral-500">Demo Biometric Scenarios:</span>
        <div className="grid grid-cols-3 gap-1.5 font-mono">
          <button
            type="button"
            onClick={() => setTestScenario('SUCCESS')}
            className={clsx(
              'px-2 py-1 rounded border text-[10px] text-center transition-colors',
              testScenario === 'SUCCESS' ? 'bg-white text-black font-semibold border-white' : 'bg-[#141414] text-neutral-400 border-[#262626]'
            )}
          >
            Verified (98%)
          </button>
          <button
            type="button"
            onClick={() => setTestScenario('LIVENESS_FAIL')}
            className={clsx(
              'px-2 py-1 rounded border text-[10px] text-center transition-colors',
              testScenario === 'LIVENESS_FAIL' ? 'bg-red-950/60 text-red-300 border-red-800 font-semibold' : 'bg-[#141414] text-neutral-400 border-[#262626]'
            )}
          >
            Spoof Replay Blocked
          </button>
          <button
            type="button"
            onClick={() => setTestScenario('MATCH_FAIL')}
            className={clsx(
              'px-2 py-1 rounded border text-[10px] text-center transition-colors',
              testScenario === 'MATCH_FAIL' ? 'bg-amber-950/60 text-amber-300 border-amber-800 font-semibold' : 'bg-[#141414] text-neutral-400 border-[#262626]'
            )}
          >
            Face Mismatch
          </button>
        </div>
      </div>
    </div>
  );
};
