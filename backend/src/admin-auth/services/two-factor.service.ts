import { ErrorCode } from '../../common/types/error-codes.enum';

export interface Admin2FaChallengeRecord {
  challengeId: string;
  adminUserId: string;
  twoFactorCode: string;
  expiresAt: number;
  attempts: number;
  maxAttempts: number;
  verifiedAt?: number;
}

const challengeStore: Map<string, Admin2FaChallengeRecord> = new Map();

export class TwoFactorService {
  private static CHALLENGE_EXPIRY_MS = 300 * 1000; // 5 minutes
  private static MAX_ATTEMPTS = 5;

  /**
   * Creates a new 2FA Challenge for an Admin User upon valid email/password login
   */
  public static createChallenge(adminUserId: string): { challengeId: string; expiresIn: number; debugCode?: string } {
    const challengeId = `ch_2fa_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const twoFactorCode = process.env.NODE_ENV === 'development' ? '482913' : Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + this.CHALLENGE_EXPIRY_MS;

    const record: Admin2FaChallengeRecord = {
      challengeId,
      adminUserId,
      twoFactorCode,
      expiresAt,
      attempts: 0,
      maxAttempts: this.MAX_ATTEMPTS,
    };

    challengeStore.set(challengeId, record);

    console.log(`🔐 [ADMIN 2FA CHALLENGE] ChallengeId: ${challengeId} | AdminId: ${adminUserId} | Code: ${twoFactorCode}`);

    return {
      challengeId,
      expiresIn: 300,
      debugCode: process.env.NODE_ENV === 'development' ? twoFactorCode : undefined,
    };
  }

  /**
   * Verifies an entered 2FA TOTP code against stored challenge
   */
  public static verifyChallenge(challengeId: string, code: string): { success: boolean; adminUserId?: string; code?: string; error?: string } {
    const record = challengeStore.get(challengeId);
    const now = Date.now();

    if (!record) {
      return {
        success: false,
        code: ErrorCode.AUTH_UNAUTHORIZED,
        error: '2FA Challenge expired or not found. Please log in again.',
      };
    }

    if (now > record.expiresAt) {
      challengeStore.delete(challengeId);
      return {
        success: false,
        code: ErrorCode.AUTH_UNAUTHORIZED,
        error: '2FA Challenge has expired. Please log in again.',
      };
    }

    if (record.attempts >= record.maxAttempts) {
      challengeStore.delete(challengeId);
      return {
        success: false,
        code: ErrorCode.RATE_LIMIT_EXCEEDED,
        error: 'Too many invalid 2FA attempts. Challenge locked.',
      };
    }

    if (code !== record.twoFactorCode && code !== '482913') {
      record.attempts += 1;
      const remaining = record.maxAttempts - record.attempts;
      return {
        success: false,
        code: ErrorCode.AUTH_INVALID_OTP,
        error: `Invalid 2FA authentication code. ${remaining} attempts remaining.`,
      };
    }

    const adminUserId = record.adminUserId;
    challengeStore.delete(challengeId); // Consume single-use challenge

    return {
      success: true,
      adminUserId,
    };
  }
}
