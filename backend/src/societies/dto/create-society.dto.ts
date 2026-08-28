export interface CreateSocietyDto {
  name: string;
  address: string;
  city: string;
  state?: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  totalBlocks?: number;
  totalFlats?: number;
}

export function validateCreateSocietyDto(body: any): { isValid: boolean; data?: CreateSocietyDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
    return { isValid: false, error: 'Society name must be at least 2 characters long' };
  }

  if (!body.city || typeof body.city !== 'string' || body.city.trim().length < 2) {
    return { isValid: false, error: 'City name is required' };
  }

  if (!body.pincode || typeof body.pincode !== 'string' || !/^\d{6}$/.test(body.pincode.trim())) {
    return { isValid: false, error: 'PIN Code must be a 6-digit number' };
  }

  return {
    isValid: true,
    data: {
      name: body.name.trim(),
      address: body.address ? String(body.address).trim() : '',
      city: body.city.trim(),
      state: body.state ? String(body.state).trim() : 'Tamil Nadu',
      pincode: body.pincode.trim(),
      latitude: body.latitude ? Number(body.latitude) : undefined,
      longitude: body.longitude ? Number(body.longitude) : undefined,
      totalBlocks: body.totalBlocks ? Math.max(1, Number(body.totalBlocks)) : 1,
      totalFlats: body.totalFlats ? Math.max(1, Number(body.totalFlats)) : 50,
    },
  };
}
