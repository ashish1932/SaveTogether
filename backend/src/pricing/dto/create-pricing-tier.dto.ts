export interface CreatePricingTierDto {
  serviceId: string;
  minQuantity: number;
  maxQuantity?: number | null;
  price: number;
}

export function validateCreatePricingTierDto(body: any): { isValid: boolean; data?: CreatePricingTierDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  if (!body.serviceId || typeof body.serviceId !== 'string') {
    return { isValid: false, error: 'serviceId is required' };
  }

  const min = Number(body.minQuantity);
  if (isNaN(min) || !Number.isInteger(min) || min <= 0) {
    return { isValid: false, error: 'minQuantity must be an integer greater than zero' };
  }

  let max: number | null = null;
  if (body.maxQuantity !== undefined && body.maxQuantity !== null) {
    max = Number(body.maxQuantity);
    if (isNaN(max) || !Number.isInteger(max) || max < min) {
      return { isValid: false, error: 'maxQuantity must be an integer greater than or equal to minQuantity' };
    }
  }

  const price = Number(body.price);
  if (isNaN(price) || price <= 0) {
    return { isValid: false, error: 'price must be greater than zero' };
  }

  return {
    isValid: true,
    data: {
      serviceId: body.serviceId.trim(),
      minQuantity: min,
      maxQuantity: max,
      price,
    },
  };
}
