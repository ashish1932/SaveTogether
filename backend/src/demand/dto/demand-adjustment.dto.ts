export interface DemandAdjustmentDto {
  quantityDelta: number;
  reason: string;
}

export function validateDemandAdjustmentDto(body: any): { isValid: boolean; data?: DemandAdjustmentDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  const delta = Number(body.quantityDelta);
  if (isNaN(delta) || !Number.isInteger(delta) || delta === 0) {
    return { isValid: false, error: 'quantityDelta must be a non-zero integer' };
  }

  if (!body.reason || typeof body.reason !== 'string' || body.reason.trim().length < 5) {
    return { isValid: false, error: 'Audit reason is required (at least 5 characters)' };
  }

  return {
    isValid: true,
    data: {
      quantityDelta: delta,
      reason: body.reason.trim(),
    },
  };
}
