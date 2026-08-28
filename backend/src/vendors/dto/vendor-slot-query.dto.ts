export interface VendorSlotQueryDto {
  date: string;
  serviceId?: string;
  timeSlotId?: string;
  quantity?: number;
}

export function validateVendorSlotQueryDto(query: any): { isValid: boolean; data?: VendorSlotQueryDto; error?: string } {
  if (!query || typeof query !== 'object') {
    return { isValid: false, error: 'Invalid query parameters' };
  }

  if (!query.date || typeof query.date !== 'string') {
    return { isValid: false, error: 'date is required (YYYY-MM-DD)' };
  }

  return {
    isValid: true,
    data: {
      date: query.date.trim(),
      serviceId: query.serviceId ? String(query.serviceId).trim() : undefined,
      timeSlotId: query.timeSlotId ? String(query.timeSlotId).trim() : undefined,
      quantity: query.quantity ? Number(query.quantity) : 1,
    },
  };
}
