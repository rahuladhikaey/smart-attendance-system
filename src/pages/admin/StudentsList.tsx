import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, Plus, Search, Filter, Fingerprint, 
  CheckCircle2, AlertTriangle, Eye, ArrowUpRight, Camera 
} from 'lucide-react';
import { studentService } from '../../services/studentService';
import { classService } from '../../services/classService';
import { biometricService } from '../../services/biometricService';
import { Student } from '../../types';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const StudentsList: React.FC = () => {
  const navigate = useNavigate();
  const classes = classService.getClasses();
  const [students, setStudents] = useState<Student[]>(studentService.getStudents());
  const [filterDept, setFilterDept] = useState<string>('ALL');
  const [filterBio, setFilterBio] = useState<string>('ALL');

  // Add Student Wizard State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState({
    name: '',
    studentId: `STU-2026-${String(students.length + 1).padStart(3, '0')}`,
    email: '',
    phone: '',
    department: 'Computer Science & Engineering',
    course: 'B.Tech in Computer Science',
    semester: 'Semester 7',
    classId: classes[0]?.id || 'cls-1',
    className: classes[0]?.name || 'Distributed Systems & Cloud Computing',
    gpa: '3.80',
    biometricStatus: 'NOT_ENROLLED' as 'ENROLLED' | 'NOT_ENROLLED',
  });
  const [isCapturingBio, setIsCapturingBio] = useState(false);

  useEffect(() => {
    const unsub = studentService.subscribe(() => {
      setStudents(studentService.getStudents());
    });
    return unsub;
  }, []);

  const filteredStudents = students.filter(s => {
    const matchDept = filterDept === 'ALL' || s.department === filterDept;
    const matchBio = filterBio === 'ALL' || s.biometricStatus === filterBio;
    return matchDept && matchBio;
  });

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
      key: 'department',
      header: 'Department / Class',
      render: (stu) => (
        <div>
          <div className="text-white">{stu.className}</div>
          <div className="text-[11px] text-neutral-400">{stu.department}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'attendanceRate',
      header: 'Attendance',
      render: (stu) => (
        <div className="flex items-center gap-2">
          <span
            className={`font-mono font-bold ${
              stu.attendanceRate >= 75 ? 'text-white' : 'text-red-400'
            }`}
          >
            {stu.attendanceRate}%
          </span>
          <div className="w-14 bg-[#1F1F1F] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full ${stu.attendanceRate >= 75 ? 'bg-white' : 'bg-red-500'}`}
              style={{ width: `${stu.attendanceRate}%` }}
            />
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'biometricStatus',
      header: 'Biometric Status',
      render: (stu) => (
        <div>
          {stu.biometricStatus === 'ENROLLED' ? (
            <Badge variant="verified">
              <Fingerprint className="w-3 h-3 mr-1 text-white" />
              ENROLLED
            </Badge>
          ) : (
            <Badge variant="warning">
              <Fingerprint className="w-3 h-3 mr-1 text-amber-400" />
              PENDING
            </Badge>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (stu) => (
        <Link to={`/admin/students/${stu.id}`}>
          <Button variant="ghost" size="sm" className="text-xs">
            <Eye className="w-3.5 h-3.5 mr-1" />
            Profile
          </Button>
        </Link>
      ),
    },
  ];

  const handleStartBioCapture = async () => {
    setIsCapturingBio(true);
    await biometricService.enrollStudent(formData.studentId);
    setFormData(prev => ({ ...prev, biometricStatus: 'ENROLLED' }));
    setIsCapturingBio(false);
  };

  const handleFinishWizard = () => {
    const avatar = `https://api.dicebear.com/7.x/micah/svg?seed=${formData.name}&backgroundColor=161616`;
    studentService.addStudent({
      ...formData,
      avatar,
      status: 'ACTIVE',
    });
    setIsAddModalOpen(false);
    setWizardStep(1);
    navigate(`/admin/students/${formData.studentId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Student Directory
          </h1>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            {students.length} registered students • Neural biometric templates & attendance tracking
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Enroll New Student
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#0B0B0B] border border-[#262626] rounded-xl">
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-neutral-500 uppercase text-[11px]">Department:</span>
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="bg-[#141414] border border-[#262626] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-white"
          >
            <option value="ALL">All Departments</option>
            <option value="Computer Science & Engineering">Computer Science</option>
            <option value="Artificial Intelligence & Robotics">AI & Robotics</option>
            <option value="Electrical Engineering">Electrical Engineering</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-neutral-500 uppercase text-[11px]">Biometrics:</span>
          <select
            value={filterBio}
            onChange={(e) => setFilterBio(e.target.value)}
            className="bg-[#141414] border border-[#262626] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="ENROLLED">Enrolled Only</option>
            <option value="NOT_ENROLLED">Pending Enrollment</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        data={filteredStudents}
        columns={columns}
        searchKeys={['name', 'studentId', 'email', 'className', 'department']}
        searchPlaceholder="Search by student name, ID or email..."
        itemsPerPage={10}
      />

      {/* Add Student Onboarding Wizard Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Student Onboarding & Biometric Registration"
        subtitle={`Step ${wizardStep} of 4: ${
          wizardStep === 1
            ? 'Personal Information'
            : wizardStep === 2
            ? 'Academic Placement'
            : wizardStep === 3
            ? 'Facial Biometric Enrollment'
            : 'Review & Confirm'
        }`}
        maxWidth="lg"
      >
        <div className="space-y-4">
          {/* Step 1: Personal Info */}
          {wizardStep === 1 && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maya Lin"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="student@institution.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Academic Placement */}
          {wizardStep === 2 && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Academic Class
                </label>
                <select
                  value={formData.classId}
                  onChange={(e) => {
                    const cls = classes.find(c => c.id === e.target.value);
                    if (cls) {
                      setFormData({
                        ...formData,
                        classId: cls.id,
                        className: cls.name,
                        department: cls.department,
                      });
                    }
                  }}
                  className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.code}) — {cls.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    Semester
                  </label>
                  <input
                    type="text"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    Target GPA Benchmark
                  </label>
                  <input
                    type="text"
                    value={formData.gpa}
                    onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Biometric Enrollment */}
          {wizardStep === 3 && (
            <div className="space-y-4 text-center">
              <div className="p-6 bg-[#050505] rounded-2xl border border-[#262626] max-w-sm mx-auto flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center mb-3">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <div className="text-sm font-semibold text-white">Neural Face Template Enrollment</div>
                <p className="text-xs text-neutral-400 mt-1">
                  Extracts 512-dimension mathematical vector embeddings. No raw photos are saved.
                </p>

                {formData.biometricStatus === 'ENROLLED' ? (
                  <div className="mt-4 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Facial vector template successfully registered!</span>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-4 text-xs font-bold"
                    isLoading={isCapturingBio}
                    onClick={handleStartBioCapture}
                  >
                    Launch Camera & Capture Biometric
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {wizardStep === 4 && (
            <div className="p-4 bg-[#111111] rounded-xl border border-[#222222] space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-neutral-400">Student Name:</span>
                <span className="text-white font-bold">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Student ID:</span>
                <span className="text-white">{formData.studentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Class:</span>
                <span className="text-white">{formData.className}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Biometric Template:</span>
                <span className="text-emerald-400 font-bold">{formData.biometricStatus}</span>
              </div>
            </div>
          )}

          {/* Wizard Controls */}
          <div className="flex justify-between pt-4 border-t border-[#262626]">
            {wizardStep > 1 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWizardStep((prev) => (prev - 1) as any)}
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            {wizardStep < 4 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setWizardStep((prev) => (prev + 1) as any)}
                disabled={wizardStep === 1 && !formData.name}
              >
                Next Step
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={handleFinishWizard}>
                Create Student Record
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
