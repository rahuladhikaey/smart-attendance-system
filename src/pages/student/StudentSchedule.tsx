import React, { useState } from 'react';
import { Calendar, Clock, MapPin, QrCode, ArrowRight } from 'lucide-react';
import { classService } from '../../services/classService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';

export const StudentSchedule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'TODAY' | 'WEEK'>('TODAY');
  const classes = classService.getClasses();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Class Timetable & Schedule
          </h1>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            Semester 7 • Computer Science & Engineering
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#141414] p-1 rounded-lg border border-[#262626] text-xs font-mono">
          <button
            onClick={() => setActiveTab('TODAY')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'TODAY' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Today's Classes
          </button>
          <button
            onClick={() => setActiveTab('WEEK')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'WEEK' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Full Week
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {classes.slice(0, 4).map((cls, idx) => (
          <div
            key={cls.id}
            className="p-5 rounded-2xl bg-[#0B0B0B] border border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#141414] border border-[#262626] flex flex-col items-center justify-center font-mono shrink-0">
                <span className="text-[10px] text-neutral-500">LEC</span>
                <span className="text-sm font-bold text-white">0{idx + 1}</span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-neutral-400">{cls.code}</span>
                  {cls.activeSessionId && <Badge variant="live" dot>LIVE IN SESSION</Badge>}
                </div>
                <h3 className="text-base font-bold text-white mt-1">{cls.name}</h3>
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-400 mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                    10:00 AM - 11:30 AM
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                    {cls.room} ({cls.location.allowedRadius}m radius)
                  </span>
                  <span>Faculty: {cls.teacherName}</span>
                </div>
              </div>
            </div>

            <Link to="/student/attendance">
              <Button variant="primary" size="sm" className="text-xs font-semibold whitespace-nowrap">
                <QrCode className="w-3.5 h-3.5 mr-1" />
                Mark Attendance
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
