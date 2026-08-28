export interface UpdateAddressDto {
  flatNumber?: string;
  building?: string;
  street?: string;
  landmark?: string;
  societyId?: string;
}

export function validateUpdateAddressDto(body: any): { isValid: boolean; data?: UpdateAddressDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  const forbiddenFields = ['id', 'userId', 'isDefault', 'createdAt', 'deletedAt'];
  for (const field of forbiddenFields) {
    if (field in body) {
      return { isValid: false, error: `Field '${field}' is protected. Use dedicated endpoints for default address changes.` };
    }
  }

  const data: UpdateAddressDto = {};

  const flatNumber = body.flatNumber || body.houseNo;
  if (flatNumber !== undefined) {
    if (typeof flatNumber !== 'string' || flatNumber.trim().length < 1) {
      return { isValid: false, error: 'Flat number cannot be empty' };
    }
    data.flatNumber = flatNumber.trim();
  }

  if (body.building || body.blockNo) data.building = String(body.building || body.blockNo).trim();
  if (body.street !== undefined) data.street = String(body.street).trim();
  if (body.landmark !== undefined) data.landmark = String(body.landmark).trim();
  if (body.societyId !== undefined) data.societyId = String(body.societyId).trim();

  return { isValid: true, data };
}
