export type CampaignStatus =
  | 'OPEN'
  | 'THRESHOLD_REACHED'
  | 'PROCESSING'
  | 'VENDOR_ASSIGNED'
  | 'SCHEDULED'
  | 'COMPLETED'
  | 'EXPIRED'
  | 'CANCELLED';

const allowedTransitions: Record<CampaignStatus, CampaignStatus[]> = {
  OPEN: ['THRESHOLD_REACHED', 'PROCESSING', 'EXPIRED', 'CANCELLED'],
  THRESHOLD_REACHED: ['PROCESSING', 'EXPIRED', 'CANCELLED'],
  PROCESSING: ['VENDOR_ASSIGNED', 'CANCELLED'],
  VENDOR_ASSIGNED: ['SCHEDULED', 'CANCELLED'],
  SCHEDULED: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  EXPIRED: [],
  CANCELLED: [],
};

const displayStatusMap: Record<CampaignStatus, string> = {
  OPEN: 'Collecting Bookings',
  THRESHOLD_REACHED: 'Bulk Discount Unlocked!',
  PROCESSING: 'Demand Locked for Allocation',
  VENDOR_ASSIGNED: 'Vendor Allocated',
  SCHEDULED: 'Bulk Service Scheduled',
  COMPLETED: 'Service Completed',
  EXPIRED: 'Campaign Expired',
  CANCELLED: 'Campaign Cancelled',
};

export class CampaignStateMachine {
  /**
   * Validates whether a state transition is legal according to campaign rules (Step 16.5)
   */
  public static canTransition(current: CampaignStatus, next: CampaignStatus): boolean {
    const valid = allowedTransitions[current] || [];
    return valid.includes(next);
  }

  /**
   * Returns user-friendly display status for frontend UI (Step 16.48)
   */
  public static getDisplayStatus(status: CampaignStatus): string {
    return displayStatusMap[status] || status;
  }
}
