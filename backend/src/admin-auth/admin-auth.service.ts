import { TwoFactorService } from './services/two-factor.service';
import { AdminSessionService } from './services/admin-session.service';
import { ErrorCode } from '../common/types/error-codes.enum';

export interface AuditEntry {
  action: string;
  module: string;
  entityType: string;
  entityId: string;
  timestamp: string;
}

const adminAuditLogs: AuditEntry[] = [];

export class AdminAuthService {
  /**
   * Validates Email/Password and returns a 2FA Challenge (Step 08.5)
   */
  public static async login(email: string, password: string, ipAddress?: string, userAgent?: string) {
    const adminEmail = email.toLowerCase();
    if (adminEmail !== 'admin@savetogether.in' && adminEmail !== 'ashish.admin@savetogether.in') {
      adminAuditLogs.push({
        action: 'ADMIN_LOGIN_FAILED',
        module: 'AUTH',
        entityType: 'AdminUser',
        entityId: email,
        timestamp: new Date().toISOString(),
      });
      return {
        success: false,
        code: ErrorCode.AUTH_UNAUTHORIZED,
        error: 'Invalid admin credentials',
      };
    }

    // Verify Password Hash (In dev/demo mode, accept standard password or default)
    if (password !== 'Admin@123456' && password !== 'admin123' && password !== 'AshishAdmin2026!') {
      adminAuditLogs.push({
        action: 'ADMIN_LOGIN_FAILED',
        module: 'AUTH',
        entityType: 'AdminUser',
        entityId: email,
        timestamp: new Date().toISOString(),
      });
      return {
        success: false,
        code: ErrorCode.AUTH_UNAUTHORIZED,
        error: 'Invalid admin credentials',
      };
    }

    const adminUserId = 'ADM1001';

    // Step 08.5: Do NOT issue full access token yet. Create 2FA Challenge instead!
    const challenge = TwoFactorService.createChallenge(adminUserId);

    adminAuditLogs.push({
      action: 'ADMIN_LOGIN_SUCCESS',
      module: 'AUTH',
      entityType: 'AdminUser',
      entityId: adminUserId,
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      requires2FA: true,
      data: {
        challengeId: challenge.challengeId,
        expiresIn: challenge.expiresIn,
        ...(challenge.debugCode ? { debugCode: challenge.debugCode } : {}),
      },
    };
  }

  /**
   * Verifies 2FA TOTP code & issues Admin Tokens (Step 08.14)
   */
  public static async verify2FA(challengeId: string, code: string, ipAddress?: string, userAgent?: string) {
    const result = TwoFactorService.verifyChallenge(challengeId, code);
    if (!result.success || !result.adminUserId) {
      return {
        success: false,
        code: result.code || ErrorCode.AUTH_INVALID_OTP,
        error: result.error || 'Invalid 2FA authentication code',
      };
    }

    const adminUserId = result.adminUserId;

    // Create Admin Session & Generate Token Pair
    const session = AdminSessionService.createSession(adminUserId, ipAddress, userAgent);

    adminAuditLogs.push({
      action: 'ADMIN_2FA_SUCCESS',
      module: 'AUTH',
      entityType: 'AdminUser',
      entityId: adminUserId,
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      admin: {
        id: adminUserId,
        name: 'Ashish Admin',
        email: 'ashish.admin@savetogether.in',
        roleType: 'SUPER_ADMIN',
      },
      tokens: {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        expiresIn: session.expiresIn,
      },
    };
  }

  /**
   * Rotates Admin Refresh Token (Step 08.18)
   */
  public static async refreshToken(refreshToken: string) {
    const result = AdminSessionService.rotateAdminRefreshToken(refreshToken);
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
   * Revokes current Admin Session
   */
  public static async logout(sessionId: string) {
    AdminSessionService.logout(sessionId);
    return { success: true };
  }

  /**
   * Revokes all active Admin Sessions (Step 08.21)
   */
  public static async logoutAll(adminUserId: string) {
    AdminSessionService.logoutAll(adminUserId);
    return { success: true };
  }

  /**
   * Retrieves profile for authenticated admin (`GET /api/v1/admin/auth/me`)
   */
  public static async getProfile(adminUserId: string) {
    return {
      id: adminUserId,
      name: 'Ashish Admin',
      email: 'ashish.admin@savetogether.in',
      roleType: 'SUPER_ADMIN',
      status: 'ACTIVE',
      twoFactorEnabled: true,
    };
  }
}
