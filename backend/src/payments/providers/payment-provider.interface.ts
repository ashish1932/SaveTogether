export interface CreatePaymentOrderInput {
  bookingId: string;
  bookingNumber: string;
  amount: number;
  currency: string;
}

export interface PaymentOrderResult {
  provider: string;
  providerOrderId: string;
  amount: number;
  currency: string;
  expiresAt: string;
}

export interface VerifyPaymentInput {
  paymentId: string;
  providerOrderId: string;
  providerPaymentId: string;
  signature: string;
}

export interface PaymentVerificationResult {
  isVerified: boolean;
  providerPaymentId: string;
  amount: number;
  currency: string;
}

export interface PaymentProvider {
  createOrder(input: CreatePaymentOrderInput): Promise<PaymentOrderResult>;
  verifyPayment(input: VerifyPaymentInput): Promise<PaymentVerificationResult>;
  verifyWebhookSignature(payload: string, signature: string): Promise<boolean>;
}
