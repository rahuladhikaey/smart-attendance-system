import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, QrCode, Mail, Phone, Building, ArrowUpRight } from 'lucide-react';
import { teacherService } from '../../services/teacherService';
import { classService } from '../../services/classService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const TeacherDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const teacher = teacherService.getTeacherById(id || 'tch-1');
  const assignedClasses = classService.getClasses().filter(c => c.teacherId === teacher?.id);

  if (!teacher) {
    return (
      <div className="p-12 text-center text-neutral-400">
        Teacher not found.{' '}
        <Link to="/admin/teachers" className="text-white underline">
          Back to Faculty Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-[#262626]">
        <Link
          to="/admin/teachers"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Faculty
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {teacher.name}
          </h1>
          <Badge variant="verified">{teacher.status}</Badge>
        </div>
        <p className="text-xs text-neutral-400 mt-1 font-mono">
          {teacher.designation} • {teacher.department} • Ref {teacher.teacherId}
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-[#0B0B0B] border border-[#262626] rounded-2xl flex flex-col items-center text-center">
          <img
            src={teacher.avatar}
            alt={teacher.name}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-[#262626] mb-4 shadow-xl"
          />
          <h3 className="text-lg font-bold text-white">{teacher.name}</h3>
          <div className="text-xs font-mono text-neutral-400 mt-0.5">{teacher.email}</div>
          <div className="text-xs text-neutral-500 mt-1">{teacher.phone}</div>
        </div>

        <div className="md:col-span-2 p-6 bg-[#0B0B0B] border border-[#262626] rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Faculty Activity & Sessions</h3>
            <p className="text-xs text-neutral-400 mt-1">Authorized courses and live attendance stats</p>

            <div className="mt-6 grid grid-cols-3 gap-3 text-center font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#111111] border border-[#222222]">
                <div className="text-[10px] text-neutral-500">ASSIGNED COURSES</div>
                <div className="text-xl font-bold text-white mt-1">{assignedClasses.length}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#111111] border border-[#222222]">
                <div className="text-[10px] text-neutral-500">TOTAL SESSIONS</div>
                <div className="text-xl font-bold text-white mt-1">{teacher.totalSessionsCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#111111] border border-[#222222]">
                <div className="text-[10px] text-neutral-500">ACTIVE TODAY</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">{teacher.activeSessionsCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Classes */}
      <div className="bg-[#0B0B0B] border border-[#262626] rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Assigned Academic Classes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignedClasses.map((cls) => (
            <div
              key={cls.id}
              className="p-4 rounded-xl bg-[#111111] border border-[#222222] flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-white">{cls.name}</div>
                <div className="text-xs font-mono text-neutral-400 mt-0.5">{cls.code} • {cls.room}</div>
              </div>
              <Link to={`/admin/classes/${cls.id}`}>
                <Button variant="secondary" size="sm" className="text-xs">
                  Class Detail
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
