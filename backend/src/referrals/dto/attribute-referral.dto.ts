export interface AttributeReferralDto {
  referralCode: string;
}

export function validateAttributeReferralDto(body: any): { isValid: boolean; data?: AttributeReferralDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  if (!body.referralCode || typeof body.referralCode !== 'string') {
    return { isValid: false, error: 'referralCode is required' };
  }

  return {
    isValid: true,
    data: {
      referralCode: body.referralCode.trim().toUpperCase(),
    },
  };
}
