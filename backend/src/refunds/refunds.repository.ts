import { RefundStatus } from './state-machine/refund-state-machine';

export interface LocalRefundRecord {
  id: string;
  refundNumber: string;
  bookingId: string;
  bookingNumber: string;
  userId: string;
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

const mockRefundsStore: LocalRefundRecord[] = [];

export class RefundsRepository {
  public static async createRefund(data: {
    bookingId: string;
    bookingNumber: string;
    userId: string;
    paymentId?: string | null;
    grossAmount: number;
    processingFee: number;
    refundAmount: number;
    percentage: number;
    reason: string;
  }): Promise<LocalRefundRecord> {
    const refund: LocalRefundRecord = {
      id: `rf_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      refundNumber: `RF${Math.floor(10000 + Math.random() * 90000)}`,
      bookingId: data.bookingId,
      bookingNumber: data.bookingNumber,
      userId: data.userId,
      paymentId: data.paymentId || null,
      grossAmount: data.grossAmount,
      processingFee: data.processingFee,
      refundAmount: data.refundAmount,
      percentage: data.percentage,
      reason: data.reason,
      status: data.refundAmount > 0 ? 'PENDING' : 'SUCCESS',
      providerRefundId: null,
      requestedAt: new Date().toISOString(),
      processedAt: data.refundAmount > 0 ? null : new Date().toISOString(),
    };

    mockRefundsStore.push(refund);
    return refund;
  }

  public static async findById(id: string): Promise<LocalRefundRecord | undefined> {
    return mockRefundsStore.find((r) => r.id === id);
  }

  public static async findByIdAndUserId(id: string, userId: string): Promise<LocalRefundRecord | undefined> {
    return mockRefundsStore.find((r) => r.id === id && r.userId === userId);
  }

  public static async findByBookingId(bookingId: string): Promise<LocalRefundRecord | undefined> {
    return mockRefundsStore.find((r) => r.bookingId === bookingId);
  }

  public static async findAll(filters?: { status?: string; bookingId?: string }): Promise<LocalRefundRecord[]> {
    let items = mockRefundsStore;
    if (filters?.status) items = items.filter((r) => r.status === filters.status);
    if (filters?.bookingId) items = items.filter((r) => r.bookingId === filters.bookingId);
    return items;
  }

  public static async updateStatus(id: string, newStatus: RefundStatus, providerRefundId?: string): Promise<LocalRefundRecord | undefined> {
    const refund = await this.findById(id);
    if (!refund) return undefined;

    refund.status = newStatus;
    if (providerRefundId) refund.providerRefundId = providerRefundId;
    if (newStatus === 'SUCCESS') refund.processedAt = new Date().toISOString();

    return refund;
  }
}
