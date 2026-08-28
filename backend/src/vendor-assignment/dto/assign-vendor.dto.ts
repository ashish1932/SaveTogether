export interface AssignVendorDto {
  vendorId: string;
  timeSlotId?: string;
  negotiatedRate?: number;
  notes?: string;
}

export function validateAssignVendorDto(body: any): { isValid: boolean; data?: AssignVendorDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  if (!body.vendorId || typeof body.vendorId !== 'string') {
    return { isValid: false, error: 'vendorId is required' };
  }

  return {
    isValid: true,
    data: {
      vendorId: body.vendorId.trim(),
      timeSlotId: body.timeSlotId ? String(body.timeSlotId).trim() : 'MORNING',
      negotiatedRate: body.negotiatedRate ? Number(body.negotiatedRate) : undefined,
      notes: body.notes ? String(body.notes).trim() : undefined,
    },
  };
}
