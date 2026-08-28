export type AuditActorType = 'ADMIN' | 'USER' | 'SYSTEM';
export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'BLOCK'
  | 'UNBLOCK'
  | 'APPROVE'
  | 'REJECT'
  | 'ASSIGN'
  | 'UNASSIGN'
  | 'REFUND'
  | 'ADJUST'
  | 'PUBLISH'
  | 'DISABLE'
  | 'PERMISSION_CHANGE'
  | 'ROLE_CHANGE'
  | 'SETTINGS_CHANGE'
  | 'EXPORT';

export interface AuditQueryDto {
  actorId?: string;
  actorType?: AuditActorType;
  action?: AuditAction;
  resourceType?: string;
  resourceId?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export function validateAuditQueryDto(query: any): AuditQueryDto {
  const page = Math.max(1, parseInt(String(query?.page || '1'), 10));
  const limit = Math.min(100, Math.max(1, parseInt(String(query?.limit || '20'), 10)));

  return {
    actorId: query?.actorId ? String(query.actorId).trim() : undefined,
    actorType: query?.actorType ? String(query.actorType).toUpperCase() as any : undefined,
    action: query?.action ? String(query.action).toUpperCase() as any : undefined,
    resourceType: query?.resourceType ? String(query.resourceType).trim().toUpperCase() : undefined,
    resourceId: query?.resourceId ? String(query.resourceId).trim() : undefined,
    from: query?.from ? String(query.from).trim() : undefined,
    to: query?.to ? String(query.to).trim() : undefined,
    page,
    limit,
  };
}
