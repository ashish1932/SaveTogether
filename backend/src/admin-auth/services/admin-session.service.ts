import * as crypto from 'crypto';
import { ErrorCode } from '../../common/types/error-codes.enum';

export interface AdminSessionRecord {
  id: string;
  adminUserId: string;
  refreshTokenHash: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: number;
  lastUsedAt: number;
  revokedAt?: number;
  createdAt: number;
}

const adminSessionStore: Map<string, AdminSessionRecord> = new Map();

export class AdminSessionService {
  private static ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'savetogether_admin_jwt_super_secret_key_2026';
  private static ADMIN_JWT_REFRESH_SECRET = process.env.ADMIN_JWT_REFRESH_SECRET || 'savetogether_admin_refresh_secret_key_2026';
  private static ACCESS_TOKEN_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes
  private static REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

  /**
   * Hashes token via SHA-256
   */
  public static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Generates signed Admin JWT token
   */
  public static generateAdminSignedJwt(payload: Record<string, any>, isRefresh = false): string {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const secret = isRefresh ? this.ADMIN_JWT_REFRESH_SECRET : this.ADMIN_JWT_SECRET;
    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${header}.${body}`)
      .digest('base64url');

    return `${header}.${body}.${signature}`;
  }

  /**
   * Decodes & verifies Admin JWT token
   */
  public static verifyAdminSignedJwt(token: string, isRefresh = false): { isValid: boolean; payload?: any; error?: string } {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return { isValid: false, error: 'Malformed admin token' };

      const [header, body, signature] = parts;
      const secret = isRefresh ? this.ADMIN_JWT_REFRESH_SECRET : this.ADMIN_JWT_SECRET;
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${header}.${body}`)
        .digest('base64url');

      if (signature !== expectedSignature) {
        return { isValid: false, error: 'Invalid admin token signature' };
      }

      const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
      if (payload.exp && Date.now() > payload.exp) {
        return { isValid: false, error: 'Admin token expired' };
      }

      return { isValid: true, payload };
    } catch (err: any) {
      return { isValid: false, error: 'Admin token verification failed' };
    }
  }

  /**
   * Creates a new Admin Session & Token pair
   */
  public static createSession(adminUserId: string, ipAddress?: string, userAgent?: string) {
    const now = Date.now();
    const sessionId = `adm_ses_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const refreshPayload = {
      sub: adminUserId,
      sessionId,
      type: 'admin-refresh',
      exp: now + this.REFRESH_TOKEN_EXPIRY_MS,
    };
    const refreshToken = this.generateAdminSignedJwt(refreshPayload, true);
    const refreshTokenHash = this.hashToken(refreshToken);

    const accessPayload = {
      sub: adminUserId,
      sessionId,
      type: 'admin-access',
      exp: now + this.ACCESS_TOKEN_EXPIRY_MS,
    };
    const accessToken = this.generateAdminSignedJwt(accessPayload, false);

    const session: AdminSessionRecord = {
      id: sessionId,
      adminUserId,
      refreshTokenHash,
      ipAddress,
      userAgent,
      expiresAt: now + this.REFRESH_TOKEN_EXPIRY_MS,
      lastUsedAt: now,
      createdAt: now,
    };

    adminSessionStore.set(sessionId, session);

    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
      sessionId,
    };
  }

  /**
   * Rotates Admin Refresh Token & detects token reuse (Step 08.19 & 08.36)
   */
  public static rotateAdminRefreshToken(refreshToken: string) {
    const verification = this.verifyAdminSignedJwt(refreshToken, true);
    if (!verification.isValid || !verification.payload) {
      return { success: false, code: ErrorCode.AUTH_TOKEN_EXPIRED, error: verification.error || 'Invalid refresh token' };
    }

    const { sub: adminUserId, sessionId } = verification.payload;
    const session = adminSessionStore.get(sessionId);

    if (!session) {
      return { success: false, code: ErrorCode.AUTH_UNAUTHORIZED, error: 'Admin session not found or expired' };
    }

    // Step 08.19 & 08.36 Replay Detection: If revoked admin refresh token is reused, revoke ALL sessions for that admin!
    if (session.revokedAt) {
      console.warn(`🚨 ADMIN SECURITY ALERT: Attempted reuse of revoked refresh token for Admin ${adminUserId}! Revoking all admin sessions.`);
      this.logoutAll(adminUserId);
      return { success: false, code: ErrorCode.AUTH_UNAUTHORIZED, error: 'Security breach detected. All admin sessions invalidated.' };
    }

    const tokenHash = this.hashToken(refreshToken);
    if (session.refreshTokenHash !== tokenHash) {
      this.logoutAll(adminUserId);
      return { success: false, code: ErrorCode.AUTH_UNAUTHORIZED, error: 'Invalid refresh token signature match.' };
    }

    // Revoke old session
    session.revokedAt = Date.now();

    // Issue new rotated admin session & tokens
    const newSession = this.createSession(adminUserId, session.ipAddress, session.userAgent);
    return {
      success: true,
      tokens: newSession,
    };
  }

  /**
   * Revokes single session
   */
  public static logout(sessionId: string) {
    const session = adminSessionStore.get(sessionId);
    if (session) {
      session.revokedAt = Date.now();
    }
  }

  /**
   * Revokes all active sessions for an admin user
   */
  public static logoutAll(adminUserId: string) {
    const now = Date.now();
    for (const [id, session] of adminSessionStore.entries()) {
      if (session.adminUserId === adminUserId) {
        session.revokedAt = now;
      }
    }
  }

  /**
   * Retrieves active admin session
   */
  public static getSession(sessionId: string): AdminSessionRecord | undefined {
    const session = adminSessionStore.get(sessionId);
    if (session && !session.revokedAt && Date.now() < session.expiresAt) {
      return session;
    }
    return undefined;
  }
}
