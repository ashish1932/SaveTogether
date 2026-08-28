export interface CreateBookingDto {
  serviceId: string;
  societyId: string;
  addressId: string;
  quantity: number;
  serviceDate: string;
  timeSlotId: string;
}

export function validateCreateBookingDto(body: any): { isValid: boolean; data?: CreateBookingDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  // Step 17.4 & 17.18 Security Rule: Strictly reject frontend pricing or status overrides
  const forbiddenFields = ['userId', 'total', 'totalAmount', 'appliedUnitPrice', 'discount', 'status', 'bookingNumber'];
  for (const field of forbiddenFields) {
    if (field in body) {
      return { isValid: false, error: `Field '${field}' is strictly owned by the backend and cannot be specified by client.` };
    }
  }

  if (!body.serviceId || typeof body.serviceId !== 'string') {
    return { isValid: false, error: 'serviceId is required' };
  }
  if (!body.societyId || typeof body.societyId !== 'string') {
    return { isValid: false, error: 'societyId is required' };
  }
  if (!body.addressId || typeof body.addressId !== 'string') {
    return { isValid: false, error: 'addressId is required' };
  }

  const qty = Number(body.quantity || 1);
  if (isNaN(qty) || !Number.isInteger(qty) || qty <= 0) {
    return { isValid: false, error: 'Quantity must be a positive integer' };
  }

  if (!body.serviceDate || typeof body.serviceDate !== 'string') {
    return { isValid: false, error: 'serviceDate is required (YYYY-MM-DD)' };
  }

  return {
    isValid: true,
    data: {
      serviceId: body.serviceId.trim(),
      societyId: body.societyId.trim(),
      addressId: body.addressId.trim(),
      quantity: qty,
      serviceDate: body.serviceDate.trim(),
      timeSlotId: body.timeSlotId ? String(body.timeSlotId).trim() : 'MORNING',
    },
  };
}
