import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Users, QrCode } from 'lucide-react';
import { classService } from '../../services/classService';
import { studentService } from '../../services/studentService';
import { attendanceService } from '../../services/attendanceService';
import { authService } from '../../services/authService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const TeacherClassDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const classItem = classService.getClassById(id || 'cls-1');
  const students = studentService.getStudentsByClass(classItem?.id || 'cls-1');

  if (!classItem) {
    return (
      <div className="p-12 text-center text-neutral-400">
        Class not found.{' '}
        <Link to="/teacher/classes" className="text-white underline">
          Back to Classes
        </Link>
      </div>
    );
  }

  const handleStartSession = () => {
    const sess = attendanceService.createSession(classItem, currentUser.id, currentUser.name, classItem.location.allowedRadius);
    navigate(`/teacher/attendance/session/${sess.id}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <Link
            to="/teacher/classes"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to My Classes
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {classItem.name}
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#161616] border border-[#262626] text-neutral-300">
              {classItem.code}
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            {classItem.room} • {classItem.department}
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleStartSession}>
          <QrCode className="w-4 h-4 mr-1.5" />
          Launch Live Session
        </Button>
      </div>

      {/* Roster */}
      <div className="bg-[#0B0B0B] border border-[#262626] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#262626] flex items-center justify-between bg-[#0E0E0E]">
          <div>
            <h3 className="text-sm font-semibold text-white">Enrolled Student Roster</h3>
            <p className="text-xs text-neutral-400">Class performance and biometric statuses</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-[#141414] text-neutral-400 border-b border-[#262626] uppercase text-[11px] font-mono">
              <tr>
                <th className="px-5 py-3 font-medium">Student</th>
                <th className="px-5 py-3 font-medium">Attendance Rate</th>
                <th className="px-5 py-3 font-medium">Biometric Status</th>
                <th className="px-5 py-3 font-medium text-right">Classes Attended</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1C1C]">
              {students.map((stu) => (
                <tr key={stu.id} className="hover:bg-[#121212] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={stu.avatar}
                        alt={stu.name}
                        className="w-7 h-7 rounded-lg object-cover border border-[#262626]"
                      />
                      <div>
                        <div className="font-semibold text-white">{stu.name}</div>
                        <div className="text-[11px] font-mono text-neutral-400">{stu.studentId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-white font-bold">{stu.attendanceRate}%</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={stu.biometricStatus === 'ENROLLED' ? 'verified' : 'warning'}>
                      {stu.biometricStatus}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-neutral-400">
                    {stu.presentCount} / {stu.totalClasses}
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
