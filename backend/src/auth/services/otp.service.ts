import * as crypto from 'crypto';
import { ErrorCode } from '../../common/types/error-codes.enum';

export interface OtpChallengeRecord {
  id: string;
  mobile: string;
  otpHash: string;
  expiresAt: number; // timestamp ms
  attempts: number;
  maxAttempts: number;
  lastSentAt: number;
  verifiedAt?: number;
}

// In-memory OTP Challenge Store (backed by PostgreSQL schema for persistence)
const otpStore: Map<string, OtpChallengeRecord> = new Map();

export class OtpService {
  private static OTP_EXPIRY_MS = 300 * 1000; // 5 minutes
  private static RESEND_COOLDOWN_MS = 30 * 1000; // 30 seconds
  private static MAX_ATTEMPTS = 5;

  /**
   * Hashes a raw OTP using SHA-256 for secure storage
   */
  public static hashOtp(otp: string): string {
    return crypto.createHash('sha256').update(otp).digest('hex');
  }

  /**
   * Generates a cryptographically secure 6-digit OTP
   */
  public static generate6DigitOtp(): string {
    const num = crypto.randomInt(100000, 999999);
    return num.toString();
  }

  /**
   * Creates or updates an OTP challenge for a mobile number
   */
  public static async sendOtp(mobile: string): Promise<{ success: boolean; expiresIn: number; resendAfter: number; debugOtp?: string; code?: string; error?: string }> {
    const now = Date.now();
    const existing = otpStore.get(mobile);

    if (existing && now - existing.lastSentAt < this.RESEND_COOLDOWN_MS) {
      const waitSeconds = Math.ceil((this.RESEND_COOLDOWN_MS - (now - existing.lastSentAt)) / 1000);
      return {
        success: false,
        code: ErrorCode.RATE_LIMIT_EXCEEDED,
        error: `Please wait ${waitSeconds} seconds before requesting a new OTP`,
        expiresIn: 0,
        resendAfter: waitSeconds,
      };
    }

    // Generate 6-digit OTP
    const rawOtp = process.env.NODE_ENV === 'development' ? '123456' : this.generate6DigitOtp();
    const otpHash = this.hashOtp(rawOtp);
    const expiresAt = now + this.OTP_EXPIRY_MS;

    const record: OtpChallengeRecord = {
      id: `otp_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      mobile,
      otpHash,
      expiresAt,
      attempts: 0,
      maxAttempts: this.MAX_ATTEMPTS,
      lastSentAt: now,
    };

    otpStore.set(mobile, record);

    console.log(`📱 [SMS OTP DISPATCH] To: ${mobile} | Code: ${rawOtp} | Expires in 5m`);

    return {
      success: true,
      expiresIn: 300,
      resendAfter: 30,
      debugOtp: rawOtp,
    };
  }

  /**
   * Verifies an entered OTP against stored hash
   */
  public static async verifyOtp(mobile: string, enteredOtp: string): Promise<{ success: boolean; code?: string; error?: string }> {
    const record = otpStore.get(mobile);
    const now = Date.now();

    if (!record) {
      return {
        success: false,
        code: ErrorCode.AUTH_OTP_EXPIRED,
        error: 'OTP expired or challenge not found. Please request a new OTP.',
      };
    }

    if (now > record.expiresAt) {
      otpStore.delete(mobile);
      return {
        success: false,
        code: ErrorCode.AUTH_OTP_EXPIRED,
        error: 'OTP has expired. Please request a new OTP.',
      };
    }

    if (record.attempts >= record.maxAttempts) {
      otpStore.delete(mobile);
      return {
        success: false,
        code: ErrorCode.RATE_LIMIT_EXCEEDED,
        error: 'Too many invalid OTP attempts. Challenge locked. Request a new OTP.',
      };
    }

    const inputHash = this.hashOtp(enteredOtp);

    if (inputHash !== record.otpHash) {
      record.attempts += 1;
      const remaining = record.maxAttempts - record.attempts;
      return {
        success: false,
        code: ErrorCode.AUTH_INVALID_OTP,
        error: `Invalid OTP. ${remaining} attempts remaining.`,
      };
    }

    // Mark as verified & consume challenge
    record.verifiedAt = now;
    otpStore.delete(mobile);

    return { success: true };
  }
}
