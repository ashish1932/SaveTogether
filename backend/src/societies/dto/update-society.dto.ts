export interface UpdateSocietyDto {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  totalBlocks?: number;
  totalFlats?: number;
  status?: 'ACTIVE' | 'INACTIVE';
}

export function validateUpdateSocietyDto(body: any): { isValid: boolean; data?: UpdateSocietyDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  const forbiddenFields = ['id', 'userCount', 'bookingCount', 'registeredDemandCount', 'createdAt', 'deletedAt'];
  for (const field of forbiddenFields) {
    if (field in body) {
      return { isValid: false, error: `Derived attribute '${field}' cannot be directly updated.` };
    }
  }

  const data: UpdateSocietyDto = {};

  if (body.name !== undefined) {
    if (typeof body.name !== 'string' || body.name.trim().length < 2) {
      return { isValid: false, error: 'Society name must be at least 2 characters long' };
    }
    data.name = body.name.trim();
  }

  if (body.city !== undefined) {
    if (typeof body.city !== 'string' || body.city.trim().length < 2) {
      return { isValid: false, error: 'City name must be at least 2 characters long' };
    }
    data.city = body.city.trim();
  }

  if (body.pincode !== undefined) {
    if (typeof body.pincode !== 'string' || !/^\d{6}$/.test(body.pincode.trim())) {
      return { isValid: false, error: 'PIN Code must be a 6-digit number' };
    }
    data.pincode = body.pincode.trim();
  }

  if (body.address !== undefined) data.address = String(body.address).trim();
  if (body.state !== undefined) data.state = String(body.state).trim();
  if (body.latitude !== undefined) data.latitude = Number(body.latitude);
  if (body.longitude !== undefined) data.longitude = Number(body.longitude);
  if (body.totalBlocks !== undefined) data.totalBlocks = Math.max(1, Number(body.totalBlocks));
  if (body.totalFlats !== undefined) data.totalFlats = Math.max(1, Number(body.totalFlats));
  if (body.status !== undefined && ['ACTIVE', 'INACTIVE'].includes(body.status.toUpperCase())) {
    data.status = body.status.toUpperCase() as 'ACTIVE' | 'INACTIVE';
  }

  return { isValid: true, data };
}
