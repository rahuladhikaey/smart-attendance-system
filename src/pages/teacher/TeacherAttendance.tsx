import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QrCode, ArrowUpRight, MapPin, Clock, Plus } from 'lucide-react';
import { attendanceService } from '../../services/attendanceService';
import { AttendanceSession } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const TeacherAttendance: React.FC = () => {
  const [sessions, setSessions] = useState<AttendanceSession[]>(attendanceService.getSessions());

  useEffect(() => {
    const unsub = attendanceService.subscribe(() => {
      setSessions(attendanceService.getSessions());
    });
    return unsub;
  }, []);

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-[#262626]">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          My Hosted Attendance Sessions
        </h1>
        <p className="text-xs text-neutral-400 mt-1 font-mono">
          Past and active live QR broadcasts for your academic classes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sessions.map((sess) => (
          <div
            key={sess.id}
            className="p-5 rounded-2xl bg-[#0B0B0B] border border-[#262626] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-mono text-neutral-500 uppercase">
                  Ref: {sess.id}
                </span>
                {sess.status === 'LIVE' && <Badge variant="live" dot>LIVE</Badge>}
                {sess.status === 'COMPLETED' && <Badge variant="default">COMPLETED</Badge>}
              </div>

              <h3 className="text-base font-bold text-white mt-3">{sess.className}</h3>
              <div className="text-xs text-neutral-400 mt-1 font-mono">{sess.date} • {sess.startTime}</div>

              <div className="mt-4 p-3 rounded-xl bg-[#111111] border border-[#222222] grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div>
                  <div className="text-[10px] text-neutral-500">ENROLLED</div>
                  <div className="font-bold text-white mt-0.5">{sess.totalStudents}</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-500">VERIFIED</div>
                  <div className="font-bold text-emerald-400 mt-0.5">{sess.verifiedCount}</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-500">REJECTED</div>
                  <div className="font-bold text-red-400 mt-0.5">{sess.rejectedCount}</div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#1C1C1C] flex justify-end">
              <Link to={`/teacher/attendance/session/${sess.id}`}>
                <Button variant="secondary" size="sm" className="text-xs">
                  <span>Session Monitor</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
