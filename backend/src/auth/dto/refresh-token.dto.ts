export interface RefreshTokenDto {
  refreshToken: string;
}

export function validateRefreshTokenDto(body: any): { isValid: boolean; refreshToken?: string; error?: string } {
  if (!body || !body.refreshToken || typeof body.refreshToken !== 'string') {
    return { isValid: false, error: 'refreshToken is required' };
  }
  return { isValid: true, refreshToken: body.refreshToken.trim() };
}
