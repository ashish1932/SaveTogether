import { AuditRepository, LocalAuditRecord } from './audit.repository';
import { AuditQueryDto, AuditActorType, AuditAction } from './dto/audit-query.dto';
import { AuditLogResponseDto } from './responses/audit-response.dto';
import { ErrorCode } from '../common/types/error-codes.enum';

export class AuditService {
  /**
   * Queries audit logs with filtering and pagination (Step 36.27 & 36.28)
   */
  public static async listAuditLogs(query: AuditQueryDto): Promise<{ items: AuditLogResponseDto[]; total: number; page: number; limit: number }> {
    let list = await AuditRepository.findAll();

    if (query.actorId) {
      list = list.filter((a) => a.actorId === query.actorId);
    }
    if (query.actorType) {
      list = list.filter((a) => a.actorType === query.actorType);
    }
    if (query.action) {
      list = list.filter((a) => a.action === query.action);
    }
    if (query.resourceType) {
      list = list.filter((a) => a.resourceType.toUpperCase() === query.resourceType);
    }
    if (query.resourceId) {
      list = list.filter((a) => a.resourceId === query.resourceId);
    }

    const page = query.page || 1;
    const limit = query.limit || 20;
    const total = list.length;
    const startIndex = (page - 1) * limit;
    const items = list.slice(startIndex, startIndex + limit).map(this.toDto);

    return { items, total, page, limit };
  }

  /**
   * Returns detailed audit entry by ID (Step 36.29)
   */
  public static async getAuditById(id: string): Promise<AuditLogResponseDto> {
    const log = await AuditRepository.findById(id);
    if (!log) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'Audit log entry not found',
      };
    }
    return this.toDto(log);
  }

  /**
   * Helper to log audit actions cleanly (Step 36.9)
   */
  public static async createAuditEntry(data: {
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
  }): Promise<AuditLogResponseDto> {
    const record = await AuditRepository.logAction(data);
    return this.toDto(record);
  }

  private static toDto(a: LocalAuditRecord): AuditLogResponseDto {
    return {
      id: a.id,
      actorType: a.actorType,
      actorId: a.actorId,
      actorName: a.actorName,
      action: a.action,
      resourceType: a.resourceType,
      resourceId: a.resourceId,
      before: a.before,
      after: a.after,
      metadata: a.metadata,
      ipAddress: a.ipAddress,
      userAgent: a.userAgent,
      requestId: a.requestId,
      createdAt: a.createdAt,
    };
  }
}
