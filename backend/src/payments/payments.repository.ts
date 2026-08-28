import { PaymentStatus } from './state-machine/payment-state-machine';

export interface LocalPaymentRecord {
  id: string;
  bookingId: string;
  bookingNumber: string;
  userId: string;
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

export interface LocalWebhookEventRecord {
  id: string;
  provider: string;
  providerEventId: string;
  eventType: string;
  processed: boolean;
  createdAt: string;
}

const mockPaymentsStore: LocalPaymentRecord[] = [];
const mockWebhookEventsStore: LocalWebhookEventRecord[] = [];

export class PaymentsRepository {
  public static async createPaymentOrder(data: {
    bookingId: string;
    bookingNumber: string;
    userId: string;
    provider: string;
    providerOrderId: string;
    amount: number;
    currency: string;
    expiresAt: string;
  }): Promise<LocalPaymentRecord> {
    const payment: LocalPaymentRecord = {
      id: `pay_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      bookingId: data.bookingId,
      bookingNumber: data.bookingNumber,
      userId: data.userId,
      provider: data.provider,
      providerOrderId: data.providerOrderId,
      providerPaymentId: null,
      amount: data.amount,
      currency: data.currency,
      status: 'ORDER_CREATED',
      paymentMethod: 'UPI',
      paidAt: null,
      expiresAt: data.expiresAt,
      createdAt: new Date().toISOString(),
    };

    mockPaymentsStore.push(payment);
    return payment;
  }

  public static async findById(id: string): Promise<LocalPaymentRecord | undefined> {
    return mockPaymentsStore.find((p) => p.id === id);
  }

  public static async findAll(): Promise<LocalPaymentRecord[]> {
    return mockPaymentsStore;
  }

  public static async findByIdAndUserId(id: string, userId: string): Promise<LocalPaymentRecord | undefined> {
    return mockPaymentsStore.find((p) => p.id === id && p.userId === userId);
  }

  public static async findByBookingId(bookingId: string): Promise<LocalPaymentRecord | undefined> {
    return mockPaymentsStore.find((p) => p.bookingId === bookingId);
  }

  public static async findByProviderOrderId(orderId: string): Promise<LocalPaymentRecord | undefined> {
    return mockPaymentsStore.find((p) => p.providerOrderId === orderId);
  }

  public static async updateStatus(id: string, newStatus: PaymentStatus, providerPaymentId?: string): Promise<LocalPaymentRecord | undefined> {
    const payment = await this.findById(id);
    if (!payment) return undefined;

    payment.status = newStatus;
    if (providerPaymentId) payment.providerPaymentId = providerPaymentId;
    if (newStatus === 'SUCCESS') payment.paidAt = new Date().toISOString();

    return payment;
  }

  /**
   * Webhook deduplication check (Step 19.17)
   */
  public static async hasProcessedWebhookEvent(provider: string, providerEventId: string): Promise<boolean> {
    return mockWebhookEventsStore.some((e) => e.provider === provider && e.providerEventId === providerEventId && e.processed);
  }

  public static async saveWebhookEvent(provider: string, providerEventId: string, eventType: string): Promise<LocalWebhookEventRecord> {
    const event: LocalWebhookEventRecord = {
      id: `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      provider,
      providerEventId,
      eventType,
      processed: true,
      createdAt: new Date().toISOString(),
    };
    mockWebhookEventsStore.push(event);
    return event;
  }
}
