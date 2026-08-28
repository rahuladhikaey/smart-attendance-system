import React, { useState } from 'react';
import { 
  FileText, Download, Printer, Filter, Calendar, 
  BarChart2, ShieldAlert, CheckCircle2, Search 
} from 'lucide-react';
import { attendanceService } from '../../services/attendanceService';
import { reportService } from '../../services/reportService';
import { classService } from '../../services/classService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { VerificationBadge } from '../../components/verification/VerificationBadge';

export const ReportsPage: React.FC = () => {
  const classes = classService.getClasses();
  const [reportType, setReportType] = useState<string>('DAILY');
  const [selectedClassId, setSelectedClassId] = useState<string>('ALL');
  const records = attendanceService.getRecordsForSession('sess-live-101');
  const attempts = attendanceService.getVerificationAttempts();

  const handleExportCSV = () => {
    const csv = reportService.generateCSV(records);
    reportService.downloadCSV(csv, `attendance_report_${reportType.toLowerCase()}_${Date.now()}.csv`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Institutional Reports
          </h1>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            Export cryptographically signed compliance reports, daily sheets & fraud audits
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-1.5" />
            Print Report
          </Button>
          <Button variant="primary" size="sm" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-1.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filter & Type Bar */}
      <div className="p-4 rounded-xl bg-[#0B0B0B] border border-[#262626] flex flex-wrap items-center justify-between gap-4">
        {/* Report Type Selector */}
        <div className="flex items-center gap-1.5 bg-[#141414] p-1 rounded-lg border border-[#262626] text-xs font-mono">
          {[
            { id: 'DAILY', label: 'Daily Attendance' },
            { id: 'CLASS', label: 'Class Summary' },
            { id: 'VERIFICATION', label: 'Verification Audit' },
            { id: 'FRAUD', label: 'Rejected Proxies' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setReportType(item.id)}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                reportType === item.id
                  ? 'bg-white text-black font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Class Filter */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-neutral-500 uppercase text-[11px]">Class Filter:</span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="bg-[#141414] border border-[#262626] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-white"
          >
            <option value="ALL">All Enrolled Classes</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.code} — {cls.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Report Preview Container */}
      <div className="p-6 rounded-2xl bg-[#0B0B0B] border border-[#262626] space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
          <div>
            <div className="text-[10px] font-mono uppercase text-neutral-400">
              IMPERIAL INSTITUTE OF TECHNOLOGY & SCIENCE // REPORT VIEWER
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              {reportType === 'DAILY' && 'Daily Physical Attendance Log'}
              {reportType === 'CLASS' && 'Academic Class Section Breakdown'}
              {reportType === 'VERIFICATION' && 'Multi-Factor Presence Verification Ledger'}
              {reportType === 'FRAUD' && 'Blocked Proxies & Geofence Breaches'}
            </h3>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            Generated: {new Date().toLocaleString()}
          </span>
        </div>

        {/* Report Content Table */}
        {reportType !== 'FRAUD' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-[#141414] text-neutral-400 border-b border-[#262626] uppercase text-[11px] font-mono">
                <tr>
                  <th className="px-4 py-3 font-medium">Record ID</th>
                  <th className="px-4 py-3 font-medium">Student</th>
                  <th className="px-4 py-3 font-medium">Class</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Verification Method</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Receipt Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1C1C]">
                {records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#121212]">
                    <td className="px-4 py-3 font-mono text-[11px] text-neutral-500">{rec.id}</td>
                    <td className="px-4 py-3 font-semibold text-white">{rec.studentName}</td>
                    <td className="px-4 py-3 text-neutral-300">{rec.className}</td>
                    <td className="px-4 py-3 font-mono">{rec.timestamp}</td>
                    <td className="px-4 py-3">
                      <VerificationBadge
                        locationStatus={rec.locationVerified}
                        qrStatus={rec.qrVerified}
                        biometricStatus={rec.biometricVerified}
                        size="sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="verified">{rec.status}</Badge>
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px] text-neutral-400 text-right truncate max-w-xs">
                      {rec.receiptHash}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-[#141414] text-neutral-400 border-b border-[#262626] uppercase text-[11px] font-mono">
                <tr>
                  <th className="px-4 py-3 font-medium">Attempt ID</th>
                  <th className="px-4 py-3 font-medium">Student</th>
                  <th className="px-4 py-3 font-medium">Class</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Failure Reason</th>
                  <th className="px-4 py-3 font-medium text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1C1C]">
                {attempts.filter(a => a.finalResult === 'REJECTED').map((att) => (
                  <tr key={att.id} className="hover:bg-[#121212]">
                    <td className="px-4 py-3 font-mono text-[11px] text-neutral-500">{att.id}</td>
                    <td className="px-4 py-3 font-semibold text-white">{att.studentName}</td>
                    <td className="px-4 py-3 text-neutral-300">{att.className}</td>
                    <td className="px-4 py-3 font-mono">{att.timestamp}</td>
                    <td className="px-4 py-3 text-red-300 font-mono">{att.failureReason}</td>
                    <td className="px-4 py-3 text-right">
                      <Badge variant="rejected">REJECTED</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
