import React from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, MapPin, QrCode, Fingerprint, 
  RotateCcw, ArrowLeft, ShieldAlert, XCircle 
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const StudentAttendanceFailure: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reason = searchParams.get('reason') || 'unknown';

  const getFailureDetails = () => {
    switch (reason) {
      case 'location':
        return {
          title: 'Outside Geofence Perimeter',
          icon: MapPin,
          explanation: 'Your device location was detected outside the allowed classroom radius (e.g. 100m from Hall Alpha). You must be physically inside the lecture hall.',
          resolution: 'Ensure you are inside the classroom, enable High Accuracy GPS on your device, and try again.',
          retryPath: '/student/attendance/location',
        };
      case 'qr':
        return {
          title: 'Invalid or Expired Live QR Code',
          icon: QrCode,
          explanation: 'The scanned dynamic token has expired or belongs to a different academic course section. Live QR tokens rotate every 30 seconds to prevent shared screenshot fraud.',
          resolution: 'Look at the classroom projection screen and scan the freshly rotated QR code.',
          retryPath: '/student/attendance/scan',
        };
      case 'biometric':
        return {
          title: 'Biometric Verification Failed',
          icon: Fingerprint,
          explanation: 'Facial identity or anti-spoof liveness check could not confirm a match with your registered institutional biometric template.',
          resolution: 'Ensure good lighting, avoid wearing sunglasses or masks, and align your face inside the viewfinder.',
          retryPath: '/student/attendance/biometric',
        };
      case 'duplicate':
        return {
          title: 'Duplicate Check-In Detected',
          icon: ShieldAlert,
          explanation: 'Attendance has already been recorded for this student account during the current lecture session.',
          resolution: 'You do not need to scan again. Your presence is safely recorded in the institutional database.',
          retryPath: '/student/history',
        };
      default:
        return {
          title: 'Verification Could Not Be Completed',
          icon: XCircle,
          explanation: 'One or more required security criteria could not be validated for this attendance session.',
          resolution: 'Please check your connection and retry the verification sequence.',
          retryPath: '/student/attendance',
        };
    }
  };

  const details = getFailureDetails();
  const Icon = details.icon;

  return (
    <div className="max-w-xl mx-auto py-8 space-y-6">
      <div className="bg-[#0B0B0B] border border-red-900/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
        {/* Error Icon */}
        <div className="w-16 h-16 rounded-3xl bg-red-950/60 border border-red-800 text-red-400 flex items-center justify-center mx-auto shadow-xl">
          <Icon className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 bg-red-950/40 border border-red-900/50 px-2.5 py-0.5 rounded-full">
            ATTENDANCE NOT RECORDED
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-3">
            {details.title}
          </h1>
          <p className="text-xs text-neutral-400 mt-2 leading-relaxed max-w-md mx-auto">
            {details.explanation}
          </p>
        </div>

        {/* Suggested Resolution Box */}
        <div className="p-4 rounded-xl bg-[#111111] border border-[#222222] text-left text-xs font-mono">
          <div className="text-white font-semibold flex items-center gap-1.5 mb-1">
            <span className="text-emerald-400">💡</span> Recommended Next Step:
          </div>
          <p className="text-neutral-400">{details.resolution}</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link to="/student/dashboard" className="flex-1">
            <Button variant="secondary" size="md" className="w-full text-xs">
              Back to Dashboard
            </Button>
          </Link>
          <Button
            variant="primary"
            size="md"
            className="flex-1 text-xs font-bold"
            onClick={() => navigate(details.retryPath)}
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Try Verification Again
          </Button>
        </div>
      </div>
    </div>
  );
};
