export interface SessionResponseDto {
  id: string;
  userId: string;
  deviceId: string | null;
  deviceName: string | null;
  platform: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  lastUsedAt: string;
  expiresAt: string;
  isCurrent: boolean;
}

export interface SecurityStatusResponseDto {
  activeSessionsCount: number;
  rateLimitStatus: string;
  httpsEnforced: boolean;
  corsRestricted: boolean;
  rbacEnforced: boolean;
}
