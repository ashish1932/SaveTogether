import { PaymentStatus } from '../state-machine/payment-state-machine';

export interface PaymentResponseDto {
  id: string;
  bookingId: string;
  bookingNumber: string;
  provider: string;
  providerOrderId: string | null;
  providerPaymentId: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string | null;
  paidAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}
