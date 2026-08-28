import { AuditActorType, AuditAction } from './dto/audit-query.dto';

export interface LocalAuditRecord {
  id: string;
  actorType: AuditActorType;
  actorId: string | null;
  actorName: string;
  action: AuditAction | string;
  resourceType: string;
  resourceId: string | null;
  before: Record<string, any> | null;
  after: Record<string, any> | null;
  metadata: Record<string, any> | null;
  ipAddress: string | null;
  userAgent: string | null;
  requestId: string | null;
  createdAt: string;
}

const mockAuditLogsStore: LocalAuditRecord[] = [
  {
    id: 'aud_1001',
    actorType: 'ADMIN',
    actorId: 'ADM1001',
    actorName: 'Ashish Admin',
    action: 'SETTINGS_CHANGE',
    resourceType: 'PlatformSetting',
    resourceId: 'set_1006',
    before: { referrerRewardAmount: 50 },
    after: { referrerRewardAmount: 75 },
    metadata: { reason: 'Festive Referral Bonus Promotion' },
    ipAddress: '127.0.0.1',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
    requestId: 'REQ-XG9X9TEI',
    createdAt: '2026-08-28T04:46:28.166Z',
  },
];

export class AuditRepository {
  /**
   * Sanitizes sensitive fields before persisting to append-only audit log (Step 36.16)
   */
  private static sanitize(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;
    const sensitiveKeys = ['password', 'passwordHash', 'token', 'accessToken', 'refreshToken', 'otp', 'secret', 'apiKey'];

    const sanitized: Record<string, any> = Array.isArray(obj) ? [] : {};
    for (const [key, val] of Object.entries(obj)) {
      if (sensitiveKeys.some((s) => key.toLowerCase().includes(s.toLowerCase()))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof val === 'object' && val !== null) {
        sanitized[key] = this.sanitize(val);
      } else {
        sanitized[key] = val;
      }
    }
    return sanitized;
  }

  /**
   * Appends an immutable audit log entry (Step 36.26)
   */
  public static async logAction(data: {
    actorType?: AuditActorType;
    actorId?: string | null;
    actorName?: string;
    action: AuditAction | string;
    resourceType: string;
    resourceId?: string | null;
    before?: Record<string, any> | null;
    after?: Record<string, any> | null;
    metadata?: Record<string, any> | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    requestId?: string | null;
  }): Promise<LocalAuditRecord> {
    const id = `aud_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const record: LocalAuditRecord = {
      id,
      actorType: data.actorType || 'ADMIN',
      actorId: data.actorId || null,
      actorName: data.actorName || 'System',
      action: data.action,
      resourceType: data.resourceType,
      resourceId: data.resourceId || null,
      before: data.before ? this.sanitize(data.before) : null,
      after: data.after ? this.sanitize(data.after) : null,
      metadata: data.metadata ? this.sanitize(data.metadata) : null,
      ipAddress: data.ipAddress || '127.0.0.1',
      userAgent: data.userAgent || 'SaveTogether API Client',
      requestId: data.requestId || `REQ-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      createdAt: new Date().toISOString(),
    };

    mockAuditLogsStore.push(record);
    return record;
  }

  public static async findById(id: string): Promise<LocalAuditRecord | undefined> {
    return mockAuditLogsStore.find((a) => a.id === id);
  }

  public static async findAll(): Promise<LocalAuditRecord[]> {
    return mockAuditLogsStore;
  }
}
