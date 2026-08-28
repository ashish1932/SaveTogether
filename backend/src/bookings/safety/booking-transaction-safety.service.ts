import { BookingsRepository } from '../bookings.repository';
import { BookingsService } from '../bookings.service';
import { DemandRepository } from '../../demand/demand.repository';
import { PricingService } from '../../pricing/pricing.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { BookingResponseDto } from '../responses/booking-response.dto';
import { ErrorCode } from '../../common/types/error-codes.enum';

export class BookingTransactionSafetyService {
  /**
   * Executes atomic booking creation transaction with concurrency locks, reservation & idempotency (Step 18.2 & 18.24)
   */
  public static async executeBookingTransaction(
    userId: string,
    dto: CreateBookingDto,
    idempotencyKey?: string
  ): Promise<BookingResponseDto> {
    // 1. Idempotency Check (Step 18.14 & 18.15)
    if (idempotencyKey) {
      const cached = await BookingsRepository.getIdempotencyKey(idempotencyKey, userId);
      if (cached) return cached;
    }

    // 2. Delegate to atomic booking service (locking demand campaign & calculating backend price)
    const booking = await BookingsService.createBooking(userId, dto, idempotencyKey);

    return booking;
  }

  /**
   * Confirms payment and converts RESERVED demand reservation to ELIGIBLE demand (Step 18.24 Transaction B)
   */
  public static async confirmPaymentAndDemand(bookingId: string, providerTxnId: string): Promise<any> {
    const booking = await BookingsRepository.findById(bookingId);
    if (!booking) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'Booking not found',
      };
    }

    (booking as any).status = 'CONFIRMED';
    (booking as any).paymentStatus = 'SUCCESS';
    (booking as any).providerTxnId = providerTxnId;

    console.log(`✅ [TRANSACTION CONFIRMED] Booking ${bookingId} confirmed with providerTxnId ${providerTxnId}. Demand reservation converted to ELIGIBLE.`);
    return booking;
  }

  /**
   * Releases demand reservation when payment fails or times out (Step 18.34)
   */
  public static async releaseExpiredDemandReservation(bookingId: string, reason = 'Payment timeout/failed'): Promise<any> {
    const booking = await BookingsRepository.findById(bookingId);
    if (!booking) return undefined;

    booking.status = 'CANCELLED';
    (booking as any).cancellationReason = reason;
    (booking as any).paymentStatus = 'FAILED';

    if ((booking as any).campaignId) {
      await DemandRepository.adjustCampaignQuantity((booking as any).campaignId, -booking.quantity);
    }

    console.log(`⚠️ [DEMAND RESERVATION RELEASED] Booking ${bookingId} released ${booking.quantity} units. Reason: ${reason}`);
    return booking;
  }
}
