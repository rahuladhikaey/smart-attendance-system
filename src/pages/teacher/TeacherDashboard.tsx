import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, QrCode, Users, Plus, Play, Calendar, 
  Clock, CheckCircle2, ArrowUpRight, Activity 
} from 'lucide-react';
import { classService } from '../../services/classService';
import { attendanceService } from '../../services/attendanceService';
import { authService } from '../../services/authService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/ui/StatCard';
import { Modal } from '../../components/ui/Modal';

export const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const classes = classService.getClasses(); // Assigned classes for faculty
  const [sessions, setSessions] = useState(attendanceService.getSessions());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [radius, setRadius] = useState(100);

  useEffect(() => {
    const unsub = attendanceService.subscribe(() => {
      setSessions(attendanceService.getSessions());
    });
    return unsub;
  }, []);

  const liveSession = sessions.find(s => s.status === 'LIVE');

  const handleStartSession = (e: React.FormEvent) => {
    e.preventDefault();
    const cls = classes.find(c => c.id === selectedClassId);
    if (cls) {
      const sess = attendanceService.createSession(cls, currentUser.id, currentUser.name, radius);
      setIsModalOpen(false);
      navigate(`/teacher/attendance/session/${sess.id}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome back, {currentUser.name}
            </h1>
            <Badge variant="live" dot>FACULTY PORTAL</Badge>
          </div>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • Computer Science Dept
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Start Attendance Session
        </Button>
      </div>

      {/* Active Live Session Spotlight Banner (if active) */}
      {liveSession && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#121812] to-[#0B0B0B] border border-emerald-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-800 flex items-center justify-center text-emerald-400 shrink-0">
              <QrCode className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 tracking-wider">
                  LIVE SESSION BROADCASTING
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">{liveSession.className}</h3>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                {liveSession.verifiedCount} of {liveSession.totalStudents} students verified • Nonce #{liveSession.qrNonce}
              </p>
            </div>
          </div>

          <Link to={`/teacher/attendance/session/${liveSession.id}`}>
            <Button variant="primary" size="md" className="font-semibold text-xs whitespace-nowrap">
              <span>Open Live QR Projector</span>
              <ArrowUpRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Classes"
          value={classes.length}
          subtitle="Semester 7 & 8 courses"
          icon={<BookOpen className="w-4 h-4" />}
        />
        <StatCard
          title="Total Students"
          value="110"
          subtitle="Across your sections"
          icon={<Users className="w-4 h-4" />}
        />
        <StatCard
          title="Average Attendance"
          value="91.7%"
          trend={{ value: "+2.1%", isPositive: true }}
          icon={<CheckCircle2 className="w-4 h-4" />}
        />
        <StatCard
          title="Sessions Hosted"
          value="84"
          subtitle="This academic year"
          icon={<Activity className="w-4 h-4" />}
        />
      </div>

      {/* Today's Classes & Quick Start */}
      <div className="bg-[#0B0B0B] border border-[#262626] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-white">Today's Teaching Schedule</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Launch geofenced sessions directly for your assigned rooms</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classes.slice(0, 4).map((cls) => (
            <div
              key={cls.id}
              className="p-5 rounded-xl bg-[#111111] border border-[#222222] hover:border-neutral-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono uppercase text-neutral-400">
                    {cls.code} • {cls.room}
                  </span>
                  <Badge variant="default">{cls.attendanceRate}% Avg</Badge>
                </div>

                <h4 className="text-base font-bold text-white mt-2">{cls.name}</h4>
                <div className="text-xs font-mono text-neutral-400 mt-2 space-y-1">
                  <div>Perimeter: {cls.location.name} ({cls.location.allowedRadius}m)</div>
                  <div>Roster: {cls.totalStudents} enrolled students</div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#1C1C1C] flex items-center justify-between">
                <Link to={`/teacher/classes/${cls.id}`} className="text-xs text-neutral-400 hover:text-white">
                  View Roster
                </Link>
                <Button
                  variant="primary"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    const sess = attendanceService.createSession(cls, currentUser.id, currentUser.name, cls.location.allowedRadius);
                    navigate(`/teacher/attendance/session/${sess.id}`);
                  }}
                >
                  <QrCode className="w-3.5 h-3.5 mr-1" />
                  Launch Live Session
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Session Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Start Class Attendance Session"
        subtitle="Broadcast dynamic QR and enforce geofence perimeter"
      >
        <form onSubmit={handleStartSession} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Select Course Section
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
            <div className="text-[11px] font-mono uppercase text-neutral-400">Classroom Geofence</div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-300">Allowed Perimeter Radius:</span>
              <span className="font-mono text-white font-bold">{radius} meters</span>
            </div>
            <input
              type="range"
              min={30}
              max={200}
              step={10}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full accent-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#262626]">
            <Button variant="outline" type="button" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" size="sm">
              Generate Live QR
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
