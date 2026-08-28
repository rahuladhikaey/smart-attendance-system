import React, { useState } from 'react';
import { 
  Calendar, Clock, Download, Eye, MapPin, 
  QrCode, Fingerprint, CheckCircle2, Filter 
} from 'lucide-react';
import { attendanceService } from '../../services/attendanceService';
import { studentService } from '../../services/studentService';
import { reportService } from '../../services/reportService';
import { AttendanceRecord } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { VerificationBadge } from '../../components/verification/VerificationBadge';
import { AttendanceReceipt } from '../../components/verification/AttendanceReceipt';
import { Modal } from '../../components/ui/Modal';

export const StudentHistory: React.FC = () => {
  const student = studentService.getStudentById('stu-1') || studentService.getStudents()[0];
  const records = attendanceService.getRecordsForStudent(student.id);
  const [selectedReceipt, setSelectedReceipt] = useState<AttendanceRecord | null>(null);
  const [filterMonth, setFilterMonth] = useState('AUG');

  const handleExportCSV = () => {
    const csv = reportService.generateCSV(records);
    reportService.downloadCSV(csv, `my_attendance_history_${student.studentId}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            My Attendance Record
          </h1>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            {records.length} verified physical presences recorded for {student.studentId}
          </p>
        </div>

        <Button variant="secondary" size="sm" onClick={handleExportCSV}>
          <Download className="w-4 h-4 mr-1.5" />
          Export My Attendance
        </Button>
      </div>

      {/* Monthly Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-4 rounded-xl bg-[#0B0B0B] border border-[#262626]">
          <div className="text-[10px] text-neutral-500 uppercase">Enrolled Total</div>
          <div className="text-2xl font-bold text-white mt-1">{student.totalClasses}</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0B0B0B] border border-[#262626]">
          <div className="text-[10px] text-neutral-500 uppercase">Verified Present</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{student.presentCount}</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0B0B0B] border border-[#262626]">
          <div className="text-[10px] text-neutral-500 uppercase">Absent Count</div>
          <div className="text-2xl font-bold text-neutral-400 mt-1">{student.absentCount}</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0B0B0B] border border-[#262626]">
          <div className="text-[10px] text-neutral-500 uppercase">Semester Rate</div>
          <div className="text-2xl font-bold text-white mt-1">{student.attendanceRate}%</div>
        </div>
      </div>

      {/* History Ledger Table */}
      <div className="bg-[#0B0B0B] border border-[#262626] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#262626] flex items-center justify-between bg-[#0E0E0E]">
          <div>
            <h3 className="text-sm font-semibold text-white">Verified Attendance History</h3>
            <p className="text-xs text-neutral-400">Authenticated with Location + Live QR + Biometrics</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-[#141414] text-neutral-400 border-b border-[#262626] uppercase text-[11px] font-mono">
              <tr>
                <th className="px-5 py-3 font-medium">Class / Course</th>
                <th className="px-5 py-3 font-medium">Check-In Time</th>
                <th className="px-5 py-3 font-medium">Distance Offset</th>
                <th className="px-5 py-3 font-medium">Factors Validated</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Pass</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1C1C]">
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-[#121212]">
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-white">{rec.className}</div>
                    <div className="text-[11px] font-mono text-neutral-500">Ref #{rec.sessionId}</div>
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
                      Receipt
                    </Button>
                  </td>
                </tr>
              ))}
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
