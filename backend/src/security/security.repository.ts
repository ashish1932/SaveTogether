import crypto from 'crypto';

export interface LocalUserSessionRecord {
  id: string;
  userId: string;
  refreshTokenHash: string;
  deviceId: string | null;
  deviceName: string | null;
  platform: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  lastUsedAt: string;
  expiresAt: string;
  revokedAt: string | null;
  createdAt: string;
}

const mockSessionsStore: LocalUserSessionRecord[] = [];

export class SecurityRepository {
  public static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  public static async createSession(data: {
    userId: string;
    refreshToken: string;
    deviceId?: string;
    deviceName?: string;
    platform?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<LocalUserSessionRecord> {
    const id = `ses_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    const record: LocalUserSessionRecord = {
      id,
      userId: data.userId,
      refreshTokenHash: this.hashToken(data.refreshToken),
      deviceId: data.deviceId || null,
      deviceName: data.deviceName || 'Mobile Device',
      platform: data.platform || 'ANDROID',
      ipAddress: data.ipAddress || '127.0.0.1',
      userAgent: data.userAgent || 'SaveTogether App',
      lastUsedAt: now.toISOString(),
      expiresAt,
      revokedAt: null,
      createdAt: now.toISOString(),
    };

    mockSessionsStore.push(record);
    return record;
  }

  public static async findByUserId(userId: string): Promise<LocalUserSessionRecord[]> {
    return mockSessionsStore.filter((s) => s.userId === userId && !s.revokedAt);
  }

  public static async findById(id: string): Promise<LocalUserSessionRecord | undefined> {
    return mockSessionsStore.find((s) => s.id === id);
  }

  public static async revokeSession(id: string): Promise<boolean> {
    const session = await this.findById(id);
    if (session) {
      session.revokedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  public static async revokeAllUserSessions(userId: string): Promise<number> {
    let count = 0;
    const now = new Date().toISOString();
    for (const s of mockSessionsStore) {
      if (s.userId === userId && !s.revokedAt) {
        s.revokedAt = now;
        count++;
      }
    }
    return count;
  }
}
