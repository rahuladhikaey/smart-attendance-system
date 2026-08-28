import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, MapPin, Users, QrCode } from 'lucide-react';
import { classService } from '../../services/classService';
import { attendanceService } from '../../services/attendanceService';
import { authService } from '../../services/authService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { AcademicClass } from '../../types';

export const TeacherClasses: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const classes = classService.getClasses();

  const handleStartSession = (cls: AcademicClass) => {
    const sess = attendanceService.createSession(cls, currentUser.id, currentUser.name, cls.location.allowedRadius);
    navigate(`/teacher/attendance/session/${sess.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-[#262626]">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          My Teaching Courses
        </h1>
        <p className="text-xs text-neutral-400 mt-1 font-mono">
          Course rosters, schedules, and active geofences under your faculty assignment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="p-6 rounded-2xl bg-[#0B0B0B] border border-[#262626] hover:border-neutral-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-mono uppercase text-neutral-400">
                  {cls.code} • {cls.semester}
                </span>
                <Badge variant={cls.attendanceRate >= 90 ? 'verified' : 'default'}>
                  {cls.attendanceRate}% Attendance
                </Badge>
              </div>

              <h3 className="text-base font-bold text-white mt-3">{cls.name}</h3>
              <div className="text-xs font-mono text-neutral-400 mt-2 space-y-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{cls.location.name} ({cls.location.allowedRadius}m)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{cls.totalStudents} Enrolled Students</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#1C1C1C] flex items-center justify-between gap-2">
              <Link to={`/teacher/classes/${cls.id}`} className="flex-1">
                <Button variant="secondary" size="sm" className="w-full text-xs">
                  Roster
                </Button>
              </Link>
              <Button
                variant="primary"
                size="sm"
                className="text-xs"
                onClick={() => handleStartSession(cls)}
              >
                <QrCode className="w-3.5 h-3.5 mr-1" />
                Live QR
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
