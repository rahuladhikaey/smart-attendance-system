import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, AlertTriangle, QrCode, Calendar, Clock, 
  ArrowRight, ShieldCheck, MapPin, Sparkles, BookOpen, Percent 
} from 'lucide-react';
import { studentService } from '../../services/studentService';
import { attendanceService } from '../../services/attendanceService';
import { authService } from '../../services/authService';
import { classService } from '../../services/classService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/ui/StatCard';
import { VerificationBadge } from '../../components/verification/VerificationBadge';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const student = studentService.getStudentById('stu-1') || studentService.getStudents()[0];
  const records = attendanceService.getRecordsForStudent(student.id);
  const classes = classService.getClasses();
  const liveSession = attendanceService.getSessions().find(s => s.status === 'LIVE');

  const isAboveThreshold = student.attendanceRate >= 75;

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Hello, {currentUser.name.split(' ')[0]}
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#161616] border border-[#262626] text-neutral-300">
              {student.studentId}
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            {student.course} • {student.semester}
          </p>
        </div>

        {/* Hero Primary CTA: Mark Attendance */}
        <Link to="/student/attendance">
          <Button variant="primary" size="md" className="font-bold text-xs px-5 shadow-lg shadow-white/10">
            <QrCode className="w-4 h-4 mr-2 text-black" />
            <span>Mark Attendance</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </Link>
      </div>

      {/* Live Active Attendance Session Alert Spotlight (if session is live) */}
      {liveSession && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#121812] to-[#0A0A0A] border border-emerald-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-700 flex items-center justify-center text-emerald-400 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase font-bold text-emerald-400 tracking-wider">
                ACTIVE LECTURE SESSION READY FOR VERIFICATION
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">{liveSession.className}</h3>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                {liveSession.location.name} • Host: {liveSession.teacherName}
              </p>
            </div>
          </div>

          <Link to="/student/attendance">
            <Button variant="primary" size="sm" className="text-xs font-semibold whitespace-nowrap">
              Verify Physical Presence Now
            </Button>
          </Link>
        </div>
      )}

      {/* Attendance Quota Health Card */}
      <div className="p-6 rounded-2xl bg-[#0B0B0B] border border-[#262626] grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left: Overall Attendance Percentage Gauge */}
        <div className="text-center md:text-left">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
            OVERALL ATTENDANCE
          </span>
          <div className="flex items-baseline gap-2 mt-1 justify-center md:justify-start">
            <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white">
              {student.attendanceRate}%
            </span>
          </div>
          <div className="mt-3">
            <div className="w-full bg-[#161616] h-2.5 rounded-full overflow-hidden border border-[#262626]">
              <div
                className={`h-full ${isAboveThreshold ? 'bg-white' : 'bg-red-500'}`}
                style={{ width: `${student.attendanceRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: Institutional Warning Banner */}
        <div className="p-4 rounded-xl bg-[#111111] border border-[#222222]">
          {isAboveThreshold ? (
            <div className="flex items-start gap-2.5 text-xs text-neutral-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-sans">Attendance Compliant</strong>
                <p className="text-neutral-400 mt-0.5 text-[11px]">
                  Your attendance is above the required 75% institutional quota for semester examinations.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2.5 text-xs text-red-300">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-red-200 block font-sans">Attendance Warning</strong>
                <p className="text-neutral-400 mt-0.5 text-[11px]">
                  Your attendance is below 75%. Attend upcoming lectures to maintain exam eligibility.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Quick Breakdown */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
          <div className="p-3 rounded-xl bg-[#111111] border border-[#222222]">
            <div className="text-[10px] text-neutral-500">PRESENT</div>
            <div className="text-base font-bold text-white mt-1">{student.presentCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#111111] border border-[#222222]">
            <div className="text-[10px] text-neutral-500">ABSENT</div>
            <div className="text-base font-bold text-neutral-400 mt-1">{student.absentCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#111111] border border-[#222222]">
            <div className="text-[10px] text-neutral-500">LATE</div>
            <div className="text-base font-bold text-neutral-400 mt-1">{student.lateCount}</div>
          </div>
        </div>
      </div>

      {/* Today's Classes */}
      <div className="bg-[#0B0B0B] border border-[#262626] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-white">Today's Class Timetable</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Physical lecture venues and attendance requirements</p>
          </div>
          <Link to="/student/schedule" className="text-xs font-mono text-neutral-400 hover:text-white">
            Full Schedule →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classes.slice(0, 2).map((cls) => (
            <div
              key={cls.id}
              className="p-4 rounded-xl bg-[#111111] border border-[#222222] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono uppercase text-neutral-400">{cls.code}</span>
                  {cls.activeSessionId ? (
                    <Badge variant="live" dot>LIVE IN SESSION</Badge>
                  ) : (
                    <Badge variant="neutral">UPCOMING</Badge>
                  )}
                </div>

                <h4 className="text-sm font-bold text-white mt-2">{cls.name}</h4>
                <div className="text-xs font-mono text-neutral-400 mt-2 space-y-1">
                  <div>Venue: {cls.room} ({cls.location.allowedRadius}m radius)</div>
                  <div>Instructor: {cls.teacherName}</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1C1C1C] flex items-center justify-between">
                <span className="text-[11px] font-mono text-neutral-400">10:00 AM - 11:30 AM</span>
                <Link to="/student/attendance">
                  <Button variant="secondary" size="sm" className="text-xs">
                    Verify Presence
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Attendance Receipts */}
      <div className="bg-[#0B0B0B] border border-[#262626] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#262626] flex items-center justify-between bg-[#0E0E0E]">
          <div>
            <h3 className="text-sm font-semibold text-white">Recent Attendance Passes</h3>
            <p className="text-xs text-neutral-400">Verified multi-factor check-in receipts</p>
          </div>
          <Link to="/student/history" className="text-xs font-mono text-neutral-400 hover:text-white">
            View Complete History →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-[#141414] text-neutral-400 border-b border-[#262626] uppercase text-[11px] font-mono">
              <tr>
                <th className="px-5 py-3 font-medium">Class / Session</th>
                <th className="px-5 py-3 font-medium">Timestamp</th>
                <th className="px-5 py-3 font-medium">Distance</th>
                <th className="px-5 py-3 font-medium">Verification Factors</th>
                <th className="px-5 py-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1C1C]">
              {records.slice(0, 4).map((rec) => (
                <tr key={rec.id} className="hover:bg-[#121212]">
                  <td className="px-5 py-3.5 font-semibold text-white">{rec.className}</td>
                  <td className="px-5 py-3.5 font-mono">{rec.timestamp}</td>
                  <td className="px-5 py-3.5 font-mono text-neutral-400">{rec.distanceMeters}m</td>
                  <td className="px-5 py-3.5">
                    <VerificationBadge
                      locationStatus={rec.locationVerified}
                      qrStatus={rec.qrVerified}
                      biometricStatus={rec.biometricVerified}
                      size="sm"
                    />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Badge variant="verified">PRESENT</Badge>
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
