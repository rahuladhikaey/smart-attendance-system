import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, UserCheck, UserX, Percent, Activity, ShieldCheck, 
  QrCode, ArrowUpRight, Plus, MapPin, Fingerprint, Search, 
  ChevronRight, AlertTriangle, FileText, CheckCircle2 
} from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { VerificationBadge } from '../../components/verification/VerificationBadge';
import { Modal } from '../../components/ui/Modal';
import { classService } from '../../services/classService';
import { attendanceService } from '../../services/attendanceService';
import { reportService } from '../../services/reportService';
import { AcademicClass, AttendanceSession } from '../../types';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, CartesianGrid 
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const classes = classService.getClasses();
  const [sessions, setSessions] = useState(attendanceService.getSessions());
  const [attempts, setAttempts] = useState(attendanceService.getVerificationAttempts());
  const [isNewSessionOpen, setIsNewSessionOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [radius, setRadius] = useState(100);

  useEffect(() => {
    const unsubscribe = attendanceService.subscribe(() => {
      setSessions(attendanceService.getSessions());
      setAttempts(attendanceService.getVerificationAttempts());
    });
    return unsubscribe;
  }, []);

  const summary = reportService.getSummaryMetrics();

  // Monochrome chart data
  const trendData = [
    { day: 'Mon', attendance: 89, verified: 87 },
    { day: 'Tue', attendance: 92, verified: 90 },
    { day: 'Wed', attendance: 88, verified: 86 },
    { day: 'Thu', attendance: 94, verified: 93 },
    { day: 'Fri', attendance: 91, verified: 89 },
    { day: 'Today', attendance: 91.4, verified: 96.4 },
  ];

  const classComparisonData = [
    { name: 'CS-401', rate: 92.4 },
    { name: 'AI-501', rate: 96.2 },
    { name: 'CS-302', rate: 88.5 },
    { name: 'EE-205', rate: 84.6 },
    { name: 'EE-310', rate: 81.2 },
    { name: 'CS-488', rate: 94.1 },
  ];

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    const classItem = classes.find(c => c.id === selectedClassId);
    if (classItem) {
      const newSess = attendanceService.createSession(
        classItem,
        classItem.teacherId,
        classItem.teacherName,
        radius
      );
      setIsNewSessionOpen(false);
      navigate(`/admin/attendance/session/${newSess.id}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Good morning, Admin
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white border border-white/20">
              OPERATIONAL
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • Imperial Academic Complex
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => navigate('/admin/verification')}>
            <ShieldCheck className="w-4 h-4 mr-1.5" />
            Verification Radar
          </Button>
          <Button variant="primary" size="sm" onClick={() => setIsNewSessionOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Take Attendance
          </Button>
        </div>
      </div>

      {/* 6 Core KPI Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <StatCard
          title="Total Students"
          value="1,248"
          subtitle="Enrolled across 10 classes"
          icon={<Users className="w-4 h-4" />}
        />
        <StatCard
          title="Present Today"
          value="1,108"
          trend={{ value: "88.8%", isPositive: true }}
          icon={<UserCheck className="w-4 h-4" />}
        />
        <StatCard
          title="Absent Today"
          value="86"
          subtitle="6.9% unverified"
          icon={<UserX className="w-4 h-4" />}
        />
        <StatCard
          title="Attendance Rate"
          value="88.8%"
          trend={{ value: "+3.4% this week", isPositive: true }}
          icon={<Percent className="w-4 h-4" />}
        />
        <StatCard
          title="Active Sessions"
          value={summary.activeSessions}
          badge="LIVE"
          subtitle="Geofences broadcasted"
          icon={<Activity className="w-4 h-4" />}
        />
        <StatCard
          title="Verification Rate"
          value="96.4%"
          subtitle="Zero proxies confirmed"
          icon={<ShieldCheck className="w-4 h-4" />}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trend Chart */}
        <div className="lg:col-span-2 p-6 bg-[#0B0B0B] border border-[#262626] rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                CAMPUS TELEMETRY
              </span>
              <h3 className="text-base font-semibold text-white">Weekly Attendance & Verification Trend</h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white" /> Attendance %
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-600" /> Biometric Match %
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="monochromeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                <XAxis dataKey="day" stroke="#666666" fontSize={11} tickLine={false} />
                <YAxis stroke="#666666" fontSize={11} domain={[70, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111111',
                    border: '1px solid #262626',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#FFF',
                  }}
                />
                <Area type="monotone" dataKey="attendance" stroke="#FFFFFF" strokeWidth={2} fillOpacity={1} fill="url(#monochromeGrad)" />
                <Area type="monotone" dataKey="verified" stroke="#666666" strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Class Performance Comparison */}
        <div className="p-6 bg-[#0B0B0B] border border-[#262626] rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              BENCHMARK
            </span>
            <h3 className="text-base font-semibold text-white mt-0.5">Class Comparison</h3>
            <p className="text-xs text-neutral-400 mt-1">Average physical verification rate</p>

            <div className="h-56 mt-4 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classComparisonData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" horizontal={false} />
                  <XAxis type="number" domain={[70, 100]} stroke="#666666" fontSize={10} tickLine={false} />
                  <YAxis type="category" dataKey="name" stroke="#AAAAAA" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111111',
                      border: '1px solid #262626',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#FFF',
                    }}
                  />
                  <Bar dataKey="rate" fill="#FFFFFF" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1F1F1F] flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>Minimum Target: 75%</span>
            <Link to="/admin/classes" className="text-white hover:underline flex items-center gap-1">
              View All Classes <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Class Overview Table */}
      <div className="bg-[#0B0B0B] border border-[#262626] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#262626] flex items-center justify-between bg-[#0E0E0E]">
          <div>
            <h3 className="text-sm font-semibold text-white">Active Academic Classes</h3>
            <p className="text-xs text-neutral-400">Roster attendance & verification health</p>
          </div>
          <Link to="/admin/classes">
            <Button variant="secondary" size="sm" className="text-xs">
              Manage Classes
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-[#141414] text-neutral-400 border-b border-[#262626] uppercase text-[11px] font-mono">
              <tr>
                <th className="px-5 py-3 font-medium">Class</th>
                <th className="px-5 py-3 font-medium">Teacher</th>
                <th className="px-5 py-3 font-medium">Students</th>
                <th className="px-5 py-3 font-medium">Present</th>
                <th className="px-5 py-3 font-medium">Attendance</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1C1C]">
              {classes.slice(0, 5).map((cls) => {
                const isExcellent = cls.attendanceRate >= 90;
                const isGood = cls.attendanceRate >= 80 && cls.attendanceRate < 90;
                return (
                  <tr key={cls.id} className="hover:bg-[#121212] transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">{cls.name}</div>
                      <div className="text-[11px] font-mono text-neutral-400">{cls.code} • {cls.room}</div>
                    </td>
                    <td className="px-5 py-4 text-neutral-300">{cls.teacherName}</td>
                    <td className="px-5 py-4 font-mono">{cls.totalStudents}</td>
                    <td className="px-5 py-4 font-mono text-white">
                      {Math.round(cls.totalStudents * (cls.attendanceRate / 100))}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{cls.attendanceRate}%</span>
                        <div className="w-16 bg-[#1F1F1F] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-white h-full" style={{ width: `${cls.attendanceRate}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {isExcellent && <Badge variant="verified">Excellent</Badge>}
                      {isGood && <Badge variant="default">Good</Badge>}
                      {!isExcellent && !isGood && <Badge variant="warning">Needs Attention</Badge>}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link to={`/admin/classes/${cls.id}`}>
                        <Button variant="ghost" size="sm" className="text-xs">
                          Inspect
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Real-Time Verification Events Stream */}
      <div className="bg-[#0B0B0B] border border-[#262626] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="text-sm font-semibold text-white">Live Physical Presence Stream</h3>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">Real-time incoming multi-factor student check-ins</p>
          </div>
          <Link to="/admin/verification">
            <Button variant="secondary" size="sm" className="text-xs">
              View Security Center
            </Button>
          </Link>
        </div>

        <div className="space-y-2">
          {attempts.slice(0, 5).map((att) => (
            <div
              key={att.id}
              className="p-3 rounded-xl bg-[#111111] border border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#181818] border border-[#262626] flex items-center justify-center font-bold text-white font-mono text-[10px]">
                  {att.finalResult === 'VERIFIED' ? '✓' : '✕'}
                </div>
                <div>
                  <div className="font-semibold text-white">{att.studentName}</div>
                  <div className="text-[11px] font-mono text-neutral-400">
                    {att.className} • {att.timestamp}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <VerificationBadge
                  locationStatus={att.locationResult}
                  qrStatus={att.qrResult}
                  biometricStatus={att.biometricResult}
                  size="sm"
                />

                {att.finalResult === 'VERIFIED' ? (
                  <Badge variant="live" dot>
                    VERIFIED
                  </Badge>
                ) : (
                  <Badge variant="rejected" dot>
                    REJECTED
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Take Attendance Modal */}
      <Modal
        isOpen={isNewSessionOpen}
        onClose={() => setIsNewSessionOpen(false)}
        title="Start Attendance Session"
        subtitle="Configure location geofence and launch dynamic live QR"
      >
        <form onSubmit={handleCreateSession} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Select Class
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} ({cls.code}) — {cls.room}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 rounded-xl bg-[#111111] border border-[#222222] space-y-2">
            <div className="text-[11px] font-mono uppercase text-neutral-400">Geofence Configuration</div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-300">Allowed Perimeter Radius:</span>
              <span className="font-mono text-white font-bold">{radius} meters</span>
            </div>
            <input
              type="range"
              min={30}
              max={250}
              step={10}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full accent-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#262626]">
            <Button variant="outline" type="button" size="sm" onClick={() => setIsNewSessionOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" size="sm">
              Generate Live QR Session
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
