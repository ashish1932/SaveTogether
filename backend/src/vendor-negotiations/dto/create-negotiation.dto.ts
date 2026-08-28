export interface CreateNegotiationSessionDto {
  vendorId: string;
  unitRate: number;
  notes?: string;
}

export function validateCreateNegotiationSessionDto(body: any): { isValid: boolean; data?: CreateNegotiationSessionDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  if (!body.vendorId || typeof body.vendorId !== 'string') {
    return { isValid: false, error: 'vendorId is required' };
  }

  const rate = Number(body.unitRate);
  if (isNaN(rate) || rate <= 0) {
    return { isValid: false, error: 'unitRate must be a positive number' };
  }

  return {
    isValid: true,
    data: {
      vendorId: body.vendorId.trim(),
      unitRate: rate,
      notes: body.notes ? String(body.notes).trim() : undefined,
    },
  };
}
