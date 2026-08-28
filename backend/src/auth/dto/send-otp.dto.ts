export interface SendOtpDto {
  mobile: string;
}

export function validateSendOtpDto(body: any): { isValid: boolean; mobile?: string; error?: string } {
  if (!body || !body.mobile || typeof body.mobile !== 'string') {
    return { isValid: false, error: 'Mobile number is required' };
  }

  const cleaned = body.mobile.trim();
  // Normalize Indian mobile numbers (+91...)
  let normalized = cleaned;
  if (!normalized.startsWith('+')) {
    if (normalized.length === 10) {
      normalized = `+91${normalized}`;
    } else if (normalized.length === 12 && normalized.startsWith('91')) {
      normalized = `+${normalized}`;
    }
  }

  if (!/^\+\d{11,13}$/.test(normalized)) {
    return { isValid: false, error: 'Invalid mobile number format. Expected 10-digit number or +91 format' };
  }

  return { isValid: true, mobile: normalized };
}
