import { ReviewsRepository, LocalReviewRecord } from './reviews.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewStatusDto } from './dto/update-review-status.dto';
import { ReviewEligibilityResponseDto, ReviewResponseDto } from './responses/review-response.dto';
import { BookingsRepository } from '../bookings/bookings.repository';
import { UsersRepository } from '../users/users.repository';
import { ErrorCode } from '../common/types/error-codes.enum';

export class ReviewsService {
  /**
   * Evaluates review eligibility for a booking (Step 31.7 & 31.8)
   */
  public static async checkEligibility(bookingId: string, userId: string): Promise<ReviewEligibilityResponseDto> {
    const booking = await BookingsRepository.findById(bookingId);
    if (!booking) {
      return { canReview: false, reason: 'NOT_OWNER' };
    }

    if (booking.userId !== userId) {
      return { canReview: false, reason: 'NOT_OWNER' };
    }

    if (booking.status !== 'COMPLETED') {
      return { canReview: false, reason: 'BOOKING_NOT_COMPLETED' };
    }

    const existing = await ReviewsRepository.findByBookingId(bookingId);
    if (existing) {
      return { canReview: false, reason: 'ALREADY_REVIEWED' };
    }

    return { canReview: true, reason: null };
  }

  /**
   * Creates a review for a completed booking (Step 31.9 & 31.10)
   */
  public static async createReview(bookingId: string, userId: string, dto: CreateReviewDto): Promise<ReviewResponseDto> {
    const eligibility = await this.checkEligibility(bookingId, userId);
    if (!eligibility.canReview) {
      throw {
        statusCode: 400,
        code: ErrorCode.VALIDATION_ERROR,
        message: `Review not permitted for booking. Reason: ${eligibility.reason}`,
      };
    }

    const booking = (await BookingsRepository.findById(bookingId))!;
    const user = await UsersRepository.findById(userId);

    try {
      // Step 31.9: Server derives serviceId and vendorId directly from booking
      const record = await ReviewsRepository.createReview({
        bookingId: booking.id,
        userId: booking.userId,
        userName: user?.name || 'Resident',
        serviceId: booking.serviceId,
        serviceName: (booking as any).serviceSnapshot?.name || (booking as any).serviceName || 'Service',
        vendorId: booking.assignedVendorId || null,
        vendorName: booking.assignedVendorName || null,
        overallRating: dto.overallRating,
        serviceQuality: dto.serviceQuality,
        professionalism: dto.professionalism,
        valueForMoney: dto.valueForMoney,
        comment: dto.comment,
      });

      console.log(`⭐ [REVIEW SUBMITTED] Booking ${booking.id} rated ${record.overallRating}/5 by ${record.userName}`);
      return this.toDto(record);
    } catch (err: any) {
      if (err.message === 'REVIEW_ALREADY_EXISTS') {
        throw {
          statusCode: 400,
          code: ErrorCode.VALIDATION_ERROR,
          message: 'A review has already been submitted for this booking',
        };
      }
      throw err;
    }
  }

  public static async getReviewById(id: string, userId?: string): Promise<ReviewResponseDto> {
    const review = await ReviewsRepository.findById(id);
    if (!review) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'Review not found',
      };
    }

    if (userId && review.userId !== userId) {
      throw {
        statusCode: 403,
        code: ErrorCode.AUTH_UNAUTHORIZED,
        message: 'You are not authorized to view this review',
      };
    }

    return this.toDto(review);
  }

  public static async getUserReviews(userId: string): Promise<ReviewResponseDto[]> {
    const list = await ReviewsRepository.findByUserId(userId);
    return list.map(this.toDto);
  }

  public static async listAdminReviews(statusFilter?: string): Promise<ReviewResponseDto[]> {
    const list = await ReviewsRepository.findAll();
    const filtered = statusFilter ? list.filter((r) => r.status === statusFilter.toUpperCase()) : list;
    return filtered.map(this.toDto);
  }

  public static async updateAdminReviewStatus(id: string, dto: UpdateReviewStatusDto): Promise<ReviewResponseDto> {
    const updated = await ReviewsRepository.updateStatus(id, dto.status);
    if (!updated) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'Review not found',
      };
    }
    return this.toDto(updated);
  }

  private static toDto(r: LocalReviewRecord): ReviewResponseDto {
    return {
      id: r.id,
      bookingId: r.bookingId,
      userId: r.userId,
      userName: r.userName,
      serviceId: r.serviceId,
      serviceName: r.serviceName,
      vendorId: r.vendorId,
      vendorName: r.vendorName,
      overallRating: r.overallRating,
      serviceQuality: r.serviceQuality,
      professionalism: r.professionalism,
      valueForMoney: r.valueForMoney,
      comment: r.comment,
      status: r.status,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    };
  }
}
