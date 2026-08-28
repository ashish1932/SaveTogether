export interface AddNegotiationOfferDto {
  offerType: 'OFFER' | 'COUNTER_OFFER' | 'FINAL';
  unitRate: number;
  notes?: string;
}

export function validateAddNegotiationOfferDto(body: any): { isValid: boolean; data?: AddNegotiationOfferDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  const rate = Number(body.unitRate);
  if (isNaN(rate) || rate <= 0) {
    return { isValid: false, error: 'unitRate must be a positive number' };
  }

  const validTypes = ['OFFER', 'COUNTER_OFFER', 'FINAL'];
  const offerType = body.offerType ? String(body.offerType).toUpperCase() as any : 'OFFER';
  if (!validTypes.includes(offerType)) {
    return { isValid: false, error: 'offerType must be one of: OFFER, COUNTER_OFFER, FINAL' };
  }

  return {
    isValid: true,
    data: {
      offerType,
      unitRate: rate,
      notes: body.notes ? String(body.notes).trim() : undefined,
    },
  };
}
