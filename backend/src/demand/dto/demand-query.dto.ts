export interface DemandQueryDto {
  societyId: string;
  serviceId: string;
}

export function validateDemandQueryDto(query: any): { isValid: boolean; data?: DemandQueryDto; error?: string } {
  if (!query || typeof query !== 'object') {
    return { isValid: false, error: 'Invalid query parameters' };
  }

  if (!query.societyId || typeof query.societyId !== 'string') {
    return { isValid: false, error: 'societyId is required' };
  }

  if (!query.serviceId || typeof query.serviceId !== 'string') {
    return { isValid: false, error: 'serviceId is required' };
  }

  return {
    isValid: true,
    data: {
      societyId: query.societyId.trim(),
      serviceId: query.serviceId.trim(),
    },
  };
}
