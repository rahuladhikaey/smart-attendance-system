export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  phone?: string;
  studentId?: string;
  teacherId?: string;
  createdAt: string;
}

export interface Student {
  id: string;
  studentId: string; // e.g. "STU-2026-089"
  name: string;
  email: string;
  phone: string;
  avatar: string;
  department: string;
  course: string;
  semester: string;
  classId: string;
  className: string;
  attendanceRate: number; // e.g. 91.4
  totalClasses: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  biometricStatus: 'ENROLLED' | 'NOT_ENROLLED' | 'PENDING';
  biometricEnrolledAt?: string;
  gpa: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
}

export interface Teacher {
  id: string;
  teacherId: string; // e.g. "FAC-104"
  name: string;
  email: string;
  phone: string;
  avatar: string;
  department: string;
  designation: string;
  assignedClasses: string[];
  activeSessionsCount: number;
  totalSessionsCount: number;
  status: 'ACTIVE' | 'ON_LEAVE';
}

export interface ClassScheduleItem {
  day: string;
  startTime: string;
  endTime: string;
  room: string;
}

export interface ClassLocation {
  name: string;
  lat: number;
  lng: number;
  allowedRadius: number; // meters
}

export interface AcademicClass {
  id: string;
  code: string; // e.g. "CS-401"
  name: string; // e.g. "Computer Science — Section A"
  department: string;
  semester: string;
  section: string;
  teacherId: string;
  teacherName: string;
  totalStudents: number;
  attendanceRate: number;
  room: string;
  schedule: ClassScheduleItem[];
  location: ClassLocation;
  activeSessionId?: string;
}

export interface AttendanceSession {
  id: string;
  classId: string;
  className: string;
  teacherId: string;
  teacherName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'LIVE' | 'COMPLETED' | 'SCHEDULED' | 'EXPIRED' | 'PAUSED';
  location: ClassLocation;
  allowedRadius: number;
  lateThresholdMinutes: number;
  qrToken: string;
  qrExpiresAt: string;
  qrNonce: number;
  totalStudents: number;
  verifiedCount: number;
  pendingCount: number;
  rejectedCount: number;
  manualOverrideCount: number;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  classId: string;
  className: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  studentAvatar: string;
  timestamp: string;
  status: 'PRESENT' | 'LATE' | 'ABSENT' | 'MANUAL_OVERRIDE';
  locationVerified: boolean;
  qrVerified: boolean;
  biometricVerified: boolean;
  distanceMeters: number;
  verificationMethod: string;
  receiptHash: string;
  overrideReason?: string;
  overrideBy?: string;
}

export interface VerificationAttempt {
  id: string;
  sessionId: string;
  className: string;
  studentId: string;
  studentName: string;
  timestamp: string;
  locationResult: 'PASS' | 'FAIL' | 'PENDING';
  qrResult: 'PASS' | 'FAIL' | 'PENDING';
  biometricResult: 'PASS' | 'FAIL' | 'PENDING';
  finalResult: 'VERIFIED' | 'REJECTED';
  failureReason?: string;
  distance: number;
}

export interface BiometricEnrollment {
  id: string;
  studentId: string;
  status: 'ENROLLED' | 'NOT_ENROLLED' | 'PENDING';
  enrolledAt: string;
  providerReference: string;
  qualityScore: number;
  livenessPassed: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  details: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'CRITICAL';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'ALERT' | 'INFO' | 'WARNING' | 'SUCCESS';
  timestamp: string;
  read: boolean;
  targetRole?: UserRole;
  link?: string;
}

export interface InstitutionConfig {
  name: string;
  code: string;
  tagline: string;
  minimumAttendanceThreshold: number; // e.g. 75
  defaultRadiusMeters: number; // e.g. 100
  lateThresholdMinutes: number; // e.g. 15
  qrRotationIntervalSeconds: number; // e.g. 30
  biometricProvider: string;
  twoFactorRequired: boolean;
  enforceGeofence: boolean;
  campusCenter: {
    lat: number;
    lng: number;
    name: string;
  };
}

export type VerificationStep = 'LOCATION' | 'QR_SCAN' | 'BIOMETRIC' | 'DUPLICATE_CHECK' | 'COMPLETE' | 'FAILED';

export interface VerificationPipelineResult {
  success: boolean;
  step: VerificationStep;
  record?: AttendanceRecord;
  receiptHash?: string;
  errorCode?: 'LOCATION_FAILED' | 'QR_FAILED' | 'BIOMETRIC_FAILED' | 'DUPLICATE' | 'SESSION_EXPIRED' | 'SESSION_CLOSED' | 'UNKNOWN';
  errorMessage?: string;
  details?: {
    distance?: number;
    allowedRadius?: number;
    qrValid?: boolean;
    biometricScore?: number;
    timestamp?: string;
  };
}
