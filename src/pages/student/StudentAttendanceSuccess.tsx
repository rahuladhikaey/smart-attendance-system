import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, ArrowRight, ShieldCheck, Download, Printer, 
  MapPin, QrCode, Fingerprint, Calendar, Clock 
} from 'lucide-react';
import { studentService } from '../../services/studentService';
import { AttendanceRecord } from '../../types';
import { Button } from '../../components/ui/Button';
import { AttendanceReceipt } from '../../components/verification/AttendanceReceipt';

export const StudentAttendanceSuccess: React.FC = () => {
  const navigate = useNavigate();
  const student = studentService.getStudentById('stu-1') || studentService.getStudents()[0];

  // Retrieve latest verified record from session storage or mock fallback
  const savedRecord = sessionStorage.getItem('latest_attendance_receipt');
  const record: AttendanceRecord = savedRecord
    ? JSON.parse(savedRecord)
    : {
        id: `rec-${Date.now()}`,
        sessionId: 'sess-live-101',
        classId: 'cls-1',
        className: 'Distributed Systems & Cloud Computing',
        studentId: student.id,
        studentName: student.name,
        studentRoll: student.studentId,
        studentAvatar: student.avatar,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        status: 'PRESENT',
        locationVerified: true,
        qrVerified: true,
        biometricVerified: true,
        distanceMeters: 38,
        verificationMethod: 'Geofence GPS + Live QR + Facial Biometrics',
        receiptHash: '0x7F8B92A1C30E44D6B8891A9C2F',
      };

  return (
    <div className="max-w-xl mx-auto py-6 space-y-6">
      {/* Top Banner Celebration */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-3xl bg-white text-black flex items-center justify-center font-black text-2xl mx-auto shadow-2xl shadow-white/20 animate-in zoom-in-50 duration-300">
          ✓
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight pt-2">
          ATTENDANCE VERIFIED
        </h1>
        <p className="text-xs font-mono text-neutral-400">
          Physical presence cryptographically confirmed & recorded to institutional ledger.
        </p>
      </div>

      {/* Digital Receipt Pass */}
      <AttendanceReceipt record={record} />

      {/* Action Navigation */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link to="/student/history" className="flex-1">
          <Button variant="secondary" size="md" className="w-full text-xs">
            View Attendance History
          </Button>
        </Link>
        <Link to="/student/dashboard" className="flex-1">
          <Button variant="primary" size="md" className="w-full text-xs font-bold">
            <span>Return to Dashboard</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
