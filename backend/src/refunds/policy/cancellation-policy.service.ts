export interface PolicyCalculationResult {
  isEligible: boolean;
  refundPercentage: number;
  grossAmount: number;
  processingFee: number;
  refundAmount: number;
  reason: string;
}

export class CancellationPolicyService {
  /**
   * Server-side calculation of cancellation refund policy (Step 21.5, 21.7, 21.10)
   */
  public static calculateRefund(
    totalAmount: number,
    scheduledDateStr: string,
    bookingStatus: string
  ): PolicyCalculationResult {
    // If unpaid, no refund required
    if (bookingStatus === 'PENDING_PAYMENT' || bookingStatus === 'PAYMENT_FAILED' || bookingStatus === 'EXPIRED') {
      return {
        isEligible: true,
        refundPercentage: 0,
        grossAmount: totalAmount,
        processingFee: 0,
        refundAmount: 0,
        reason: 'Unpaid booking cancelled before payment completed.',
      };
    }

    const now = new Date();
    const scheduledDate = new Date(scheduledDateStr);
    const diffHours = (scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    let refundPercentage = 100;
    let fee = 0;
    let reason = 'Full 100% refund applied (>24 hours lead time)';

    if (diffHours < 12) {
      refundPercentage = 0;
      reason = 'No refund applicable (<12 hours lead time cancellation policy)';
    } else if (diffHours < 24) {
      refundPercentage = 75;
      fee = Math.round(totalAmount * 0.05 * 100) / 100; // 5% processing fee
      reason = '75% partial refund applied (12-24 hours lead time policy)';
    }

    const grossAmount = totalAmount;
    const netRefund = Math.max(0, Math.round(((totalAmount * refundPercentage) / 100 - fee) * 100) / 100);

    return {
      isEligible: true,
      refundPercentage,
      grossAmount,
      processingFee: fee,
      refundAmount: netRefund,
      reason,
    };
  }
}
