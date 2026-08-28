import * as crypto from 'crypto';
import { ErrorCode } from '../../common/types/error-codes.enum';

export interface UserSessionRecord {
  id: string;
  userId: string;
  deviceId?: string;
  refreshTokenHash: string;
  platform?: string;
  expiresAt: number;
  lastUsedAt: number;
  revokedAt?: number;
  createdAt: number;
}

const sessionStore: Map<string, UserSessionRecord> = new Map();

export class SessionService {
  private static JWT_SECRET = process.env.JWT_SECRET || 'savetogether_jwt_super_secret_key_2026';
  private static JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'savetogether_jwt_refresh_secret_key_2026';
  private static ACCESS_TOKEN_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes
  private static REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

  /**
   * Hashes a raw token string using SHA-256 for secure session tracking
   */
  public static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Generates a signed pseudo-JWT token for local verification
   */
  public static generateSignedJwt(payload: Record<string, any>, isRefresh = false): string {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const secret = isRefresh ? this.JWT_REFRESH_SECRET : this.JWT_SECRET;
    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${header}.${body}`)
      .digest('base64url');

    return `${header}.${body}.${signature}`;
  }

  /**
   * Decodes & verifies a signed JWT token
   */
  public static verifySignedJwt(token: string, isRefresh = false): { isValid: boolean; payload?: any; error?: string } {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return { isValid: false, error: 'Malformed token structure' };

      const [header, body, signature] = parts;
      const secret = isRefresh ? this.JWT_REFRESH_SECRET : this.JWT_SECRET;
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${header}.${body}`)
        .digest('base64url');

      if (signature !== expectedSignature) {
        return { isValid: false, error: 'Invalid token signature' };
      }

      const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
      if (payload.exp && Date.now() > payload.exp) {
        return { isValid: false, error: 'Token expired' };
      }

      return { isValid: true, payload };
    } catch (err: any) {
      return { isValid: false, error: 'Token decoding failed' };
    }
  }

  /**
   * Creates a new user session & token pair
   */
  public static createSession(userId: string, deviceId?: string, platform?: string) {
    const now = Date.now();
    const sessionId = `ses_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const refreshPayload = {
      sub: userId,
      sessionId,
      type: 'refresh',
      exp: now + this.REFRESH_TOKEN_EXPIRY_MS,
    };
    const refreshToken = this.generateSignedJwt(refreshPayload, true);
    const refreshTokenHash = this.hashToken(refreshToken);

    const accessPayload = {
      sub: userId,
      sessionId,
      type: 'access',
      exp: now + this.ACCESS_TOKEN_EXPIRY_MS,
    };
    const accessToken = this.generateSignedJwt(accessPayload, false);

    const session: UserSessionRecord = {
      id: sessionId,
      userId,
      deviceId,
      refreshTokenHash,
      platform: platform || 'ANDROID',
      expiresAt: now + this.REFRESH_TOKEN_EXPIRY_MS,
      lastUsedAt: now,
      createdAt: now,
    };

    sessionStore.set(sessionId, session);

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 mins in seconds
      sessionId,
    };
  }

  /**
   * Rotates a refresh token (Step 07.23 Token Rotation + Replay Detection)
   */
  public static rotateRefreshToken(refreshToken: string) {
    const verification = this.verifySignedJwt(refreshToken, true);
    if (!verification.isValid || !verification.payload) {
      return { success: false, code: ErrorCode.AUTH_TOKEN_EXPIRED, error: verification.error || 'Invalid refresh token' };
    }

    const { sub: userId, sessionId } = verification.payload;
    const session = sessionStore.get(sessionId);

    if (!session) {
      return { success: false, code: ErrorCode.AUTH_UNAUTHORIZED, error: 'Session not found or expired' };
    }

    // Step 07.25 Replay / Reuse Detection: If revoked session tries to refresh, trigger security lockout!
    if (session.revokedAt) {
      console.warn(`🚨 SECURITY ALERT: Attempted reuse of revoked refresh token for User ${userId}! Revoking all user sessions.`);
      this.logoutAll(userId);
      return { success: false, code: ErrorCode.AUTH_UNAUTHORIZED, error: 'Security breach detected. All user sessions invalidated.' };
    }

    const tokenHash = this.hashToken(refreshToken);
    if (session.refreshTokenHash !== tokenHash) {
      this.logoutAll(userId);
      return { success: false, code: ErrorCode.AUTH_UNAUTHORIZED, error: 'Invalid refresh token signature match.' };
    }

    // Revoke old session
    session.revokedAt = Date.now();

    // Create new rotated session
    const newSession = this.createSession(userId, session.deviceId, session.platform);
    return {
      success: true,
      tokens: newSession,
    };
  }

  /**
   * Revokes a specific session
   */
  public static logout(sessionId: string) {
    const session = sessionStore.get(sessionId);
    if (session) {
      session.revokedAt = Date.now();
    }
  }

  /**
   * Revokes all active sessions for a user (Step 07.29 logout-all)
   */
  public static logoutAll(userId: string) {
    const now = Date.now();
    for (const [id, session] of sessionStore.entries()) {
      if (session.userId === userId) {
        session.revokedAt = now;
      }
    }
  }

  /**
   * Retrieves active session details
   */
  public static getSession(sessionId: string): UserSessionRecord | undefined {
    const session = sessionStore.get(sessionId);
    if (session && !session.revokedAt && Date.now() < session.expiresAt) {
      return session;
    }
    return undefined;
  }
}
