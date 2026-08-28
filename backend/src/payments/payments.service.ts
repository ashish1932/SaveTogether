import { PaymentsRepository, LocalPaymentRecord } from './payments.repository';
import { PaymentProviderFactory } from './providers/provider.factory';
import { CreatePaymentOrderDto } from './dto/create-payment-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { PaymentResponseDto } from './responses/payment-response.dto';
import { BookingsRepository } from '../bookings/bookings.repository';
import { BookingTransactionSafetyService } from '../bookings/safety/booking-transaction-safety.service';
import { ErrorCode } from '../common/types/error-codes.enum';

export class PaymentsService {
  /**
   * Creates payment order using server-side Booking.totalAmount (Step 19.8 & 19.9)
   */
  public static async createPaymentOrder(userId: string, dto: CreatePaymentOrderDto): Promise<PaymentResponseDto> {
    const booking = await BookingsRepository.findByIdAndUserId(dto.bookingId, userId);
    if (!booking) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'Booking not found or does not belong to the user',
      };
    }

    const provider = PaymentProviderFactory.getProvider();
    const orderResult = await provider.createOrder({
      bookingId: booking.id,
      bookingNumber: (booking as any).bookingNumber || booking.id,
      amount: Number((booking as any).totalAmount || booking.totalPrice || 1398),
      currency: 'INR',
    });

    const payment = await PaymentsRepository.createPaymentOrder({
      bookingId: booking.id,
      bookingNumber: (booking as any).bookingNumber || booking.id,
      userId,
      provider: orderResult.provider,
      providerOrderId: orderResult.providerOrderId,
      amount: orderResult.amount,
      currency: orderResult.currency,
      expiresAt: orderResult.expiresAt,
    });

    return this.toResponseDto(payment);
  }

  /**
   * Client-side Verification Callback (`POST /api/v1/payments/verify`)
   */
  public static async verifyPayment(userId: string, dto: VerifyPaymentDto): Promise<PaymentResponseDto> {
    const payment = await PaymentsRepository.findByIdAndUserId(dto.paymentId, userId);
    if (!payment) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'Payment record not found',
      };
    }

    const provider = PaymentProviderFactory.getProvider(payment.provider);
    const ver = await provider.verifyPayment({
      paymentId: payment.id,
      providerOrderId: dto.providerOrderId,
      providerPaymentId: dto.providerPaymentId,
      signature: dto.signature,
    });

    if (!ver.isVerified) {
      await PaymentsRepository.updateStatus(payment.id, 'FAILED');
      throw {
        statusCode: 400,
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Payment verification failed due to invalid signature',
      };
    }

    const updated = await PaymentsRepository.updateStatus(payment.id, 'SUCCESS', dto.providerPaymentId);
    await BookingTransactionSafetyService.confirmPaymentAndDemand(payment.bookingId, dto.providerPaymentId);

    return this.toResponseDto(updated!);
  }

  /**
   * Authoritative Webhook Endpoint (`POST /api/v1/payments/webhook`) (Step 19.15 & 19.17)
   */
  public static async handleWebhook(rawBody: string, signature: string, eventPayload: any) {
    const provider = PaymentProviderFactory.getProvider();
    const isValidSig = await provider.verifyWebhookSignature(rawBody, signature);

    if (!isValidSig) {
      throw {
        statusCode: 400,
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Invalid webhook signature',
      };
    }

    const eventId = eventPayload?.id || `evt_${Date.now()}`;
    const eventType = eventPayload?.event || 'payment.captured';

    // Step 19.17 Webhook Deduplication
    const isDuplicate = await PaymentsRepository.hasProcessedWebhookEvent('RAZORPAY', eventId);
    if (isDuplicate) {
      console.log(`ℹ️ [WEBHOOK DEDUPLICATED] Event ${eventId} already processed.`);
      return { status: 'DEDUPLICATED' };
    }

    const providerOrderId = eventPayload?.payload?.payment?.entity?.order_id || eventPayload?.orderId;
    const providerPaymentId = eventPayload?.payload?.payment?.entity?.id || eventPayload?.paymentId || `pay_wh_${Date.now()}`;

    let payment: LocalPaymentRecord | undefined;
    if (providerOrderId) {
      payment = await PaymentsRepository.findByProviderOrderId(providerOrderId);
    }

    if (payment) {
      await PaymentsRepository.updateStatus(payment.id, 'SUCCESS', providerPaymentId);
      await BookingTransactionSafetyService.confirmPaymentAndDemand(payment.bookingId, providerPaymentId);
    }

    await PaymentsRepository.saveWebhookEvent('RAZORPAY', eventId, eventType);
    return { status: 'PROCESSED' };
  }

  /**
   * Retrieves single payment by ID (Step 19.26: IDOR Protection)
   */
  public static async getPaymentById(userId: string, paymentId: string): Promise<PaymentResponseDto> {
    const payment = await PaymentsRepository.findByIdAndUserId(paymentId, userId);
    if (!payment) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'Payment record not found',
      };
    }
    return this.toResponseDto(payment);
  }

  private static toResponseDto(p: LocalPaymentRecord): PaymentResponseDto {
    return {
      id: p.id,
      bookingId: p.bookingId,
      bookingNumber: p.bookingNumber,
      provider: p.provider,
      providerOrderId: p.providerOrderId,
      providerPaymentId: p.providerPaymentId,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      paymentMethod: p.paymentMethod,
      paidAt: p.paidAt,
      expiresAt: p.expiresAt,
      createdAt: p.createdAt,
    };
  }
}
