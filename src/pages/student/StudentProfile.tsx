import React from 'react';
import { studentService } from '../../services/studentService';
import { Fingerprint, ShieldCheck, Mail, Phone, BookOpen, GraduationCap, CheckCircle2 } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export const StudentProfile: React.FC = () => {
  const student = studentService.getStudentById('stu-1') || studentService.getStudents()[0];

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="pb-6 border-b border-[#262626]">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Student Digital Identity Card
        </h1>
        <p className="text-xs text-neutral-400 mt-1 font-mono">
          Enrolled institutional identity & physical presence credentials
        </p>
      </div>

      {/* Identity Card */}
      <div className="p-8 bg-[#0B0B0B] border border-[#262626] rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-28 h-28 rounded-2xl object-cover border-2 border-white/20 shadow-xl"
          />

          <div className="text-center sm:text-left flex-1 space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-extrabold text-white">{student.name}</h2>
              <Badge variant="verified">VERIFIED STUDENT</Badge>
            </div>
            <div className="text-xs font-mono text-neutral-400">{student.studentId} • {student.email}</div>
            <div className="text-xs text-neutral-500 font-medium mt-1">
              {student.course} — {student.semester}
            </div>

            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#141414] border border-[#222222]">
                <div className="text-[10px] text-neutral-500">ATTENDANCE</div>
                <div className="font-bold text-white mt-0.5">{student.attendanceRate}%</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#141414] border border-[#222222]">
                <div className="text-[10px] text-neutral-500">SEMESTER GPA</div>
                <div className="font-bold text-white mt-0.5">{student.gpa}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#141414] border border-[#222222]">
                <div className="text-[10px] text-neutral-500">PRESENT</div>
                <div className="font-bold text-emerald-400 mt-0.5">{student.presentCount}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#141414] border border-[#222222]">
                <div className="text-[10px] text-neutral-500">STATUS</div>
                <div className="font-bold text-white mt-0.5">{student.status}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Biometric Security Specification */}
      <div className="p-6 bg-[#0B0B0B] border border-[#262626] rounded-2xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#262626]">
          <Fingerprint className="w-5 h-5 text-white" />
          <h3 className="text-sm font-semibold text-white">Biometric Security Enrollment</h3>
        </div>

        <div className="p-4 rounded-xl bg-[#111111] border border-[#222222] text-xs font-mono space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Enrollment Status:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {student.biometricStatus}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Registration Date:</span>
            <span className="text-white">{student.biometricEnrolledAt || '2025-08-20'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Vector Token Hash:</span>
            <span className="text-neutral-500">0xVEC512-AES256-ENCRYPTED</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Privacy Safeguard:</span>
            <span className="text-emerald-400">Zero Raw Pixels Retained</span>
          </div>
        </div>
      </div>
    </div>
  );
};
