import React, { useState } from 'react';
import { studentService } from '../../services/studentService';
import { Student } from '../../types';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Fingerprint } from 'lucide-react';

export const TeacherStudents: React.FC = () => {
  const [students] = useState<Student[]>(studentService.getStudents());

  const columns: Column<Student>[] = [
    {
      key: 'student',
      header: 'Student',
      render: (stu) => (
        <div className="flex items-center gap-2.5">
          <img
            src={stu.avatar}
            alt={stu.name}
            className="w-8 h-8 rounded-lg object-cover border border-[#262626]"
          />
          <div>
            <div className="font-semibold text-white">{stu.name}</div>
            <div className="text-[11px] font-mono text-neutral-400">{stu.studentId}</div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'className',
      header: 'Class / Course',
      render: (stu) => <div className="text-white">{stu.className}</div>,
      sortable: true,
    },
    {
      key: 'attendanceRate',
      header: 'Attendance Rate',
      render: (stu) => (
        <span className={`font-mono font-bold ${stu.attendanceRate >= 75 ? 'text-white' : 'text-red-400'}`}>
          {stu.attendanceRate}%
        </span>
      ),
      sortable: true,
    },
    {
      key: 'biometricStatus',
      header: 'Biometric Registered',
      render: (stu) => (
        <Badge variant={stu.biometricStatus === 'ENROLLED' ? 'verified' : 'warning'}>
          <Fingerprint className="w-3 h-3 mr-1" />
          {stu.biometricStatus}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-[#262626]">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Class Students
        </h1>
        <p className="text-xs text-neutral-400 mt-1 font-mono">
          Roster of students across your assigned academic sections
        </p>
      </div>

      <DataTable
        data={students}
        columns={columns}
        searchKeys={['name', 'studentId', 'className']}
        searchPlaceholder="Search student name or roll..."
      />
    </div>
  );
};
