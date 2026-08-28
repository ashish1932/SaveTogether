export interface VendorPricingDto {
  serviceId: string;
  price: number;
  minQuantity?: number;
  maxQuantity?: number | null;
  reason?: string;
}

export function validateVendorPricingDto(body: any): { isValid: boolean; data?: VendorPricingDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  if (!body.serviceId || typeof body.serviceId !== 'string') {
    return { isValid: false, error: 'serviceId is required' };
  }

  const price = Number(body.price);
  if (isNaN(price) || price < 0) {
    return { isValid: false, error: 'price must be a positive number' };
  }

  return {
    isValid: true,
    data: {
      serviceId: body.serviceId.trim(),
      price,
      minQuantity: body.minQuantity ? Number(body.minQuantity) : 1,
      maxQuantity: body.maxQuantity ? Number(body.maxQuantity) : null,
      reason: body.reason ? String(body.reason).trim() : 'Admin negotiated unit rate update',
    },
  };
}
