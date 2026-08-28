export interface CancelBookingDto {
  reason?: string;
}

export function validateCancelBookingDto(body: any): { isValid: boolean; data?: CancelBookingDto; error?: string } {
  if (body && typeof body === 'object') {
    return {
      isValid: true,
      data: {
        reason: body.reason ? String(body.reason).trim() : 'Cancelled by user',
      },
    };
  }

  return { isValid: true, data: { reason: 'Cancelled by user' } };
}
