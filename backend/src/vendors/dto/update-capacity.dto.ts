export interface UpdateCapacityDto {
  serviceId: string;
  maxQuantityPerDay: number;
}

export function validateUpdateCapacityDto(body: any): { isValid: boolean; data?: UpdateCapacityDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  if (!body.serviceId || typeof body.serviceId !== 'string') {
    return { isValid: false, error: 'serviceId is required' };
  }

  const cap = Number(body.maxQuantityPerDay);
  if (isNaN(cap) || !Number.isInteger(cap) || cap < 0) {
    return { isValid: false, error: 'maxQuantityPerDay must be a positive integer' };
  }

  return {
    isValid: true,
    data: {
      serviceId: body.serviceId.trim(),
      maxQuantityPerDay: cap,
    },
  };
}
