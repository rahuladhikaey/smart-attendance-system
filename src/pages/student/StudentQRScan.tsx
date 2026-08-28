import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, MapPin, QrCode, Fingerprint, ShieldCheck } from 'lucide-react';
import { QRScanner } from '../../components/verification/QRScanner';
import { qrService } from '../../services/qrService';
import { attendanceService } from '../../services/attendanceService';
import { Button } from '../../components/ui/Button';

export const StudentQRScan: React.FC = () => {
  const navigate = useNavigate();
  const sessionId = sessionStorage.getItem('current_verification_session_id') || 'sess-live-101';
  const session = attendanceService.getSessionById(sessionId) || attendanceService.getSessions()[0];

  const [scanStatus, setScanStatus] = useState<'IDLE' | 'SCANNING' | 'VALIDATING' | 'SUCCESS' | 'ERROR'>('SCANNING');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleScanSuccess = async (rawQrString: string) => {
    setScanStatus('VALIDATING');
    const result = await qrService.validateScannedToken(rawQrString, session.id);

    if (result.valid) {
      setScanStatus('SUCCESS');
      sessionStorage.setItem('verification_qr_passed', 'true');
      sessionStorage.setItem('verification_qr_token', rawQrString);

      // Auto-advance to Biometric check after 1.2s
      setTimeout(() => {
        navigate('/student/attendance/biometric');
      }, 1200);
    } else {
      setScanStatus('ERROR');
      setErrorMessage(result.errorMessage);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-4 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
        <Link
          to="/student/attendance/location"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Link>
        <div className="text-xs font-mono text-neutral-400">
          Step <strong className="text-white">2</strong> of 3: Live QR Scan
        </div>
      </div>

      {/* Progress Chip */}
      <div className="flex items-center justify-center gap-3 text-xs font-mono select-none">
        <div className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-full">
          <Check className="w-3.5 h-3.5" />
          <span>Location</span>
        </div>
        <span className="text-neutral-600">→</span>
        <div className="flex items-center gap-1 text-white bg-white/10 border border-white/20 px-2.5 py-1 rounded-full font-bold">
          <QrCode className="w-3.5 h-3.5 animate-pulse" />
          <span>QR Scan</span>
        </div>
        <span className="text-neutral-600">→</span>
        <div className="flex items-center gap-1 text-neutral-500 bg-[#111111] border border-[#262626] px-2.5 py-1 rounded-full">
          <Fingerprint className="w-3.5 h-3.5" />
          <span>Biometric</span>
        </div>
      </div>

      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Scan Live Class QR
        </h1>
        <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
          Point your camera at the dynamic rotating QR code projected on the classroom screen.
        </p>
      </div>

      {/* Camera Viewfinder Component */}
      <QRScanner
        status={scanStatus}
        errorMessage={errorMessage}
        onScanSuccess={handleScanSuccess}
        onRetry={() => {
          setScanStatus('SCANNING');
          setErrorMessage(undefined);
        }}
      />

      {/* Controls */}
      <div className="flex justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setScanStatus('SCANNING');
            setErrorMessage(undefined);
          }}
        >
          Reset Camera
        </Button>

        {scanStatus === 'SUCCESS' && (
          <Button
            variant="primary"
            size="sm"
            className="font-bold text-xs"
            onClick={() => navigate('/student/attendance/biometric')}
          >
            <span>Continue to Biometric Check</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        )}

        {scanStatus === 'ERROR' && (
          <Button
            variant="danger"
            size="sm"
            className="text-xs"
            onClick={() => navigate('/student/attendance/failure?reason=qr')}
          >
            View Rejection Reason
          </Button>
        )}
      </div>
    </div>
  );
};
