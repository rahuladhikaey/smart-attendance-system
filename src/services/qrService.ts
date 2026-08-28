import { AttendanceSession } from '../types';

export interface QRTokenPayload {
  sessionId: string;
  classId: string;
  nonce: number;
  issuedAt: number;
  expiresAt: number;
  signature: string;
}

export interface QRValidationResult {
  valid: boolean;
  sessionId?: string;
  errorMessage?: string;
  errorCode?: 'INVALID_FORMAT' | 'EXPIRED' | 'WRONG_CLASS' | 'SESSION_CLOSED' | 'NONCE_MISMATCH';
}

class QRService {
  private rotationSeconds = 30;

  /**
   * Generates a time-based rolling QR token payload with cryptographic signature simulation
   */
  public generateDynamicToken(session: AttendanceSession): { rawString: string; payload: QRTokenPayload; remainingSeconds: number } {
    const now = Date.now();
    const period = this.rotationSeconds * 1000;
    const currentPeriodStart = Math.floor(now / period) * period;
    const expiresAt = currentPeriodStart + period;
    const remainingSeconds = Math.max(0, Math.ceil((expiresAt - now) / 1000));
    
    // Rotating nonce derived from time period
    const nonce = Math.abs((currentPeriodStart * 17) % 999999);
    const signature = `SIG-${session.classId}-${nonce.toString(16).toUpperCase()}-${session.id.slice(-4)}`;

    const payload: QRTokenPayload = {
      sessionId: session.id,
      classId: session.classId,
      nonce,
      issuedAt: currentPeriodStart,
      expiresAt,
      signature,
    };

    const rawString = `ATTENDANCE_V1::${btoa(JSON.stringify(payload))}`;

    return { rawString, payload, remainingSeconds };
  }

  /**
   * Validates a scanned QR string against the expected active class session
   */
  public async validateScannedToken(
    scannedRaw: string,
    expectedSessionId?: string,
    simulateExpired: boolean = false,
    simulateWrongClass: boolean = false
  ): Promise<QRValidationResult> {
    // Artificial latency for crypto hash verification
    await new Promise((r) => setTimeout(r, 1200));

    if (simulateExpired) {
      return {
        valid: false,
        errorMessage: 'The scanned QR code has expired. Please scan the current code on the screen.',
        errorCode: 'EXPIRED',
      };
    }

    if (simulateWrongClass) {
      return {
        valid: false,
        errorMessage: 'This QR code belongs to a different academic class or room.',
        errorCode: 'WRONG_CLASS',
      };
    }

    if (!scannedRaw || !scannedRaw.startsWith('ATTENDANCE_V1::')) {
      return {
        valid: false,
        errorMessage: 'Invalid QR format. Please scan an authentic ATTENDANCE system code.',
        errorCode: 'INVALID_FORMAT',
      };
    }

    try {
      const jsonStr = atob(scannedRaw.replace('ATTENDANCE_V1::', ''));
      const payload: QRTokenPayload = JSON.parse(jsonStr);

      if (expectedSessionId && payload.sessionId !== expectedSessionId) {
        return {
          valid: false,
          errorMessage: 'This QR code is for a different session.',
          errorCode: 'WRONG_CLASS',
        };
      }

      const now = Date.now();
      // Allow slight grace window of 10 seconds for camera latency
      if (now > payload.expiresAt + 10000) {
        return {
          valid: false,
          errorMessage: 'The live QR token has expired. Wait for the live screen to refresh.',
          errorCode: 'EXPIRED',
        };
      }

      return {
        valid: true,
        sessionId: payload.sessionId,
      };
    } catch {
      return {
        valid: false,
        errorMessage: 'Failed to decode verification QR token.',
        errorCode: 'INVALID_FORMAT',
      };
    }
  }
}

export const qrService = new QRService();
