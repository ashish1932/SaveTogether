import { bookingsData } from '../data/mockDatabase';
import { Booking } from '../types';

export interface IdempotencyRecord {
  key: string;
  userId: string;
  response: any;
  createdAt: string;
}

const idempotencyStore: Map<string, IdempotencyRecord> = new Map();

export class BookingsRepository {
  public static async getIdempotencyKey(key: string, userId: string): Promise<any | undefined> {
    const rec = idempotencyStore.get(`${userId}:${key}`);
    return rec ? rec.response : undefined;
  }

  public static async saveIdempotencyKey(key: string, userId: string, response: any) {
    idempotencyStore.set(`${userId}:${key}`, {
      key,
      userId,
      response,
      createdAt: new Date().toISOString(),
    });
  }

  public static async findManyByUserId(userId: string): Promise<Booking[]> {
    return bookingsData.filter((b) => b.userId === userId || (b as any).user?.id === userId);
  }

  public static async findByIdAndUserId(bookingId: string, userId: string): Promise<Booking | undefined> {
    return bookingsData.find((b) => b.id === bookingId && (b.userId === userId || (b as any).user?.id === userId));
  }

  public static async findById(bookingId: string): Promise<Booking | undefined> {
    return bookingsData.find((b) => b.id === bookingId);
  }

  public static async findAll(): Promise<Booking[]> {
    return bookingsData;
  }

  public static async createBooking(data: Record<string, any>): Promise<Booking> {
    const bookingId = `bk_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const bookingNumber = `BK${Math.floor(10000 + Math.random() * 90000)}`;

    const newBooking: Booking = {
      id: bookingId,
      userId: data.userId,
      userName: 'Ashish Kumar',
      userPhone: '+919000000001',
      societyId: data.societyId,
      societyName: 'ABC Residency',
      serviceId: data.serviceId,
      serviceName: data.serviceSnapshot?.name || 'AC General Service',
      address: data.addressSnapshot?.flatNumber || 'Flat 402',
      quantity: data.quantity,
      unitLabel: data.serviceSnapshot?.unitLabel || 'Unit',
      baseUnitPrice: data.baseUnitPrice,
      appliedUnitPrice: data.appliedUnitPrice,
      totalPrice: data.totalAmount,
      savingsAmount: (data.baseUnitPrice - data.appliedUnitPrice) * data.quantity,
      scheduledDate: data.serviceDate,
      timeWindow: data.timeSlotId === 'AFTERNOON' ? '12 PM - 3 PM' : '9 AM - 12 PM',
      status: 'SCHEDULED',
      createdAt: new Date().toISOString().split('T')[0],
    };

    (newBooking as any).bookingNumber = bookingNumber;
    (newBooking as any).addressId = data.addressId;
    (newBooking as any).campaignId = data.campaignId;
    (newBooking as any).subtotal = data.subtotal;
    (newBooking as any).discount = data.discount;
    (newBooking as any).totalAmount = data.totalAmount;
    (newBooking as any).serviceSnapshot = data.serviceSnapshot;
    (newBooking as any).addressSnapshot = data.addressSnapshot;
    (newBooking as any).pricingSnapshot = data.pricingSnapshot;
    (newBooking as any).timeSlotId = data.timeSlotId;
    (newBooking as any).paymentStatus = 'Paid';
    (newBooking as any).paymentMethod = 'UPI';

    bookingsData.unshift(newBooking);
    return newBooking;
  }

  public static async cancelBooking(bookingId: string, userId: string, reason?: string): Promise<Booking | undefined> {
    const booking = await this.findByIdAndUserId(bookingId, userId);
    if (!booking) return undefined;

    booking.status = 'CANCELLED';
    (booking as any).cancellationReason = reason || 'Cancelled by user';
    (booking as any).cancelledAt = new Date().toISOString();

    return booking;
  }

  public static async rescheduleBooking(bookingId: string, userId: string, newDate: string, newTimeSlot: string): Promise<Booking | undefined> {
    const booking = await this.findByIdAndUserId(bookingId, userId);
    if (!booking) return undefined;

    booking.scheduledDate = newDate;
    booking.timeWindow = newTimeSlot === 'AFTERNOON' ? '12 PM - 3 PM' : '9 AM - 12 PM';
    (booking as any).timeSlotId = newTimeSlot;

    return booking;
  }
}
