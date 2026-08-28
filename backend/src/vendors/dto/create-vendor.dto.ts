export interface CreateVendorDto {
  businessName: string;
  contactName: string;
  phone: string;
  email?: string;
  address?: string;
  city: string;
  state?: string;
  pinCode?: string;
  notes?: string;
}

export function validateCreateVendorDto(body: any): { isValid: boolean; data?: CreateVendorDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  if (!body.businessName || typeof body.businessName !== 'string') {
    return { isValid: false, error: 'businessName is required' };
  }
  if (!body.contactName || typeof body.contactName !== 'string') {
    return { isValid: false, error: 'contactName is required' };
  }
  if (!body.phone || typeof body.phone !== 'string') {
    return { isValid: false, error: 'phone is required' };
  }
  if (!body.city || typeof body.city !== 'string') {
    return { isValid: false, error: 'city is required' };
  }

  return {
    isValid: true,
    data: {
      businessName: body.businessName.trim(),
      contactName: body.contactName.trim(),
      phone: body.phone.trim(),
      email: body.email ? String(body.email).trim() : undefined,
      address: body.address ? String(body.address).trim() : undefined,
      city: body.city.trim(),
      state: body.state ? String(body.state).trim() : 'Tamil Nadu',
      pinCode: body.pinCode ? String(body.pinCode).trim() : '600001',
      notes: body.notes ? String(body.notes).trim() : undefined,
    },
  };
}
