import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, MapPin, Users, Plus, ArrowUpRight, QrCode } from 'lucide-react';
import { classService } from '../../services/classService';
import { attendanceService } from '../../services/attendanceService';
import { AcademicClass } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const ClassesList: React.FC = () => {
  const navigate = useNavigate();
  const classes = classService.getClasses();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<AcademicClass | null>(null);
  const [radius, setRadius] = useState(100);

  const handleStartSession = (cls: AcademicClass) => {
    const sess = attendanceService.createSession(cls, cls.teacherId, cls.teacherName, radius);
    navigate(`/admin/attendance/session/${sess.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Class Management
          </h1>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            {classes.length} registered course sections with assigned geofence locations
          </p>
        </div>
      </div>

      {/* Class Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="p-6 rounded-2xl bg-[#0B0B0B] border border-[#262626] hover:border-neutral-700 transition-all flex flex-col justify-between group"
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

              <h3 className="text-base font-bold text-white mt-3 group-hover:text-neutral-200">
                {cls.name}
              </h3>
              <div className="text-xs text-neutral-400 mt-1">Instructor: {cls.teacherName}</div>

              <div className="mt-4 space-y-2 text-xs text-neutral-400 font-mono">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="truncate">{cls.location.name} ({cls.location.allowedRadius}m)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{cls.totalStudents} Enrolled Students</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#1C1C1C] flex items-center justify-between gap-2">
              <Link to={`/admin/classes/${cls.id}`} className="flex-1">
                <Button variant="secondary" size="sm" className="w-full text-xs">
                  Class Detail
                </Button>
              </Link>
              <Button
                variant="primary"
                size="sm"
                className="text-xs font-semibold"
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
