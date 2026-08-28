import { AttendanceSession, AttendanceRecord, VerificationAttempt, AuditLogEntry, AcademicClass } from '../types';
import { MOCK_SESSIONS, MOCK_ATTENDANCE_RECORDS, MOCK_VERIFICATION_ATTEMPTS, MOCK_AUDIT_LOGS, MOCK_CLASSES, MOCK_STUDENTS } from '../data/mockData';

class AttendanceService {
  private sessions: AttendanceSession[] = [...MOCK_SESSIONS];
  private records: AttendanceRecord[] = [...MOCK_ATTENDANCE_RECORDS];
  private verificationAttempts: VerificationAttempt[] = [...MOCK_VERIFICATION_ATTEMPTS];
  private auditLogs: AuditLogEntry[] = [...MOCK_AUDIT_LOGS];
  private listeners: Array<() => void> = [];

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  public getSessions(): AttendanceSession[] {
    return [...this.sessions];
  }

  public getSessionById(id: string): AttendanceSession | undefined {
    return this.sessions.find(s => s.id === id);
  }

  public getLiveSessionForClass(classId: string): AttendanceSession | undefined {
    return this.sessions.find(s => s.classId === classId && s.status === 'LIVE');
  }

  public createSession(
    classItem: AcademicClass,
    teacherId: string,
    teacherName: string,
    allowedRadius: number = 100,
    lateThresholdMinutes: number = 15
  ): AttendanceSession {
    const newSession: AttendanceSession = {
      id: `sess-${Date.now()}`,
      classId: classItem.id,
      className: classItem.name,
      teacherId,
      teacherName,
      date: new Date().toISOString().split('T')[0],
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: new Date(Date.now() + 90 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'LIVE',
      location: classItem.location,
      allowedRadius,
      lateThresholdMinutes,
      qrToken: `ATT-SEC-${classItem.code}-${Date.now().toString().slice(-4)}`,
      qrExpiresAt: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
      qrNonce: Math.floor(Math.random() * 9000 + 1000),
      totalStudents: classItem.totalStudents,
      verifiedCount: 0,
      pendingCount: classItem.totalStudents,
      rejectedCount: 0,
      manualOverrideCount: 0,
    };

    this.sessions.unshift(newSession);
    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      userId: teacherId,
      userName: teacherName,
      role: 'TEACHER',
      action: 'SESSION_CREATED',
      details: `Created live attendance session for ${classItem.name} (${classItem.code}) with radius ${allowedRadius}m.`,
      ipAddress: '192.168.1.105',
      status: 'SUCCESS',
    });

    this.notify();
    return newSession;
  }

  public updateSessionStatus(sessionId: string, status: AttendanceSession['status']) {
    const session = this.sessions.find(s => s.id === sessionId);
    if (session) {
      session.status = status;
      this.notify();
    }
  }

  public getRecordsForSession(sessionId: string): AttendanceRecord[] {
    return this.records.filter(r => r.sessionId === sessionId);
  }

  public getRecordsForStudent(studentId: string): AttendanceRecord[] {
    return this.records.filter(r => r.studentId === studentId);
  }

  public hasStudentCheckedIn(sessionId: string, studentId: string): boolean {
    return this.records.some(r => r.sessionId === sessionId && r.studentId === studentId);
  }

  public addAttendanceRecord(record: AttendanceRecord): void {
    this.records.unshift(record);
    
    // Update session counts
    const session = this.sessions.find(s => s.id === record.sessionId);
    if (session) {
      session.verifiedCount += 1;
      session.pendingCount = Math.max(0, session.pendingCount - 1);
    }

    this.notify();
  }

  public addVerificationAttempt(attempt: VerificationAttempt): void {
    this.verificationAttempts.unshift(attempt);
    if (attempt.finalResult === 'REJECTED') {
      const session = this.sessions.find(s => s.id === attempt.sessionId);
      if (session) {
        session.rejectedCount += 1;
      }
    }
    this.notify();
  }

  public getVerificationAttempts(): VerificationAttempt[] {
    return [...this.verificationAttempts];
  }

  public getAuditLogs(): AuditLogEntry[] {
    return [...this.auditLogs];
  }

  /**
   * Manual Attendance Override by Admin or Teacher
   */
  public manualOverride(
    sessionId: string,
    studentId: string,
    reason: string,
    adminName: string = 'Dr. Arthur Vance'
  ): AttendanceRecord | null {
    const session = this.sessions.find(s => s.id === sessionId);
    const student = MOCK_STUDENTS.find(s => s.id === studentId);
    if (!session || !student) return null;

    const record: AttendanceRecord = {
      id: `rec-ovr-${Date.now()}`,
      sessionId: session.id,
      classId: session.classId,
      className: session.className,
      studentId: student.id,
      studentName: student.name,
      studentRoll: student.studentId,
      studentAvatar: student.avatar,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      status: 'MANUAL_OVERRIDE',
      locationVerified: false,
      qrVerified: false,
      biometricVerified: false,
      distanceMeters: 0,
      verificationMethod: `MANUAL_OVERRIDE (${adminName})`,
      receiptHash: `0xOVERRIDE-${Date.now().toString(16).toUpperCase()}`,
      overrideReason: reason,
      overrideBy: adminName,
    };

    this.records.unshift(record);
    session.manualOverrideCount += 1;
    session.verifiedCount += 1;
    session.pendingCount = Math.max(0, session.pendingCount - 1);

    this.auditLogs.unshift({
      id: `aud-ovr-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      userId: 'usr-admin-1',
      userName: adminName,
      role: 'ADMIN',
      action: 'MANUAL_OVERRIDE',
      details: `Manual attendance granted to ${student.name} (${student.studentId}) in ${session.className}. Reason: "${reason}"`,
      ipAddress: '192.168.1.14',
      status: 'WARNING',
    });

    this.notify();
    return record;
  }
}

export const attendanceService = new AttendanceService();
