import { ReviewStatus } from '../dto/update-review-status.dto';

export interface ReviewEligibilityResponseDto {
  canReview: boolean;
  reason: 'BOOKING_NOT_COMPLETED' | 'ALREADY_REVIEWED' | 'NOT_OWNER' | null;
}

export interface ReviewResponseDto {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  serviceId: string;
  serviceName: string;
  vendorId: string | null;
  vendorName: string | null;
  overallRating: number;
  serviceQuality: number;
  professionalism: number;
  valueForMoney: number;
  comment: string | null;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
}
