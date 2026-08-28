import { OtpService } from './services/otp.service';
import { SessionService } from './services/session.service';
import { ErrorCode } from '../common/types/error-codes.enum';
import { usersData } from '../data/mockDatabase';

export class AuthService {
  /**
   * Dispatches 6-digit SMS OTP
   */
  public static async sendOtp(mobile: string) {
    return OtpService.sendOtp(mobile);
  }

  /**
   * Verifies OTP, checks user status, creates or finds user, and generates token pair
   */
  public static async verifyOtp(input: { mobile: string; otp: string; deviceId?: string; platform?: string }) {
    const verification = await OtpService.verifyOtp(input.mobile, input.otp);
    if (!verification.success) {
      return {
        success: false,
        code: verification.code || ErrorCode.AUTH_INVALID_OTP,
        error: verification.error || 'Invalid OTP',
      };
    }

    // Find or Create User
    let user = usersData.find((u) => u.phone === input.mobile);
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      const newUserId = `usr_${Date.now()}`;
      const referralCode = `ST${input.mobile.substring(input.mobile.length - 4)}`;
      user = {
        id: newUserId,
        name: null as any,
        email: null as any,
        phone: input.mobile,
        societyId: 'soc_1',
        societyName: 'ABC Residency',
        referralCode,
        walletBalance: 0,
        rewardsBalance: 0,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'ACTIVE',
      };
      usersData.unshift(user);
    }

    // Step 07.19 Blocked User Check
    if (user.status === 'BLOCKED' || user.status === 'SUSPENDED') {
      return {
        success: false,
        code: ErrorCode.USER_BLOCKED,
        error: 'Your account is currently unavailable',
      };
    }

    // Create Session & Issue Tokens
    const session = SessionService.createSession(user.id, input.deviceId, input.platform);

    return {
      success: true,
      isNewUser,
      user: {
        id: user.id,
        name: user.name,
        mobile: user.phone,
        email: user.email,
        societyId: user.societyId,
        societyName: user.societyName,
        referralCode: user.referralCode,
      },
      tokens: {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        expiresIn: session.expiresIn,
      },
    };
  }

  /**
   * Rotates refresh token (Step 07.26)
   */
  public static async refreshToken(refreshToken: string) {
    const result = SessionService.rotateRefreshToken(refreshToken);
    if (!result.success) {
      return {
        success: false,
        code: result.code || ErrorCode.AUTH_UNAUTHORIZED,
        error: result.error || 'Token refresh failed',
      };
    }

    return {
      success: true,
      tokens: result.tokens,
    };
  }

  /**
   * Revokes current session
   */
  public static async logout(sessionId: string) {
    SessionService.logout(sessionId);
    return { success: true };
  }

  /**
   * Revokes all active user sessions (Step 07.29)
   */
  public static async logoutAll(userId: string) {
    SessionService.logoutAll(userId);
    return { success: true };
  }

  /**
   * Retrieves profile for authenticated user (`GET /api/v1/auth/me`)
   */
  public static async getProfile(userId: string) {
    const user = usersData.find((u) => u.id === userId) || usersData[0];
    return {
      id: user.id,
      name: user.name,
      mobile: user.phone,
      email: user.email,
      societyId: user.societyId,
      societyName: user.societyName,
      referralCode: user.referralCode,
      rewardsBalance: user.rewardsBalance || 0,
      status: user.status || 'ACTIVE',
    };
  }
}
