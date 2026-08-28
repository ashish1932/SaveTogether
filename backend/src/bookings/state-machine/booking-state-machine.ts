export type BookingStatus =
  | 'PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'DEMAND_AGGREGATING'
  | 'ADMIN_PROCESSING'
  | 'VENDOR_ASSIGNED'
  | 'ASSIGNED'
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUND_PENDING'
  | 'REFUNDED'
  | 'REFUND_FAILED'
  | 'PAYMENT_FAILED'
  | 'EXPIRED';

export type BookingActorType = 'USER' | 'ADMIN' | 'SYSTEM' | 'PAYMENT_PROVIDER' | 'JOB';

const allowedTransitions: Record<BookingStatus, BookingStatus[]> = {
  PENDING_PAYMENT: ['CONFIRMED', 'PAYMENT_FAILED', 'EXPIRED', 'CANCELLED'],
  CONFIRMED: ['DEMAND_AGGREGATING', 'ADMIN_PROCESSING', 'CANCELLED', 'REFUND_PENDING'],
  DEMAND_AGGREGATING: ['ADMIN_PROCESSING', 'CANCELLED', 'REFUND_PENDING'],
  ADMIN_PROCESSING: ['VENDOR_ASSIGNED', 'CANCELLED', 'REFUND_PENDING'],
  VENDOR_ASSIGNED: ['SCHEDULED', 'CANCELLED', 'REFUND_PENDING'],
  ASSIGNED: ['VENDOR_ASSIGNED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED'],
  SCHEDULED: ['IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REFUND_PENDING'],
  IN_PROGRESS: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: ['REFUND_PENDING'],
  REFUND_PENDING: ['REFUNDED', 'REFUND_FAILED'],
  REFUNDED: [],
  REFUND_FAILED: ['REFUND_PENDING'],
  PAYMENT_FAILED: [],
  EXPIRED: [],
};

export class BookingStateMachine {
  /**
   * Centralized transition check (Step 20.6)
   */
  public static canTransition(from: BookingStatus, to: BookingStatus): boolean {
    const valid = allowedTransitions[from] || [];
    return valid.includes(to);
  }

  public static isUpcoming(status: BookingStatus): boolean {
    return ['CONFIRMED', 'DEMAND_AGGREGATING', 'ADMIN_PROCESSING', 'VENDOR_ASSIGNED', 'SCHEDULED', 'PENDING_PAYMENT'].includes(status);
  }

  public static isCompleted(status: BookingStatus): boolean {
    return status === 'COMPLETED';
  }

  public static isCancelled(status: BookingStatus): boolean {
    return ['CANCELLED', 'REFUND_PENDING', 'REFUNDED', 'REFUND_FAILED', 'PAYMENT_FAILED', 'EXPIRED'].includes(status);
  }
}
