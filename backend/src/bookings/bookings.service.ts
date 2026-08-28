import { BookingsRepository } from './bookings.repository';
import { toBookingResponseDto, BookingResponseDto } from './responses/booking-response.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { RescheduleBookingDto } from './dto/reschedule-booking.dto';
import { AddressesRepository } from '../addresses/addresses.repository';
import { ServiceCatalogRepository } from '../service-catalog/service-catalog.repository';
import { SocietiesRepository } from '../societies/societies.repository';
import { PricingService } from '../pricing/pricing.service';
import { DemandRepository } from '../demand/demand.repository';
import { BookingStateMachine, BookingStatus, BookingActorType } from './state-machine/booking-state-machine';
import { BookingHistoryRepository } from './state-machine/booking-history.repository';
import { ErrorCode } from '../common/types/error-codes.enum';

export class BookingsService {
  /**
   * Centralized State Transition Engine (Step 20.6 & 20.29)
   */
  public static async transitionStatus(
    bookingId: string,
    targetStatus: BookingStatus,
    actorType: BookingActorType,
    actorId?: string,
    reason?: string
  ) {
    const booking = await BookingsRepository.findById(bookingId);
    if (!booking) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'Booking not found',
      };
    }

    const currentStatus = (booking.status as BookingStatus) || 'PENDING_PAYMENT';

    // Step 20.6: Reject invalid state transitions
    if (!BookingStateMachine.canTransition(currentStatus, targetStatus)) {
      throw {
        statusCode: 400,
        code: ErrorCode.VALIDATION_ERROR,
        message: `Illegal booking status transition from '${currentStatus}' to '${targetStatus}'.`,
      };
    }

    // Update status in data store
    (booking as any).status = targetStatus;
    if (targetStatus === 'CANCELLED') {
      (booking as any).cancellationReason = reason || 'Cancelled';
      (booking as any).cancelledAt = new Date().toISOString();
    }

    // Record audit trail history
    await BookingHistoryRepository.recordTransition(bookingId, currentStatus, targetStatus, actorType, actorId, reason);

    return toBookingResponseDto(booking);
  }

  /**
   * Central Transaction: Validates, calculates pricing, snapshots address & creates booking (Step 17.5 & 17.14)
   */
  public static async createBooking(userId: string, dto: CreateBookingDto, idempotencyKey?: string): Promise<BookingResponseDto> {
    if (idempotencyKey) {
      const cached = await BookingsRepository.getIdempotencyKey(idempotencyKey, userId);
      if (cached) return cached;
    }

    const address = await AddressesRepository.findByIdAndUserId(dto.addressId, userId);
    if (!address) {
      throw {
        statusCode: 403,
        code: ErrorCode.ADDRESS_NOT_FOUND,
        message: 'Invalid address or address does not belong to the authenticated user',
      };
    }

    if (address.societyId !== dto.societyId) {
      throw {
        statusCode: 400,
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Selected address does not belong to the target society',
      };
    }

    const society = await SocietiesRepository.findById(dto.societyId, false);
    if (!society) {
      throw {
        statusCode: 404,
        code: ErrorCode.SOCIETY_INACTIVE,
        message: 'Society is currently unavailable or inactive',
      };
    }

    const service = await ServiceCatalogRepository.findServiceById(dto.serviceId, false);
    if (!service) {
      throw {
        statusCode: 404,
        code: ErrorCode.SERVICE_NOT_FOUND,
        message: 'Service is currently unavailable or inactive',
      };
    }

    const campaign = await DemandRepository.findOrCreateActiveCampaign(
      society.id,
      society.name,
      service.id,
      service.name
    );

    const pricingQuote = await PricingService.getPricingQuote({
      serviceId: service.id,
      societyId: society.id,
      quantity: dto.quantity,
    });

    const baseUnitPrice = Number(service.baseCatalogPrice || 799);
    const appliedUnitPrice = pricingQuote.currentPrice;
    const subtotal = appliedUnitPrice * dto.quantity;
    const discount = 0;
    const totalAmount = subtotal - discount;

    const serviceSnapshot = {
      serviceId: service.id,
      name: service.name,
      categoryName: service.categoryName || 'Appliance Repair',
      unitLabel: service.unitLabel || 'Unit',
    };

    const addressSnapshot = {
      flatNumber: address.houseNo,
      building: address.blockNo,
      street: address.street || '',
      city: address.city,
      pinCode: address.pincode,
      landmark: address.landmark || null,
    };

    const pricingSnapshot = {
      baseUnitPrice,
      appliedUnitPrice,
      quantity: dto.quantity,
      communityQuantity: pricingQuote.projectedCommunityQuantity,
    };

    const booking = await BookingsRepository.createBooking({
      userId,
      societyId: society.id,
      addressId: address.id,
      serviceId: service.id,
      campaignId: campaign.id,
      quantity: dto.quantity,
      serviceDate: dto.serviceDate,
      timeSlotId: dto.timeSlotId,
      baseUnitPrice,
      appliedUnitPrice,
      subtotal,
      discount,
      totalAmount,
      serviceSnapshot,
      addressSnapshot,
      pricingSnapshot,
    });

    await DemandRepository.addDemandItem(campaign.id, userId, dto.quantity, booking.id);
    await BookingHistoryRepository.recordTransition(booking.id, null, 'PENDING_PAYMENT', 'USER', userId, 'Booking Created');

    const response = toBookingResponseDto(booking);

    if (idempotencyKey) {
      await BookingsRepository.saveIdempotencyKey(idempotencyKey, userId, response);
    }

    return response;
  }

  public static async getUserBookings(userId: string, filterStatus?: string): Promise<BookingResponseDto[]> {
    let list = await BookingsRepository.findManyByUserId(userId);

    if (filterStatus) {
      const q = filterStatus.toUpperCase();
      if (q === 'UPCOMING') {
        list = list.filter((b) => BookingStateMachine.isUpcoming((b.status as any).toUpperCase() || 'SCHEDULED'));
      } else if (q === 'COMPLETED') {
        list = list.filter((b) => BookingStateMachine.isCompleted((b.status as any).toUpperCase()));
      } else if (q === 'CANCELLED') {
        list = list.filter((b) => BookingStateMachine.isCancelled((b.status as any).toUpperCase() || 'CANCELLED'));
      }
    }

    return list.map(toBookingResponseDto);
  }

  public static async getUserBookingById(userId: string, bookingId: string): Promise<BookingResponseDto> {
    const booking = await BookingsRepository.findByIdAndUserId(bookingId, userId);
    if (!booking) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'Booking not found',
      };
    }
    return toBookingResponseDto(booking);
  }

  /**
   * Customer Cancellation (Step 20.22)
   */
  public static async cancelBooking(userId: string, bookingId: string, dto: CancelBookingDto): Promise<BookingResponseDto> {
    const booking = await BookingsRepository.findByIdAndUserId(bookingId, userId);
    if (!booking) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'Booking not found',
      };
    }

    return this.transitionStatus(bookingId, 'CANCELLED', 'USER', userId, dto.reason);
  }

  public static async rescheduleBooking(userId: string, bookingId: string, dto: RescheduleBookingDto): Promise<BookingResponseDto> {
    const updated = await BookingsRepository.rescheduleBooking(bookingId, userId, dto.serviceDate, dto.timeSlotId);
    if (!updated) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'Booking not found',
      };
    }
    return toBookingResponseDto(updated);
  }

  // ==========================================
  // ADMIN CONTROLLED STATE TRANSITIONS
  // ==========================================

  public static async adminProcessBooking(bookingId: string, adminUserId: string) {
    return this.transitionStatus(bookingId, 'ADMIN_PROCESSING', 'ADMIN', adminUserId, 'Operations locked for vendor selection');
  }

  public static async adminAssignVendor(bookingId: string, vendorId: string, adminUserId: string) {
    const updated = await this.transitionStatus(bookingId, 'VENDOR_ASSIGNED', 'ADMIN', adminUserId, `Assigned to vendor ${vendorId}`);
    return updated;
  }

  public static async adminScheduleBooking(bookingId: string, adminUserId: string) {
    return this.transitionStatus(bookingId, 'SCHEDULED', 'ADMIN', adminUserId, 'Service scheduled');
  }

  public static async adminCompleteBooking(bookingId: string, adminUserId: string) {
    const updated = await this.transitionStatus(bookingId, 'COMPLETED', 'ADMIN', adminUserId, 'Service successfully completed');
    const booking = await BookingsRepository.findById(bookingId);
    if (booking) {
      const { ReferralsService } = await import('../referrals/referrals.service');
      await ReferralsService.qualifyReferralOnBookingComplete(booking.userId, booking.id);
    }
    return updated;
  }
}
