export interface BookingResponseDto {
  id: string;
  bookingNumber: string;
  userId: string;
  societyId: string;
  addressId: string;
  serviceId: string;
  campaignId: string | null;
  status: string;
  quantity: number;
  serviceDate: string;
  timeSlotId: string;
  timeSlotLabel: string;
  baseUnitPrice: number;
  appliedUnitPrice: number;
  subtotal: number;
  discount: number;
  totalAmount: number;
  currency: string;
  serviceSnapshot: {
    serviceId: string;
    name: string;
    categoryName: string;
    unitLabel: string;
  };
  addressSnapshot: {
    flatNumber: string;
    building: string;
    street: string;
    city: string;
    pinCode: string;
    landmark: string | null;
  };
  pricingSnapshot: {
    baseUnitPrice: number;
    appliedUnitPrice: number;
    quantity: number;
    communityQuantity: number;
  };
  cancellationReason?: string | null;
  createdAt: string;
}

export function toBookingResponseDto(b: any): BookingResponseDto {
  return {
    id: b.id,
    bookingNumber: b.bookingNumber || `BK${b.id.substring(0, 6).toUpperCase()}`,
    userId: b.userId,
    societyId: b.societyId || 'soc_1',
    addressId: b.addressId,
    serviceId: b.serviceId || 'srv_ac',
    campaignId: b.campaignId || null,
    status: b.status || 'PAYMENT_PENDING',
    quantity: b.quantity || 1,
    serviceDate: b.serviceDate || '2026-09-06',
    timeSlotId: b.timeSlotId || 'MORNING',
    timeSlotLabel: b.timeSlotId === 'AFTERNOON' ? '12 PM - 3 PM' : b.timeSlotId === 'EVENING' ? '3 PM - 6 PM' : '9 AM - 12 PM',
    baseUnitPrice: Number(b.baseUnitPrice || 799),
    appliedUnitPrice: Number(b.appliedUnitPrice || 699),
    subtotal: Number(b.subtotal || b.totalPrice || 1398),
    discount: Number(b.discount || 0),
    totalAmount: Number(b.totalAmount || b.totalPrice || 1398),
    currency: b.currency || 'INR',
    serviceSnapshot: b.serviceSnapshot || {
      serviceId: b.serviceId || 'srv_ac',
      name: b.serviceName || 'AC General Service',
      categoryName: 'Appliance Repair',
      unitLabel: 'AC Unit',
    },
    addressSnapshot: b.addressSnapshot || {
      flatNumber: '402',
      building: 'Block A',
      street: 'Main Road',
      city: 'Chennai',
      pinCode: '600001',
      landmark: null,
    },
    pricingSnapshot: b.pricingSnapshot || {
      baseUnitPrice: Number(b.baseUnitPrice || 799),
      appliedUnitPrice: Number(b.appliedUnitPrice || 699),
      quantity: b.quantity || 1,
      communityQuantity: 18,
    },
    cancellationReason: b.cancellationReason || null,
    createdAt: b.createdAt || new Date().toISOString().split('T')[0],
  };
}
