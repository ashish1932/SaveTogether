export interface RegisterDeviceDto {
  deviceId: string;
  fcmToken: string;
  platform?: string;
  appVersion?: string;
}

export function validateRegisterDeviceDto(body: any): { isValid: boolean; data?: RegisterDeviceDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  if (!body.deviceId || typeof body.deviceId !== 'string') {
    return { isValid: false, error: 'deviceId is required' };
  }

  if (!body.fcmToken || typeof body.fcmToken !== 'string') {
    return { isValid: false, error: 'fcmToken is required' };
  }

  return {
    isValid: true,
    data: {
      deviceId: body.deviceId.trim(),
      fcmToken: body.fcmToken.trim(),
      platform: body.platform ? String(body.platform).toUpperCase() : 'ANDROID',
      appVersion: body.appVersion ? String(body.appVersion).trim() : '1.0.0',
    },
  };
}
