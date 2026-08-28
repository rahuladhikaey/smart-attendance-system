import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  QrCode, Plus, Search, Filter, Calendar, MapPin, 
  Users, CheckCircle2, Clock, Play, ArrowUpRight 
} from 'lucide-react';
import { attendanceService } from '../../services/attendanceService';
import { classService } from '../../services/classService';
import { AttendanceSession } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const AttendanceManagement: React.FC = () => {
  const navigate = useNavigate();
  const classes = classService.getClasses();
  const [sessions, setSessions] = useState<AttendanceSession[]>(attendanceService.getSessions());
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [radius, setRadius] = useState(100);

  useEffect(() => {
    const unsub = attendanceService.subscribe(() => {
      setSessions(attendanceService.getSessions());
    });
    return unsub;
  }, []);

  const filteredSessions = sessions.filter(s => {
    const matchesStatus = filterStatus === 'ALL' || s.status === filterStatus;
    const matchesSearch = s.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const classItem = classes.find(c => c.id === selectedClassId);
    if (classItem) {
      const sess = attendanceService.createSession(classItem, classItem.teacherId, classItem.teacherName, radius);
      setIsModalOpen(false);
      navigate(`/admin/attendance/session/${sess.id}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Attendance Sessions
          </h1>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            Manage live broadcast sessions, geofences, and verification logs
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Start Attendance Session
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-[#0B0B0B] border border-[#262626]">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search class or session ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#141414] border border-[#262626] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#141414] p-1 rounded-lg border border-[#262626] text-xs font-mono w-full sm:w-auto overflow-x-auto">
          {['ALL', 'LIVE', 'COMPLETED', 'SCHEDULED', 'EXPIRED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterStatus === st
                  ? 'bg-white text-black font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Session Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <div
              key={session.id}
              className="p-5 rounded-2xl bg-[#0B0B0B] border border-[#262626] hover:border-neutral-700 transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">
                    ID: {session.id}
                  </span>
                  {session.status === 'LIVE' && <Badge variant="live" dot>LIVE SESSION</Badge>}
                  {session.status === 'COMPLETED' && <Badge variant="default">COMPLETED</Badge>}
                  {session.status === 'SCHEDULED' && <Badge variant="pending">SCHEDULED</Badge>}
                  {session.status === 'EXPIRED' && <Badge variant="neutral">EXPIRED</Badge>}
                </div>

                <h3 className="text-base font-bold text-white mt-3 group-hover:text-neutral-200">
                  {session.className}
                </h3>
                <div className="text-xs text-neutral-400 mt-0.5">{session.teacherName}</div>

                {/* Location & Time Info */}
                <div className="mt-4 space-y-1.5 text-xs text-neutral-400 font-mono">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span className="truncate">{session.location.name} ({session.allowedRadius}m)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span>{session.date} • {session.startTime} - {session.endTime}</span>
                  </div>
                </div>

                {/* Stats Breakdown */}
                <div className="mt-5 p-3 rounded-xl bg-[#111111] border border-[#222222] grid grid-cols-4 gap-2 text-center text-xs font-mono">
                  <div>
                    <div className="text-[10px] text-neutral-500">TOTAL</div>
                    <div className="font-bold text-white mt-0.5">{session.totalStudents}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-500">VERIFIED</div>
                    <div className="font-bold text-emerald-400 mt-0.5">{session.verifiedCount}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-500">PENDING</div>
                    <div className="font-bold text-amber-400 mt-0.5">{session.pendingCount}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-500">REJECTED</div>
                    <div className="font-bold text-red-400 mt-0.5">{session.rejectedCount}</div>
                  </div>
                </div>
              </div>

              {/* Card Action */}
              <div className="mt-5 pt-3 border-t border-[#1C1C1C] flex items-center justify-between">
                <span className="text-[11px] font-mono text-neutral-500">
                  QR Nonce: #{session.qrNonce}
                </span>
                <Link to={`/admin/attendance/session/${session.id}`}>
                  <Button variant="secondary" size="sm" className="text-xs">
                    <span>Inspect Session</span>
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-neutral-500 bg-[#0B0B0B] rounded-2xl border border-[#262626]">
            No attendance sessions matching the criteria.
          </div>
        )}
      </div>

      {/* Start Session Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Start Attendance Session"
        subtitle="Broadcast dynamic QR and enforce geofence perimeter"
      >
        <form onSubmit={handleCreate} className="space-y-4">
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
            <div className="text-[11px] font-mono uppercase text-neutral-400">Location Geofence</div>
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
              Launch Session
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
