export interface Verify2FaDto {
  challengeId: string;
  code: string;
}

export function validateVerify2FaDto(body: any): { isValid: boolean; data?: Verify2FaDto; error?: string } {
  if (!body || !body.challengeId || typeof body.challengeId !== 'string') {
    return { isValid: false, error: 'challengeId is required' };
  }
  if (!body.code || typeof body.code !== 'string' || !/^\d{6}$/.test(body.code.trim())) {
    return { isValid: false, error: '2FA authentication code must be a 6-digit number' };
  }

  return {
    isValid: true,
    data: {
      challengeId: body.challengeId.trim(),
      code: body.code.trim(),
    },
  };
}
