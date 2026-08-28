export interface VerifyOtpDto {
  mobile: string;
  otp: string;
  deviceId?: string;
  platform?: string;
}

export function validateVerifyOtpDto(body: any): { isValid: boolean; data?: VerifyOtpDto; error?: string } {
  if (!body || !body.mobile || typeof body.mobile !== 'string') {
    return { isValid: false, error: 'Mobile number is required' };
  }
  if (!body.otp || typeof body.otp !== 'string' || !/^\d{6}$/.test(body.otp.trim())) {
    return { isValid: false, error: 'OTP must be a 6-digit number' };
  }

  let normalized = body.mobile.trim();
  if (!normalized.startsWith('+')) {
    if (normalized.length === 10) {
      normalized = `+91${normalized}`;
    }
  }

  return {
    isValid: true,
    data: {
      mobile: normalized,
      otp: body.otp.trim(),
      deviceId: body.deviceId ? String(body.deviceId) : undefined,
      platform: body.platform ? String(body.platform).toUpperCase() : 'ANDROID',
    },
  };
}
