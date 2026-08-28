export interface SocietyResponseDto {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  totalBlocks: number;
  totalFlats: number;
  status: string;
  userCount?: number;
  activeDemandCount?: number;
  createdAt: string;
}

export function toSocietyResponseDto(soc: any, isAdmin = false): SocietyResponseDto {
  return {
    id: soc.id,
    name: soc.name,
    address: soc.address || '',
    city: soc.city,
    state: soc.state || 'Tamil Nadu',
    pincode: soc.pincode || soc.pinCode || '600001',
    latitude: soc.latitude ? Number(soc.latitude) : 13.0827,
    longitude: soc.longitude ? Number(soc.longitude) : 80.2707,
    totalBlocks: soc.totalBlocks || 4,
    totalFlats: soc.totalFlats || 120,
    status: (soc.status || 'ACTIVE').toUpperCase(),
    ...(isAdmin
      ? {
          userCount: soc.activeUsers || 240,
          activeDemandCount: soc.registeredDemandCount || 12,
        }
      : {}),
    createdAt: soc.createdAt || new Date().toISOString().split('T')[0],
  };
}
