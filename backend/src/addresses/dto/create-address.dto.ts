export interface CreateAddressDto {
  societyId: string;
  flatNumber: string;
  building?: string;
  street?: string;
  landmark?: string;
  city?: string;
  state?: string;
  pincode?: string;
  isDefault?: boolean;
}

export function validateCreateAddressDto(body: any): { isValid: boolean; data?: CreateAddressDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  const flatNumber = body.flatNumber || body.houseNo;
  if (!flatNumber || typeof flatNumber !== 'string' || flatNumber.trim().length < 1) {
    return { isValid: false, error: 'Flat/House number is required' };
  }

  if (!body.societyId || typeof body.societyId !== 'string') {
    return { isValid: false, error: 'societyId is required' };
  }

  return {
    isValid: true,
    data: {
      societyId: body.societyId.trim(),
      flatNumber: String(flatNumber).trim(),
      building: body.building || body.blockNo ? String(body.building || body.blockNo).trim() : 'Block A',
      street: body.street ? String(body.street).trim() : '',
      landmark: body.landmark ? String(body.landmark).trim() : '',
      city: body.city ? String(body.city).trim() : 'Chennai',
      state: body.state ? String(body.state).trim() : 'Tamil Nadu',
      pincode: body.pincode ? String(body.pincode).trim() : '600001',
      isDefault: Boolean(body.isDefault),
    },
  };
}
