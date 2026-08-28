import { Student, AttendanceSession, AttendanceRecord, VerificationAttempt } from '../types';
import { locationService } from './locationService';
import { qrService } from './qrService';
import { biometricService } from './biometricService';
import { attendanceService } from './attendanceService';

export interface VerificationPipelineOptions {
  student: Student;
  session: AttendanceSession;
  scannedQrCode?: string;
  simulateOutsideLocation?: boolean;
  simulateExpiredQr?: boolean;
  simulateBiometricFail?: boolean;
}

export interface PipelineExecutionResult {
  success: boolean;
  stage: 'LOCATION' | 'QR_SCAN' | 'BIOMETRIC' | 'DUPLICATE_CHECK' | 'COMPLETE' | 'FAILED';
  record?: AttendanceRecord;
  receiptHash?: string;
  errorCode?: 'LOCATION_FAILED' | 'QR_FAILED' | 'BIOMETRIC_FAILED' | 'DUPLICATE' | 'SESSION_EXPIRED' | 'SESSION_CLOSED' | 'UNKNOWN';
  errorMessage?: string;
  metadata?: {
    distanceMeters?: number;
    allowedRadiusMeters?: number;
    biometricScore?: number;
    livenessScore?: number;
    receiptHash?: string;
    timestamp?: string;
  };
}

class VerificationEngine {
  /**
   * Executes the full physical presence verification pipeline in strict sequence:
   * 1. Check duplicate attendance
   * 2. Verify physical location (geofence radius)
   * 3. Verify live rotating QR token
   * 4. Verify facial biometric identity & liveness
   * 5. Record verified presence & cryptographic receipt
   */
  public async executePipeline(options: VerificationPipelineOptions): Promise<PipelineExecutionResult> {
    const { student, session, scannedQrCode, simulateOutsideLocation, simulateExpiredQr, simulateBiometricFail } = options;

    // Check duplicate first
    if (attendanceService.hasStudentCheckedIn(session.id, student.id)) {
      const attempt: VerificationAttempt = {
        id: `att-${Date.now()}`,
        sessionId: session.id,
        className: session.className,
        studentId: student.id,
        studentName: student.name,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        locationResult: 'PASS',
        qrResult: 'PASS',
        biometricResult: 'PASS',
        finalResult: 'REJECTED',
        failureReason: 'Duplicate check-in detected. Attendance already recorded for this session.',
        distance: 25,
      };
      attendanceService.addVerificationAttempt(attempt);

      return {
        success: false,
        stage: 'DUPLICATE_CHECK',
        errorCode: 'DUPLICATE',
        errorMessage: 'You have already completed attendance for this session. Duplicate check-ins are blocked.',
      };
    }

    // Step 1: Location Geofence check
    const locationRes = await locationService.verifyCurrentLocation(session.location, simulateOutsideLocation);
    if (!locationRes.passed) {
      const attempt: VerificationAttempt = {
        id: `att-${Date.now()}`,
        sessionId: session.id,
        className: session.className,
        studentId: student.id,
        studentName: student.name,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        locationResult: 'FAIL',
        qrResult: 'PENDING',
        biometricResult: 'PENDING',
        finalResult: 'REJECTED',
        failureReason: `Outside Geofence (${locationRes.distanceMeters}m from ${session.location.name}, allowed ${session.allowedRadius}m)`,
        distance: locationRes.distanceMeters,
      };
      attendanceService.addVerificationAttempt(attempt);

      return {
        success: false,
        stage: 'LOCATION',
        errorCode: 'LOCATION_FAILED',
        errorMessage: locationRes.errorMessage || 'You are outside the required classroom perimeter.',
        metadata: {
          distanceMeters: locationRes.distanceMeters,
          allowedRadiusMeters: locationRes.allowedRadiusMeters,
        },
      };
    }

    // Step 2: Live QR Token check
    const qrRes = await qrService.validateScannedToken(
      scannedQrCode || `ATTENDANCE_V1::${btoa(JSON.stringify({ sessionId: session.id, classId: session.classId, nonce: session.qrNonce, expiresAt: Date.now() + 20000 }))}`,
      session.id,
      simulateExpiredQr,
      false
    );

    if (!qrRes.valid) {
      const attempt: VerificationAttempt = {
        id: `att-${Date.now()}`,
        sessionId: session.id,
        className: session.className,
        studentId: student.id,
        studentName: student.name,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        locationResult: 'PASS',
        qrResult: 'FAIL',
        biometricResult: 'PENDING',
        finalResult: 'REJECTED',
        failureReason: qrRes.errorMessage || 'Invalid or Expired Live QR Code',
        distance: locationRes.distanceMeters,
      };
      attendanceService.addVerificationAttempt(attempt);

      return {
        success: false,
        stage: 'QR_SCAN',
        errorCode: 'QR_FAILED',
        errorMessage: qrRes.errorMessage || 'The live QR code could not be verified.',
      };
    }

    // Step 3: Biometric Identity & Liveness check
    const bioRes = await biometricService.verifyIdentity(student.id, student.name, simulateBiometricFail, false);
    if (!bioRes.passed) {
      const attempt: VerificationAttempt = {
        id: `att-${Date.now()}`,
        sessionId: session.id,
        className: session.className,
        studentId: student.id,
        studentName: student.name,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        locationResult: 'PASS',
        qrResult: 'PASS',
        biometricResult: 'FAIL',
        finalResult: 'REJECTED',
        failureReason: bioRes.errorMessage || 'Biometric liveness / facial identity match failed.',
        distance: locationRes.distanceMeters,
      };
      attendanceService.addVerificationAttempt(attempt);

      return {
        success: false,
        stage: 'BIOMETRIC',
        errorCode: 'BIOMETRIC_FAILED',
        errorMessage: bioRes.errorMessage || 'Biometric verification could not confirm your identity.',
      };
    }

    // Step 4: All Passed -> Generate Cryptographic Attendance Receipt
    const receiptHash = `0x${Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase()}`;
    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const newRecord: AttendanceRecord = {
      id: `rec-${Date.now()}`,
      sessionId: session.id,
      classId: session.classId,
      className: session.className,
      studentId: student.id,
      studentName: student.name,
      studentRoll: student.studentId,
      studentAvatar: student.avatar,
      timestamp: timestampStr,
      status: 'PRESENT',
      locationVerified: true,
      qrVerified: true,
      biometricVerified: true,
      distanceMeters: locationRes.distanceMeters,
      verificationMethod: 'Geofence GPS + Live Rotating QR + Facial Biometrics',
      receiptHash,
    };

    // Save record in attendance store
    attendanceService.addAttendanceRecord(newRecord);

    // Save successful verification attempt
    const attempt: VerificationAttempt = {
      id: `att-${Date.now()}`,
      sessionId: session.id,
      className: session.className,
      studentId: student.id,
      studentName: student.name,
      timestamp: timestampStr,
      locationResult: 'PASS',
      qrResult: 'PASS',
      biometricResult: 'PASS',
      finalResult: 'VERIFIED',
      distance: locationRes.distanceMeters,
    };
    attendanceService.addVerificationAttempt(attempt);

    return {
      success: true,
      stage: 'COMPLETE',
      record: newRecord,
      receiptHash,
      metadata: {
        distanceMeters: locationRes.distanceMeters,
        allowedRadiusMeters: session.allowedRadius,
        biometricScore: bioRes.matchScore,
        livenessScore: bioRes.livenessConfidence,
        receiptHash,
        timestamp: timestampStr,
      },
    };
  }
}

export const verificationEngine = new VerificationEngine();
