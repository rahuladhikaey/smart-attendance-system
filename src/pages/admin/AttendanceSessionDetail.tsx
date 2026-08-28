import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, QrCode, MapPin, Clock, Users, ShieldCheck, 
  CheckCircle2, AlertTriangle, Printer, Plus, ShieldAlert, Eye 
} from 'lucide-react';
import { attendanceService } from '../../services/attendanceService';
import { studentService } from '../../services/studentService';
import { AttendanceSession, AttendanceRecord } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { VerificationBadge } from '../../components/verification/VerificationBadge';
import { QRDisplay } from '../../components/verification/QRDisplay';
import { AttendanceReceipt } from '../../components/verification/AttendanceReceipt';
import { Modal } from '../../components/ui/Modal';

export const AttendanceSessionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<AttendanceSession | undefined>(
    attendanceService.getSessionById(id || 'sess-live-101')
  );
  const [records, setRecords] = useState<AttendanceRecord[]>(
    attendanceService.getRecordsForSession(id || 'sess-live-101')
  );
  const students = studentService.getStudents();

  const [selectedReceipt, setSelectedReceipt] = useState<AttendanceRecord | null>(null);
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [overrideStudentId, setOverrideStudentId] = useState(students[3]?.id || '');
  const [overrideReason, setOverrideReason] = useState('Biometric hardware sensor timeout; identity verified manually in presence of faculty.');

  useEffect(() => {
    const unsub = attendanceService.subscribe(() => {
      if (id) {
        setSession(attendanceService.getSessionById(id));
        setRecords(attendanceService.getRecordsForSession(id));
      }
    });
    return unsub;
  }, [id]);

  if (!session) {
    return (
      <div className="p-12 text-center text-neutral-400">
        Session not found.{' '}
        <Link to="/admin/attendance" className="text-white underline">
          Back to Sessions
        </Link>
      </div>
    );
  }

  const handleManualOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (session && overrideStudentId && overrideReason.trim()) {
      attendanceService.manualOverride(session.id, overrideStudentId, overrideReason);
      setIsOverrideOpen(false);
    }
  };

  const progressPercent = Math.round((session.verifiedCount / (session.totalStudents || 1)) * 100);

  return (
    <div className="space-y-8">
      {/* Back button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <Link
            to="/admin/attendance"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sessions
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {session.className}
            </h1>
            {session.status === 'LIVE' && <Badge variant="live" dot>LIVE</Badge>}
            {session.status === 'COMPLETED' && <Badge variant="default">COMPLETED</Badge>}
          </div>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            Taught by {session.teacherName} • Session Ref #{session.id}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setIsOverrideOpen(true)}>
            <ShieldAlert className="w-4 h-4 mr-1.5 text-amber-400" />
            Manual Override
          </Button>
        </div>
      </div>

      {/* Top Details & Live QR Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Dynamic Live QR Broadcast */}
        <div className="lg:col-span-1">
          <QRDisplay
            session={session}
            onPause={() => attendanceService.updateSessionStatus(session.id, 'PAUSED')}
            onResume={() => attendanceService.updateSessionStatus(session.id, 'LIVE')}
            onEndSession={() => attendanceService.updateSessionStatus(session.id, 'COMPLETED')}
          />
        </div>

        {/* Right: Telemetry & Verification Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Card */}
          <div className="p-6 bg-[#0B0B0B] border border-[#262626] rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-400">
                  REAL-TIME VERIFICATION PROGRESS
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {session.verifiedCount} of {session.totalStudents} Verified ({progressPercent}%)
                </h3>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs text-neutral-400">Classroom Geofence</span>
                <div className="text-xs font-bold text-white">{session.location.allowedRadius}m Allowed Radius</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-[#161616] h-3 rounded-full overflow-hidden border border-[#262626]">
              <div
                className="bg-white h-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Stat Counters */}
            <div className="mt-6 grid grid-cols-4 gap-3 text-center text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#111111] border border-[#222222]">
                <div className="text-[10px] text-neutral-500">TOTAL ROSTER</div>
                <div className="text-lg font-bold text-white mt-1">{session.totalStudents}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#111111] border border-[#222222]">
                <div className="text-[10px] text-neutral-500">VERIFIED PASS</div>
                <div className="text-lg font-bold text-emerald-400 mt-1">{session.verifiedCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#111111] border border-[#222222]">
                <div className="text-[10px] text-neutral-500">PENDING SCAN</div>
                <div className="text-lg font-bold text-amber-400 mt-1">{session.pendingCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#111111] border border-[#222222]">
                <div className="text-[10px] text-neutral-500">REJECTED PROXIES</div>
                <div className="text-lg font-bold text-red-400 mt-1">{session.rejectedCount}</div>
              </div>
            </div>
          </div>

          {/* Session Location & Time Details */}
          <div className="p-5 rounded-2xl bg-[#0B0B0B] border border-[#262626] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
              <div>
                <div className="text-neutral-500 uppercase text-[10px]">Perimeter Boundary</div>
                <div className="text-white font-semibold mt-0.5">{session.location.name}</div>
                <div className="text-neutral-400 text-[11px]">Lat: {session.location.lat}, Lng: {session.location.lng}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-white shrink-0 mt-0.5" />
              <div>
                <div className="text-neutral-500 uppercase text-[10px]">Session Window</div>
                <div className="text-white font-semibold mt-0.5">{session.date} • {session.startTime} - {session.endTime}</div>
                <div className="text-neutral-400 text-[11px]">Late Threshold: {session.lateThresholdMinutes} mins</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Student Records Table */}
      <div className="bg-[#0B0B0B] border border-[#262626] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#262626] flex items-center justify-between bg-[#0E0E0E]">
          <div>
            <h3 className="text-sm font-semibold text-white">Verified Attendance Ledger</h3>
            <p className="text-xs text-neutral-400">Cryptographically signed physical presence records</p>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            {records.length} records recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-[#141414] text-neutral-400 border-b border-[#262626] uppercase text-[11px] font-mono">
              <tr>
                <th className="px-5 py-3 font-medium">Student</th>
                <th className="px-5 py-3 font-medium">Time</th>
                <th className="px-5 py-3 font-medium">Distance</th>
                <th className="px-5 py-3 font-medium">Verification Factors</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Digital Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1C1C]">
              {records.length > 0 ? (
                records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#121212] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rec.studentAvatar}
                          alt={rec.studentName}
                          className="w-7 h-7 rounded-lg object-cover border border-[#262626]"
                        />
                        <div>
                          <div className="font-semibold text-white">{rec.studentName}</div>
                          <div className="text-[11px] font-mono text-neutral-400">{rec.studentRoll}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono">{rec.timestamp}</td>
                    <td className="px-5 py-3.5 font-mono text-neutral-300">{rec.distanceMeters}m</td>
                    <td className="px-5 py-3.5">
                      <VerificationBadge
                        locationStatus={rec.locationVerified}
                        qrStatus={rec.qrVerified}
                        biometricStatus={rec.biometricVerified}
                        size="sm"
                      />
                    </td>
                    <td className="px-5 py-3.5">
                      {rec.status === 'PRESENT' && <Badge variant="verified">PRESENT</Badge>}
                      {rec.status === 'MANUAL_OVERRIDE' && (
                        <Badge variant="warning" title={rec.overrideReason}>OVERRIDE</Badge>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs font-mono"
                        onClick={() => setSelectedReceipt(rec)}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Pass
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-neutral-500 font-mono">
                    No verified check-ins recorded yet for this session.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Override Modal */}
      <Modal
        isOpen={isOverrideOpen}
        onClose={() => setIsOverrideOpen(false)}
        title="Admin Manual Attendance Override"
        subtitle="Require institutional reason. All manual overrides are logged to audit ledger."
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
                  {stu.name} ({stu.studentId}) — {stu.className}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Audit Justification / Reason
            </label>
            <textarea
              rows={3}
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              required
              className="w-full bg-[#141414] border border-[#262626] rounded-lg p-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
            />
          </div>

          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40 text-amber-300 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Manual overrides bypass GPS and Biometric checks and create a persistent warning entry on your institutional compliance report.
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#262626]">
            <Button variant="outline" type="button" size="sm" onClick={() => setIsOverrideOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" size="sm">
              Confirm Manual Override
            </Button>
          </div>
        </form>
      </Modal>

      {/* Digital Attendance Receipt Modal */}
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
