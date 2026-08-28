export interface AddressResponseDto {
  id: string;
  societyId: string;
  societyName: string;
  flatNumber: string;
  building: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  landmark: string | null;
  isDefault: boolean;
  createdAt: string;
}

export function toAddressResponseDto(addr: any): AddressResponseDto {
  return {
    id: addr.id,
    societyId: addr.societyId || 'soc_1',
    societyName: addr.societyName || 'ABC Residency',
    flatNumber: addr.houseNo || addr.flatNumber || '402',
    building: addr.blockNo || addr.building || 'Block A',
    street: addr.street || '',
    city: addr.city || 'Chennai',
    state: addr.state || 'Tamil Nadu',
    pinCode: addr.pincode || addr.pinCode || '600001',
    landmark: addr.landmark || null,
    isDefault: Boolean(addr.isDefault),
    createdAt: addr.createdAt || new Date().toISOString().split('T')[0],
  };
}
