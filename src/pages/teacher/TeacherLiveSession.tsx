import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Users, QrCode, MapPin, Clock, ShieldCheck, 
  CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, RefreshCw, Eye 
} from 'lucide-react';
import { attendanceService } from '../../services/attendanceService';
import { studentService } from '../../services/studentService';
import { AttendanceSession, AttendanceRecord } from '../../types';
import { QRDisplay } from '../../components/verification/QRDisplay';
import { VerificationBadge } from '../../components/verification/VerificationBadge';
import { AttendanceReceipt } from '../../components/verification/AttendanceReceipt';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const TeacherLiveSession: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<AttendanceSession | undefined>(
    attendanceService.getSessionById(id || 'sess-live-101')
  );
  const [records, setRecords] = useState<AttendanceRecord[]>(
    attendanceService.getRecordsForSession(id || 'sess-live-101')
  );
  const students = studentService.getStudents();
  const [selectedReceipt, setSelectedReceipt] = useState<AttendanceRecord | null>(null);

  // Manual Override state
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [overrideStudentId, setOverrideStudentId] = useState(students[4]?.id || '');
  const [overrideReason, setOverrideReason] = useState('Device camera malfunction; presence validated in lecture hall.');

  useEffect(() => {
    const unsub = attendanceService.subscribe(() => {
      if (id) {
        setSession(attendanceService.getSessionById(id));
        setRecords(attendanceService.getRecordsForSession(id));
      }
    });
    return unsub;
  }, [id]);

  // Simulate an incoming student check-in event every 12 seconds if session is LIVE
  useEffect(() => {
    if (session?.status !== 'LIVE') return;

    const interval = setInterval(() => {
      const pendingStudents = students.filter(
        s => !attendanceService.hasStudentCheckedIn(session.id, s.id)
      );

      if (pendingStudents.length > 0) {
        const nextStudent = pendingStudents[0];
        const newRec: AttendanceRecord = {
          id: `rec-sim-${Date.now()}`,
          sessionId: session.id,
          classId: session.classId,
          className: session.className,
          studentId: nextStudent.id,
          studentName: nextStudent.name,
          studentRoll: nextStudent.studentId,
          studentAvatar: nextStudent.avatar,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          status: 'PRESENT',
          locationVerified: true,
          qrVerified: true,
          biometricVerified: true,
          distanceMeters: Math.floor(Math.random() * 40 + 15),
          verificationMethod: 'Geofence GPS + Live QR + Facial Biometrics',
          receiptHash: `0x${Array.from({ length: 20 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase()}`,
        };
        attendanceService.addAttendanceRecord(newRec);
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [session, students]);

  if (!session) {
    return (
      <div className="p-12 text-center text-neutral-400">
        Session not found.{' '}
        <Link to="/teacher/dashboard" className="text-white underline">
          Back to Faculty Dashboard
        </Link>
      </div>
    );
  }

  const handleManualOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (session && overrideStudentId && overrideReason.trim()) {
      attendanceService.manualOverride(session.id, overrideStudentId, overrideReason, session.teacherName);
      setIsOverrideOpen(false);
    }
  };

  const progressPercent = Math.round((session.verifiedCount / (session.totalStudents || 1)) * 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <Link
            to="/teacher/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {session.className}
            </h1>
            {session.status === 'LIVE' && <Badge variant="live" dot>BROADCASTING</Badge>}
            {session.status === 'PAUSED' && <Badge variant="warning">PAUSED</Badge>}
            {session.status === 'COMPLETED' && <Badge variant="default">ENDED</Badge>}
          </div>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            {session.location.name} ({session.allowedRadius}m Perimeter) • Session ID: {session.id}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setIsOverrideOpen(true)}>
            <ShieldAlert className="w-4 h-4 mr-1.5 text-amber-400" />
            Manual Override
          </Button>
          {session.status === 'LIVE' && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                attendanceService.updateSessionStatus(session.id, 'COMPLETED');
              }}
            >
              End Session
            </Button>
          )}
        </div>
      </div>

      {/* Main Live Session Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Hero Dynamic QR Component (5 cols) */}
        <div className="lg:col-span-5">
          <QRDisplay
            session={session}
            onPause={() => attendanceService.updateSessionStatus(session.id, 'PAUSED')}
            onResume={() => attendanceService.updateSessionStatus(session.id, 'LIVE')}
            onEndSession={() => attendanceService.updateSessionStatus(session.id, 'COMPLETED')}
          />
        </div>

        {/* Right: Live Telemetry & Verified Student Stream (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Progress Overview Card */}
          <div className="p-6 bg-[#0B0B0B] border border-[#262626] rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-400">
                  REAL-TIME PARTICIPATION
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {session.verifiedCount} of {session.totalStudents} Verified ({progressPercent}%)
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-neutral-400">STATUS</span>
                <div className="text-xs font-mono font-bold text-emerald-400">● LIVE RECEPTOR</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#161616] h-3 rounded-full overflow-hidden border border-[#262626]">
              <div
                className="bg-white h-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Stat Counters */}
            <div className="mt-5 grid grid-cols-4 gap-2.5 text-center text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#111111] border border-[#222222]">
                <div className="text-[10px] text-neutral-500">TOTAL</div>
                <div className="text-base font-bold text-white mt-0.5">{session.totalStudents}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#111111] border border-[#222222]">
                <div className="text-[10px] text-neutral-500">VERIFIED</div>
                <div className="text-base font-bold text-emerald-400 mt-0.5">{session.verifiedCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#111111] border border-[#222222]">
                <div className="text-[10px] text-neutral-500">PENDING</div>
                <div className="text-base font-bold text-amber-400 mt-0.5">{session.pendingCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#111111] border border-[#222222]">
                <div className="text-[10px] text-neutral-500">REJECTED</div>
                <div className="text-base font-bold text-red-400 mt-0.5">{session.rejectedCount}</div>
              </div>
            </div>
          </div>

          {/* Incoming Real-Time Check-In Stream */}
          <div className="bg-[#0B0B0B] border border-[#262626] rounded-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="text-sm font-semibold text-white">Live Student Check-In Stream</h3>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                {records.length} checked in
              </span>
            </div>

            <div className="mt-4 space-y-2 max-h-80 overflow-y-auto pr-1">
              {records.length > 0 ? (
                records.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3 rounded-xl bg-[#111111] border border-[#222222] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={rec.studentAvatar}
                        alt={rec.studentName}
                        className="w-8 h-8 rounded-lg object-cover border border-[#262626]"
                      />
                      <div>
                        <div className="font-semibold text-white">{rec.studentName}</div>
                        <div className="text-[11px] font-mono text-neutral-400">
                          {rec.timestamp} • {rec.distanceMeters}m offset
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <VerificationBadge
                        locationStatus={rec.locationVerified}
                        qrStatus={rec.qrVerified}
                        biometricStatus={rec.biometricVerified}
                        size="sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs font-mono"
                        onClick={() => setSelectedReceipt(rec)}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Pass
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-neutral-500 font-mono text-xs">
                  Awaiting student scans from lecture room...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Manual Override Modal */}
      <Modal
        isOpen={isOverrideOpen}
        onClose={() => setIsOverrideOpen(false)}
        title="Faculty Manual Attendance Override"
        subtitle="Requires mandatory justification for audit compliance."
      >
        <form onSubmit={handleManualOverride} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Select Student
            </label>
            <select
              value={overrideStudentId}
              onChange={(e) => setOverrideStudentId(e.target.value)}
              className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
            >
              {students.map((stu) => (
                <option key={stu.id} value={stu.id}>
                  {stu.name} ({stu.studentId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Override Reason
            </label>
            <textarea
              rows={3}
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              required
              className="w-full bg-[#141414] border border-[#262626] rounded-lg p-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#262626]">
            <Button variant="outline" type="button" size="sm" onClick={() => setIsOverrideOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" size="sm">
              Confirm Override
            </Button>
          </div>
        </form>
      </Modal>

      {/* Digital Receipt Modal */}
      {selectedReceipt && (
        <Modal
          isOpen={Boolean(selectedReceipt)}
          onClose={() => setSelectedReceipt(null)}
          title="Digital Verification Pass"
          maxWidth="md"
        >
          <AttendanceReceipt record={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
        </Modal>
      )}
    </div>
  );
};
