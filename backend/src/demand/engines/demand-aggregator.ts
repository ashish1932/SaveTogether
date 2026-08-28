export interface DemandItemRecord {
  id: string;
  campaignId: string;
  userId: string;
  bookingId?: string;
  quantity: number;
  status: 'PENDING' | 'RESERVED' | 'ELIGIBLE' | 'CANCELLED' | 'EXPIRED' | 'CONSUMED';
  createdAt: string;
}

export class DemandAggregator {
  /**
   * Pure function: Sums quantity of ELIGIBLE demand items for a campaign (Step 15.8 & 15.21)
   */
  public static calculateEligibleQuantity(items: DemandItemRecord[]): number {
    return items
      .filter((item) => item.status === 'ELIGIBLE')
      .reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Pure function: Calculates unique users contributing eligible demand (Step 15.46)
   */
  public static calculateUniqueUsers(items: DemandItemRecord[]): number {
    const uniqueUserIds = new Set(
      items
        .filter((item) => item.status === 'ELIGIBLE')
        .map((item) => item.userId)
    );
    return uniqueUserIds.size;
  }
}
