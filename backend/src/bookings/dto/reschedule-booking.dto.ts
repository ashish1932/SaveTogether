export interface RescheduleBookingDto {
  serviceDate: string;
  timeSlotId: string;
}

export function validateRescheduleBookingDto(body: any): { isValid: boolean; data?: RescheduleBookingDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  if (!body.serviceDate || typeof body.serviceDate !== 'string') {
    return { isValid: false, error: 'serviceDate is required (YYYY-MM-DD)' };
  }

  return {
    isValid: true,
    data: {
      serviceDate: body.serviceDate.trim(),
      timeSlotId: body.timeSlotId ? String(body.timeSlotId).trim() : 'MORNING',
    },
  };
}
