export interface CreatePaymentOrderDto {
  bookingId: string;
}

export function validateCreatePaymentOrderDto(body: any): { isValid: boolean; data?: CreatePaymentOrderDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  // Step 19.8 Security Rule: Strictly reject client amount overrides
  if ('amount' in body || 'totalAmount' in body) {
    return { isValid: false, error: 'Payment amount is strictly calculated by backend from Booking record and cannot be supplied by client.' };
  }

  if (!body.bookingId || typeof body.bookingId !== 'string') {
    return { isValid: false, error: 'bookingId is required' };
  }

  return {
    isValid: true,
    data: {
      bookingId: body.bookingId.trim(),
    },
  };
}
