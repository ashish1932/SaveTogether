export interface ValidateReferralDto {
  code: string;
}

export function validateValidateReferralDto(body: any): { isValid: boolean; data?: ValidateReferralDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  if (!body.code || typeof body.code !== 'string') {
    return { isValid: false, error: 'code is required' };
  }

  return {
    isValid: true,
    data: {
      code: body.code.trim().toUpperCase(),
    },
  };
}
