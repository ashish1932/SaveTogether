export type RefundStatus = 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';

const allowedTransitions: Record<RefundStatus, RefundStatus[]> = {
  PENDING: ['PROCESSING', 'CANCELLED', 'SUCCESS'],
  PROCESSING: ['SUCCESS', 'FAILED'],
  FAILED: ['PROCESSING'],
  SUCCESS: [],
  CANCELLED: [],
};

export class RefundStateMachine {
  public static canTransition(current: RefundStatus, next: RefundStatus): boolean {
    const valid = allowedTransitions[current] || [];
    return valid.includes(next);
  }
}
