export interface CreateNegotiationDto {
  vendorId: string;
  negotiatedRate: number;
  notes?: string;
}

export function validateCreateNegotiationDto(body: any): { isValid: boolean; data?: CreateNegotiationDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  if (!body.vendorId || typeof body.vendorId !== 'string') {
    return { isValid: false, error: 'vendorId is required' };
  }

  const rate = Number(body.negotiatedRate);
  if (isNaN(rate) || rate <= 0) {
    return { isValid: false, error: 'negotiatedRate must be a positive number' };
  }

  return {
    isValid: true,
    data: {
      vendorId: body.vendorId.trim(),
      negotiatedRate: rate,
      notes: body.notes ? String(body.notes).trim() : undefined,
    },
  };
}
