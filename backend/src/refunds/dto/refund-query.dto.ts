export interface RefundQueryDto {
  status?: string;
  bookingId?: string;
}

export function validateRefundQueryDto(query: any): { isValid: boolean; data?: RefundQueryDto; error?: string } {
  if (!query || typeof query !== 'object') {
    return { isValid: true, data: {} };
  }

  return {
    isValid: true,
    data: {
      status: query.status ? String(query.status).trim().toUpperCase() : undefined,
      bookingId: query.bookingId ? String(query.bookingId).trim() : undefined,
    },
  };
}
