import React from 'react';
import { Download, Printer, FileBarChart } from 'lucide-react';
import { attendanceService } from '../../services/attendanceService';
import { reportService } from '../../services/reportService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { VerificationBadge } from '../../components/verification/VerificationBadge';

export const TeacherReports: React.FC = () => {
  const records = attendanceService.getRecordsForSession('sess-live-101');

  const handleExportCSV = () => {
    const csv = reportService.generateCSV(records);
    reportService.downloadCSV(csv, `faculty_gradebook_attendance_${Date.now()}.csv`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Class Attendance Gradebook
          </h1>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            Export signed physical attendance sheets for institutional records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-1.5" />
            Print Gradebook
          </Button>
          <Button variant="primary" size="sm" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-1.5" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="bg-[#0B0B0B] border border-[#262626] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#262626] flex items-center justify-between bg-[#0E0E0E]">
          <div>
            <h3 className="text-sm font-semibold text-white">Verified Course Attendance Ledger</h3>
            <p className="text-xs text-neutral-400">Distributed Systems (CS-401) • Section A</p>
          </div>
          <span className="text-xs font-mono text-neutral-400">{records.length} logged presences</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-[#141414] text-neutral-400 border-b border-[#262626] uppercase text-[11px] font-mono">
              <tr>
                <th className="px-5 py-3 font-medium">Student Name</th>
                <th className="px-5 py-3 font-medium">Roll ID</th>
                <th className="px-5 py-3 font-medium">Time</th>
                <th className="px-5 py-3 font-medium">Distance</th>
                <th className="px-5 py-3 font-medium">Verification Factors</th>
                <th className="px-5 py-3 font-medium text-right">Receipt Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1C1C]">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-[#121212]">
                  <td className="px-5 py-3.5 font-semibold text-white">{r.studentName}</td>
                  <td className="px-5 py-3.5 font-mono text-neutral-400">{r.studentRoll}</td>
                  <td className="px-5 py-3.5 font-mono">{r.timestamp}</td>
                  <td className="px-5 py-3.5 font-mono">{r.distanceMeters}m</td>
                  <td className="px-5 py-3.5">
                    <VerificationBadge
                      locationStatus={r.locationVerified}
                      qrStatus={r.qrVerified}
                      biometricStatus={r.biometricVerified}
                      size="sm"
                    />
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-neutral-500 text-right truncate max-w-xs">
                    {r.receiptHash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
