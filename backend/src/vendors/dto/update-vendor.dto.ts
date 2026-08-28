export interface UpdateVendorDto {
  businessName?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BLOCKED';
  notes?: string;
}

export function validateUpdateVendorDto(body: any): { isValid: boolean; data?: UpdateVendorDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  // Reject system derived field mutation (Step 22.28)
  const forbiddenFields = ['performance', 'completedBookings', 'rating', 'totalJobs'];
  for (const field of forbiddenFields) {
    if (field in body) {
      return { isValid: false, error: `Field '${field}' is system-derived and cannot be updated directly.` };
    }
  }

  return {
    isValid: true,
    data: {
      businessName: body.businessName ? String(body.businessName).trim() : undefined,
      contactName: body.contactName ? String(body.contactName).trim() : undefined,
      phone: body.phone ? String(body.phone).trim() : undefined,
      email: body.email ? String(body.email).trim() : undefined,
      address: body.address ? String(body.address).trim() : undefined,
      city: body.city ? String(body.city).trim() : undefined,
      state: body.state ? String(body.state).trim() : undefined,
      pinCode: body.pinCode ? String(body.pinCode).trim() : undefined,
      status: body.status ? String(body.status).toUpperCase() as any : undefined,
      notes: body.notes ? String(body.notes).trim() : undefined,
    },
  };
}
