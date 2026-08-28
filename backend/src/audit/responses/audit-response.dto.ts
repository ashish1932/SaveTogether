import { AuditActorType, AuditAction } from '../dto/audit-query.dto';

export interface AuditLogResponseDto {
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
