import { AttendanceRecord, Student, AcademicClass } from '../types';
import { studentService } from './studentService';
import { classService } from './classService';
import { attendanceService } from './attendanceService';

class ReportService {
  public generateCSV(records: AttendanceRecord[]): string {
    const headers = ['Record ID', 'Student ID', 'Student Name', 'Class Name', 'Timestamp', 'Status', 'Location Verified', 'QR Verified', 'Biometric Verified', 'Receipt Hash'];
    const rows = records.map(r => [
      r.id,
      r.studentRoll,
      `"${r.studentName}"`,
      `"${r.className}"`,
      r.timestamp,
      r.status,
      r.locationVerified ? 'YES' : 'NO',
      r.qrVerified ? 'YES' : 'NO',
      r.biometricVerified ? 'YES' : 'NO',
      r.receiptHash,
    ]);

    return [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  }

  public downloadCSV(csvContent: string, fileName: string = 'attendance_report.csv') {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public getSummaryMetrics() {
    const students = studentService.getStudents();
    const classes = classService.getClasses();
    const sessions = attendanceService.getSessions();
    const attempts = attendanceService.getVerificationAttempts();

    const totalStudents = students.length;
    const avgAttendance = Math.round((students.reduce((acc, s) => acc + s.attendanceRate, 0) / (totalStudents || 1)) * 10) / 10;
    const lowAttendanceCount = students.filter(s => s.attendanceRate < 75).length;
    const verifiedAttempts = attempts.filter(a => a.finalResult === 'VERIFIED').length;
    const verificationRate = Math.round((verifiedAttempts / (attempts.length || 1)) * 1000) / 10;
    const locationFailures = attempts.filter(a => a.locationResult === 'FAIL').length;
    const qrFailures = attempts.filter(a => a.qrResult === 'FAIL').length;
    const bioFailures = attempts.filter(a => a.biometricResult === 'FAIL').length;

    return {
      totalStudents,
      totalClasses: classes.length,
      activeSessions: sessions.filter(s => s.status === 'LIVE').length,
      avgAttendance,
      lowAttendanceCount,
      verificationRate,
      locationFailures,
      qrFailures,
      bioFailures,
      totalAttempts: attempts.length,
    };
  }
}

export const reportService = new ReportService();
