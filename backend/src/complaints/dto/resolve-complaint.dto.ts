export interface ResolveComplaintDto {
  resolution: string;
}

export function validateResolveComplaintDto(body: any): { isValid: boolean; data?: ResolveComplaintDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  if (!body.resolution || typeof body.resolution !== 'string') {
    return { isValid: false, error: 'resolution description is required' };
  }

  return {
    isValid: true,
    data: {
      resolution: body.resolution.trim(),
    },
  };
}
