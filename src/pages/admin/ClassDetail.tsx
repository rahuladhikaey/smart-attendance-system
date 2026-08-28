import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Users, Calendar, QrCode, Clock, BookOpen } from 'lucide-react';
import { classService } from '../../services/classService';
import { studentService } from '../../services/studentService';
import { attendanceService } from '../../services/attendanceService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const ClassDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const classItem = classService.getClassById(id || 'cls-1');
  const students = studentService.getStudentsByClass(classItem?.id || 'cls-1');

  if (!classItem) {
    return (
      <div className="p-12 text-center text-neutral-400">
        Class not found.{' '}
        <Link to="/admin/classes" className="text-white underline">
          Back to Classes
        </Link>
      </div>
    );
  }

  const handleStartSession = () => {
    const sess = attendanceService.createSession(classItem, classItem.teacherId, classItem.teacherName, classItem.location.allowedRadius);
    navigate(`/admin/attendance/session/${sess.id}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <Link
            to="/admin/classes"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Classes
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
            Instructor: {classItem.teacherName} • {classItem.department}
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleStartSession}>
          <QrCode className="w-4 h-4 mr-1.5" />
          Take Class Attendance
        </Button>
      </div>

      {/* Class Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-[#0B0B0B] border border-[#262626]">
          <span className="text-[10px] font-mono uppercase text-neutral-400">GEOFENCE LOCATION</span>
          <div className="text-base font-bold text-white mt-1">{classItem.location.name}</div>
          <div className="text-xs font-mono text-neutral-400 mt-2">
            Radius: {classItem.location.allowedRadius} meters • Lat: {classItem.location.lat}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B0B0B] border border-[#262626]">
          <span className="text-[10px] font-mono uppercase text-neutral-400">CLASS TIMETABLE</span>
          <div className="mt-2 space-y-1 text-xs text-neutral-300 font-mono">
            {classItem.schedule.map((sch, i) => (
              <div key={i} className="flex justify-between">
                <span>{sch.day}:</span>
                <span className="text-white">{sch.startTime} - {sch.endTime}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B0B0B] border border-[#262626]">
          <span className="text-[10px] font-mono uppercase text-neutral-400">ATTENDANCE BENCHMARK</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">{classItem.attendanceRate}%</div>
          <div className="text-xs text-neutral-400 mt-1">{students.length} enrolled students</div>
        </div>
      </div>

      {/* Student Roster Table */}
      <div className="bg-[#0B0B0B] border border-[#262626] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#262626] flex items-center justify-between bg-[#0E0E0E]">
          <div>
            <h3 className="text-sm font-semibold text-white">Enrolled Student Roster</h3>
            <p className="text-xs text-neutral-400">Biometric enrollment status & verified rates</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-[#141414] text-neutral-400 border-b border-[#262626] uppercase text-[11px] font-mono">
              <tr>
                <th className="px-5 py-3 font-medium">Student</th>
                <th className="px-5 py-3 font-medium">Attendance Rate</th>
                <th className="px-5 py-3 font-medium">Biometric Status</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
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
                  <td className="px-5 py-3.5 text-right">
                    <Link to={`/admin/students/${stu.id}`}>
                      <Button variant="ghost" size="sm" className="text-xs">
                        Profile
                      </Button>
                    </Link>
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
