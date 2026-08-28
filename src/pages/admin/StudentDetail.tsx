import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Fingerprint, CheckCircle2, AlertTriangle, 
  MapPin, QrCode, Calendar, Clock, Eye, ShieldCheck 
} from 'lucide-react';
import { studentService } from '../../services/studentService';
import { attendanceService } from '../../services/attendanceService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { VerificationBadge } from '../../components/verification/VerificationBadge';
import { AttendanceReceipt } from '../../components/verification/AttendanceReceipt';
import { Modal } from '../../components/ui/Modal';

export const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const student = studentService.getStudentById(id || 'stu-1');
  const records = attendanceService.getRecordsForStudent(student?.id || 'stu-1');
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

  if (!student) {
    return (
      <div className="p-12 text-center text-neutral-400">
        Student not found.{' '}
        <Link to="/admin/students" className="text-white underline">
          Back to Students
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <Link
            to="/admin/students"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Student Directory
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {student.name}
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#161616] border border-[#262626] text-neutral-300">
              {student.studentId}
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            {student.course} • {student.department}
          </p>
        </div>
      </div>

      {/* Student 360° Profile Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: ID Card */}
        <div className="p-6 bg-[#0B0B0B] border border-[#262626] rounded-2xl flex flex-col items-center text-center">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-[#262626] mb-4 shadow-xl"
          />
          <h3 className="text-lg font-bold text-white">{student.name}</h3>
          <div className="text-xs font-mono text-neutral-400 mt-0.5">{student.email}</div>
          <div className="text-xs text-neutral-500 mt-1">{student.phone}</div>

          {/* Biometric Status Pill */}
          <div className="mt-6 w-full p-3 rounded-xl bg-[#111111] border border-[#222222] text-left">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-400">Biometric Template:</span>
              <span className="text-emerald-400 font-bold">
                {student.biometricStatus === 'ENROLLED' ? '✓ ACTIVE' : 'PENDING'}
              </span>
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              Enrolled on: {student.biometricEnrolledAt || 'Not enrolled'}
            </div>
          </div>
        </div>

        {/* Right Column: Attendance Performance & Stats */}
        <div className="md:col-span-2 p-6 bg-[#0B0B0B] border border-[#262626] rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                  INSTITUTIONAL METRIC
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">Physical Attendance Trajectory</h3>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs text-neutral-400">Threshold</span>
                <div className="text-xs font-bold text-white">75% Required</div>
              </div>
            </div>

            {/* Attendance Progress bar */}
            <div className="mt-4">
              <div className="flex items-baseline justify-between mb-1.5 font-mono text-xs">
                <span className="text-neutral-400">Total Verified Rate:</span>
                <span className="text-2xl font-bold text-white">{student.attendanceRate}%</span>
              </div>
              <div className="w-full bg-[#161616] h-3 rounded-full overflow-hidden border border-[#262626]">
                <div
                  className={`h-full ${student.attendanceRate >= 75 ? 'bg-white' : 'bg-red-500'}`}
                  style={{ width: `${student.attendanceRate}%` }}
                />
              </div>
            </div>

            {/* Stat Counters */}
            <div className="mt-6 grid grid-cols-4 gap-3 text-center text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#111111] border border-[#222222]">
                <div className="text-[10px] text-neutral-500">TOTAL SESSIONS</div>
                <div className="text-lg font-bold text-white mt-1">{student.totalClasses}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#111111] border border-[#222222]">
                <div className="text-[10px] text-neutral-500">PRESENT</div>
                <div className="text-lg font-bold text-white mt-1">{student.presentCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#111111] border border-[#222222]">
                <div className="text-[10px] text-neutral-500">ABSENT</div>
                <div className="text-lg font-bold text-neutral-400 mt-1">{student.absentCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#111111] border border-[#222222]">
                <div className="text-[10px] text-neutral-500">LATE</div>
                <div className="text-lg font-bold text-neutral-400 mt-1">{student.lateCount}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1C1C1C] flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>Cumulative GPA: <strong className="text-white">{student.gpa}</strong></span>
            <span>Registered Class: <strong className="text-white">{student.className}</strong></span>
          </div>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="bg-[#0B0B0B] border border-[#262626] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#262626] flex items-center justify-between bg-[#0E0E0E]">
          <div>
            <h3 className="text-sm font-semibold text-white">Student Verification Trail</h3>
            <p className="text-xs text-neutral-400">Logged check-in receipts and timestamps</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-[#141414] text-neutral-400 border-b border-[#262626] uppercase text-[11px] font-mono">
              <tr>
                <th className="px-5 py-3 font-medium">Session / Class</th>
                <th className="px-5 py-3 font-medium">Timestamp</th>
                <th className="px-5 py-3 font-medium">Distance</th>
                <th className="px-5 py-3 font-medium">Factors Checked</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Pass</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1C1C]">
              {records.length > 0 ? (
                records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#121212] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-white">{rec.className}</div>
                      <div className="text-[11px] font-mono text-neutral-400">Ref: {rec.sessionId}</div>
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
                      <Badge variant="verified">PRESENT</Badge>
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
                    No verified attendance records found for this student.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
