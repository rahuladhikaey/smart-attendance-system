import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus, Eye, BookOpen, QrCode } from 'lucide-react';
import { teacherService } from '../../services/teacherService';
import { Teacher } from '../../types';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const TeachersList: React.FC = () => {
  const [teachers] = useState<Teacher[]>(teacherService.getTeachers());

  const columns: Column<Teacher>[] = [
    {
      key: 'name',
      header: 'Faculty Member',
      render: (t) => (
        <div className="flex items-center gap-2.5">
          <img
            src={t.avatar}
            alt={t.name}
            className="w-8 h-8 rounded-lg object-cover border border-[#262626]"
          />
          <div>
            <div className="font-semibold text-white">{t.name}</div>
            <div className="text-[11px] font-mono text-neutral-400">{t.designation}</div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'department',
      header: 'Department',
      render: (t) => (
        <div>
          <div className="text-white">{t.department}</div>
          <div className="text-[11px] font-mono text-neutral-400">{t.email}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'assignedClasses',
      header: 'Assigned Classes',
      render: (t) => (
        <div className="flex items-center gap-1.5 font-mono text-xs text-neutral-300">
          <BookOpen className="w-3.5 h-3.5 text-neutral-500" />
          <span>{t.assignedClasses.length} Courses</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'totalSessionsCount',
      header: 'Sessions Hosted',
      render: (t) => (
        <div className="font-mono text-white font-bold">
          {t.totalSessionsCount}
        </div>
      ),
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      render: (t) => (
        <Badge variant={t.status === 'ACTIVE' ? 'verified' : 'neutral'}>
          {t.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (t) => (
        <Link to={`/admin/teachers/${t.id}`}>
          <Button variant="ghost" size="sm" className="text-xs">
            <Eye className="w-3.5 h-3.5 mr-1" />
            Profile
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Faculty Directory
          </h1>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            {teachers.length} academic instructors authorized to broadcast dynamic QR attendance sessions
          </p>
        </div>
      </div>

      <DataTable
        data={teachers}
        columns={columns}
        searchKeys={['name', 'email', 'department', 'designation']}
        searchPlaceholder="Search faculty members..."
      />
    </div>
  );
};
