import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, MapPin, QrCode, Fingerprint, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BiometricHUD } from '../../components/verification/BiometricHUD';
import { verificationEngine } from '../../services/verificationEngine';
import { studentService } from '../../services/studentService';
import { attendanceService } from '../../services/attendanceService';
import { Button } from '../../components/ui/Button';

export const StudentBiometricVerification: React.FC = () => {
  const navigate = useNavigate();
  const sessionId = sessionStorage.getItem('current_verification_session_id') || 'sess-live-101';
  const session = attendanceService.getSessionById(sessionId) || attendanceService.getSessions()[0];
  const student = studentService.getStudentById('stu-1') || studentService.getStudents()[0];

  const [bioStatus, setBioStatus] = useState<
    'CAMERA_READY' | 'FACE_DETECTED' | 'LIVENESS_CHECK' | 'VERIFYING' | 'VERIFIED' | 'FAILED'
  >('CAMERA_READY');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleVerificationComplete = async (passed: boolean, error?: string) => {
    if (!passed) {
      setBioStatus('FAILED');
      setErrorMessage(error);
      return;
    }

    setBioStatus('VERIFYING');

    // Execute full verification pipeline committing to the attendance database
    const pipelineResult = await verificationEngine.executePipeline({
      student,
      session,
      simulateOutsideLocation: false,
      simulateExpiredQr: false,
      simulateBiometricFail: false,
    });

    if (pipelineResult.success && pipelineResult.record) {
      setBioStatus('VERIFIED');
      sessionStorage.setItem('latest_attendance_receipt', JSON.stringify(pipelineResult.record));

      // Trigger Confetti Celebration for authentic physical presence verification!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ffffff', '#888888', '#34d399', '#ffffff'],
        });
      } catch {
        // Fallback gracefully
      }

      setTimeout(() => {
        navigate('/student/attendance/success');
      }, 1200);
    } else {
      setBioStatus('FAILED');
      setErrorMessage(pipelineResult.errorMessage);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-4 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
        <Link
          to="/student/attendance/scan"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Link>
        <div className="text-xs font-mono text-neutral-400">
          Step <strong className="text-white">3</strong> of 3: Biometric Identity & Liveness
        </div>
      </div>

      {/* Progress Chip */}
      <div className="flex items-center justify-center gap-3 text-xs font-mono select-none">
        <div className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-full">
          <Check className="w-3.5 h-3.5" />
          <span>Location</span>
        </div>
        <span className="text-neutral-600">→</span>
        <div className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-full">
          <Check className="w-3.5 h-3.5" />
          <span>Live QR</span>
        </div>
        <span className="text-neutral-600">→</span>
        <div className="flex items-center gap-1 text-white bg-white/10 border border-white/20 px-2.5 py-1 rounded-full font-bold">
          <Fingerprint className="w-3.5 h-3.5 animate-pulse" />
          <span>Biometric Pass</span>
        </div>
      </div>

      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Verify Your Identity
        </h1>
        <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
          Position your face inside the HUD oval. Anti-spoofing algorithms verify physical live human presence.
        </p>
      </div>

      {/* Biometric HUD Component */}
      <BiometricHUD
        studentName={student.name}
        studentAvatar={student.avatar}
        status={bioStatus}
        errorMessage={errorMessage}
        onVerificationComplete={handleVerificationComplete}
        onRetry={() => {
          setBioStatus('CAMERA_READY');
          setErrorMessage(undefined);
        }}
      />

      {/* Controls */}
      <div className="flex justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setBioStatus('CAMERA_READY');
            setErrorMessage(undefined);
          }}
        >
          Reset Camera
        </Button>

        {bioStatus === 'VERIFIED' && (
          <Button
            variant="primary"
            size="sm"
            className="font-bold text-xs"
            onClick={() => navigate('/student/attendance/success')}
          >
            <span>View Verified Pass</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        )}

        {bioStatus === 'FAILED' && (
          <Button
            variant="danger"
            size="sm"
            className="text-xs"
            onClick={() => navigate('/student/attendance/failure?reason=biometric')}
          >
            View Failure Details
          </Button>
        )}
      </div>
    </div>
  );
};
