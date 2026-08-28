import { RefundStatus } from '../state-machine/refund-state-machine';

export interface RefundResponseDto {
  id: string;
  refundNumber: string;
  bookingId: string;
  bookingNumber: string;
  paymentId: string | null;
  grossAmount: number;
  processingFee: number;
  refundAmount: number;
  percentage: number;
  reason: string;
  status: RefundStatus;
  providerRefundId: string | null;
  requestedAt: string;
  processedAt: string | null;
}
