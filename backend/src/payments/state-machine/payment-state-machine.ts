export type PaymentStatus =
  | 'CREATED'
  | 'ORDER_CREATED'
  | 'PAYMENT_PENDING'
  | 'SUCCESS'
  | 'FAILED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'REFUND_PENDING'
  | 'PARTIALLY_REFUNDED'
  | 'REFUNDED';

const allowedTransitions: Record<PaymentStatus, PaymentStatus[]> = {
  CREATED: ['ORDER_CREATED', 'CANCELLED'],
  ORDER_CREATED: ['PAYMENT_PENDING', 'SUCCESS', 'FAILED', 'EXPIRED', 'CANCELLED'],
  PAYMENT_PENDING: ['SUCCESS', 'FAILED', 'EXPIRED', 'CANCELLED'],
  SUCCESS: ['REFUND_PENDING'],
  FAILED: [],
  EXPIRED: [],
  CANCELLED: [],
  REFUND_PENDING: ['PARTIALLY_REFUNDED', 'REFUNDED', 'FAILED'],
  PARTIALLY_REFUNDED: ['REFUNDED'],
  REFUNDED: [],
};

export class PaymentStateMachine {
  public static canTransition(current: PaymentStatus, next: PaymentStatus): boolean {
    const valid = allowedTransitions[current] || [];
    return valid.includes(next);
  }
}
