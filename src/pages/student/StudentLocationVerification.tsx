import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, ArrowRight, ArrowLeft, RefreshCw, CheckCircle2, 
  AlertTriangle, ShieldCheck 
} from 'lucide-react';
import { locationService } from '../../services/locationService';
import { attendanceService } from '../../services/attendanceService';
import { LocationRadar } from '../../components/verification/LocationRadar';
import { Button } from '../../components/ui/Button';

export const StudentLocationVerification: React.FC = () => {
  const navigate = useNavigate();
  const sessionId = sessionStorage.getItem('current_verification_session_id') || 'sess-live-101';
  const session = attendanceService.getSessionById(sessionId) || attendanceService.getSessions()[0];

  const [status, setStatus] = useState<'IDLE' | 'LOCATING' | 'VERIFIED' | 'OUTSIDE_RADIUS' | 'ERROR'>('LOCATING');
  const [distanceMeters, setDistanceMeters] = useState(35);
  const [simulateOutside, setSimulateOutside] = useState(false);

  const performCheck = async (simulateOut: boolean = simulateOutside) => {
    setStatus('LOCATING');
    const result = await locationService.verifyCurrentLocation(session.location, simulateOut);
    setDistanceMeters(result.distanceMeters);

    if (result.passed) {
      setStatus('VERIFIED');
      sessionStorage.setItem('verification_location_passed', 'true');
      sessionStorage.setItem('verification_distance', String(result.distanceMeters));
    } else {
      setStatus('OUTSIDE_RADIUS');
      sessionStorage.removeItem('verification_location_passed');
    }
  };

  useEffect(() => {
    performCheck(simulateOutside);
  }, []);

  const handleSimulateToggle = (newVal: boolean) => {
    setSimulateOutside(newVal);
    performCheck(newVal);
  };

  const handleContinue = () => {
    navigate('/student/attendance/scan');
  };

  return (
    <div className="max-w-xl mx-auto py-4 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
        <Link
          to="/student/attendance"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Link>
        <div className="text-xs font-mono text-neutral-400">
          Step <strong className="text-white">1</strong> of 3: Location Verification
        </div>
      </div>

      {/* Hero Title */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Verify Your Location
        </h1>
        <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
          We use your device's physical coordinates to verify that you are inside the classroom perimeter.
        </p>
      </div>

      {/* Interactive Radar Component */}
      <LocationRadar
        location={session.location}
        status={status}
        distanceMeters={distanceMeters}
        onRetry={() => performCheck(simulateOutside)}
        onSimulateToggle={handleSimulateToggle}
        isSimulatedOutside={simulateOutside}
      />

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" size="md" onClick={() => performCheck(simulateOutside)}>
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Refresh GPS
        </Button>

        {status === 'VERIFIED' ? (
          <Button
            variant="primary"
            size="md"
            className="font-bold text-xs px-6"
            onClick={handleContinue}
          >
            <span>Continue to QR Scan</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : status === 'OUTSIDE_RADIUS' ? (
          <Button
            variant="danger"
            size="md"
            className="text-xs"
            onClick={() => navigate('/student/attendance/failure?reason=location')}
          >
            View Rejection Reason
          </Button>
        ) : null}
      </div>
    </div>
  );
};
