export interface RevokeSessionDto {
  sessionId?: string;
  revokeAll?: boolean;
}

export function validateRevokeSessionDto(body: any): RevokeSessionDto {
  return {
    sessionId: body?.sessionId ? String(body.sessionId).trim() : undefined,
    revokeAll: Boolean(body?.revokeAll),
  };
}
