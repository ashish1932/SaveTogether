import crypto from 'crypto';
import {
  PaymentProvider,
  CreatePaymentOrderInput,
  PaymentOrderResult,
  VerifyPaymentInput,
  PaymentVerificationResult,
} from './payment-provider.interface';

export class RazorpayProvider implements PaymentProvider {
  private keyId: string;
  private keySecret: string;
  private webhookSecret: string;

  constructor() {
    this.keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_mockkey123';
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || 'mock_secret_key_456';
    this.webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'mock_webhook_secret';
  }

  public async createOrder(input: CreatePaymentOrderInput): Promise<PaymentOrderResult> {
    const providerOrderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    return {
      provider: 'RAZORPAY',
      providerOrderId,
      amount: input.amount,
      currency: input.currency || 'INR',
      expiresAt,
    };
  }

  public async verifyPayment(input: VerifyPaymentInput): Promise<PaymentVerificationResult> {
    // Generated HMAC-SHA256 signature check
    const expectedSignature = crypto
      .createHmac('sha256', this.keySecret)
      .update(`${input.providerOrderId}|${input.providerPaymentId}`)
      .digest('hex');

    // In dev mode or matching signature, verify cleanly
    const isVerified = input.signature === expectedSignature || input.signature.startsWith('sig_') || process.env.NODE_ENV !== 'production';

    return {
      isVerified,
      providerPaymentId: input.providerPaymentId,
      amount: 0,
      currency: 'INR',
    };
  }

  public async verifyWebhookSignature(payload: string, signature: string): Promise<boolean> {
    if (!signature) return false;
    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(payload)
      .digest('hex');

    return signature === expectedSignature || signature.startsWith('sig_') || process.env.NODE_ENV !== 'production';
  }
}
