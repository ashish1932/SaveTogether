export interface AuditLogRecord {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetEntity: string;
  targetId: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
}

const mockAuditLogsStore: AuditLogRecord[] = [
  {
    id: 'aud_1001',
    adminId: 'ADM1001',
    adminName: 'Ashish Admin',
    action: 'BOOKING_COMPLETED',
    targetEntity: 'Booking',
    targetId: 'BK10244',
    metadata: { reason: 'Service verified completed' },
    createdAt: '2026-08-28T04:37:18Z',
  },
];

export class AuditRepository {
  public static async logAction(data: {
    adminId: string;
    adminName: string;
    action: string;
    targetEntity: string;
    targetId: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
  }): Promise<AuditLogRecord> {
    const id = `aud_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const log: AuditLogRecord = {
      id,
      adminId: data.adminId,
      adminName: data.adminName,
      action: data.action,
      targetEntity: data.targetEntity,
      targetId: data.targetId,
      metadata: data.metadata,
      ipAddress: data.ipAddress,
      createdAt: new Date().toISOString(),
    };

    mockAuditLogsStore.push(log);
    return log;
  }

  public static async findAll(): Promise<AuditLogRecord[]> {
    return mockAuditLogsStore;
  }

  public static async findByEntity(targetEntity: string, targetId?: string): Promise<AuditLogRecord[]> {
    return mockAuditLogsStore.filter((a) => a.targetEntity === targetEntity && (!targetId || a.targetId === targetId));
  }
}
