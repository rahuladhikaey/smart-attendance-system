import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  QrCode, MapPin, Fingerprint, ShieldCheck, CheckCircle2, 
  ArrowRight, ArrowLeft, Clock, AlertTriangle 
} from 'lucide-react';
import { attendanceService } from '../../services/attendanceService';
import { classService } from '../../services/classService';
import { authService } from '../../services/authService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const StudentAttendanceStart: React.FC = () => {
  const navigate = useNavigate();
  const classes = classService.getClasses();
  const sessions = attendanceService.getSessions();
  const liveSession = sessions.find(s => s.status === 'LIVE') || sessions[0];
  const [selectedSessionId, setSelectedSessionId] = useState(liveSession?.id || 'sess-live-101');

  const currentSession = sessions.find(s => s.id === selectedSessionId) || liveSession;

  const handleStart = () => {
    // Store active session being verified in sessionStorage
    sessionStorage.setItem('current_verification_session_id', currentSession.id);
    navigate('/student/attendance/location');
  };

  return (
    <div className="max-w-xl mx-auto py-4 space-y-6">
      {/* Back button */}
      <Link
        to="/student/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
      </Link>

      {/* Main Launcher Card */}
      <div className="bg-[#0B0B0B] border border-[#262626] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Top Header */}
        <div className="text-center pb-6 border-b border-[#262626]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-mono mb-3 border border-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>PHYSICAL PRESENCE PIPELINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Mark Class Attendance
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            "Attendance is verified, not claimed."
          </p>
        </div>

        {/* Selected Course Section */}
        <div className="my-6 space-y-3">
          <label className="block text-xs font-mono uppercase text-neutral-400">
            Select Active Lecture Session
          </label>
          <select
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
            className="w-full bg-[#141414] border border-[#262626] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-white font-medium"
          >
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.className} ({s.status}) — {s.teacherName}
              </option>
            ))}
          </select>

          {/* Session Details Card */}
          {currentSession && (
            <div className="p-4 rounded-xl bg-[#111111] border border-[#222222] text-xs font-mono space-y-2">
              <div className="flex items-center justify-between text-neutral-300">
                <span className="text-neutral-500">Instructor:</span>
                <span className="text-white font-semibold">{currentSession.teacherName}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-300">
                <span className="text-neutral-500">Venue / Location:</span>
                <span className="text-white">{currentSession.location.name}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-300">
                <span className="text-neutral-500">Allowed Geofence:</span>
                <span className="text-emerald-400 font-bold">{currentSession.allowedRadius} meters radius</span>
              </div>
            </div>
          )}
        </div>

        {/* Requirements Checklist */}
        <div className="p-4 rounded-2xl bg-[#0E0E0E] border border-[#262626] space-y-3 text-xs">
          <div className="text-[11px] font-mono uppercase text-neutral-400 font-bold">
            Before You Continue (Verification Pipeline):
          </div>

          <div className="space-y-2 text-neutral-300 font-mono text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md bg-white/10 text-white flex items-center justify-center text-[10px] font-bold">
                1
              </div>
              <span><strong>Current Location Check</strong> — Must be inside classroom geofence</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md bg-white/10 text-white flex items-center justify-center text-[10px] font-bold">
                2
              </div>
              <span><strong>Live QR Code Scan</strong> — Must scan rotating screen token</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md bg-white/10 text-white flex items-center justify-center text-[10px] font-bold">
                3
              </div>
              <span><strong>Biometric Liveness Check</strong> — Facial identity match</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md bg-white/10 text-white flex items-center justify-center text-[10px] font-bold">
                4
              </div>
              <span><strong>Duplicate Verification</strong> — Strictly one check-in per session</span>
            </div>
          </div>
        </div>

        {/* Primary CTA Button */}
        <div className="mt-8">
          <Button
            variant="primary"
            size="lg"
            className="w-full text-sm font-bold shadow-xl shadow-white/10"
            onClick={handleStart}
          >
            <span>Start Presence Verification</span>
            <ArrowRight className="w-4 h-4 ml-2 text-black" />
          </Button>
        </div>
      </div>
    </div>
  );
};
