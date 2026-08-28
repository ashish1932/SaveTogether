export interface PricingQuoteDto {
  serviceId: string;
  societyId: string;
  quantity: number;
}

export function validatePricingQuoteDto(query: any): { isValid: boolean; data?: PricingQuoteDto; error?: string } {
  if (!query || typeof query !== 'object') {
    return { isValid: false, error: 'Invalid query parameters' };
  }

  if (!query.serviceId || typeof query.serviceId !== 'string') {
    return { isValid: false, error: 'serviceId is required' };
  }

  if (!query.societyId || typeof query.societyId !== 'string') {
    return { isValid: false, error: 'societyId is required' };
  }

  const qty = Number(query.quantity || 1);
  if (isNaN(qty) || !Number.isInteger(qty) || qty <= 0) {
    return { isValid: false, error: 'Quantity must be a positive integer' };
  }

  return {
    isValid: true,
    data: {
      serviceId: query.serviceId.trim(),
      societyId: query.societyId.trim(),
      quantity: qty,
    },
  };
}
