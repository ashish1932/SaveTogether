export interface CreateRedemptionDto {
  amount: number;
  bookingId?: string;
}

export function validateCreateRedemptionDto(body: any): { isValid: boolean; data?: CreateRedemptionDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  const amt = Number(body.amount);
  if (isNaN(amt) || amt <= 0) {
    return { isValid: false, error: 'amount must be a positive number' };
  }

  return {
    isValid: true,
    data: {
      amount: amt,
      bookingId: body.bookingId ? String(body.bookingId).trim() : undefined,
    },
  };
}
