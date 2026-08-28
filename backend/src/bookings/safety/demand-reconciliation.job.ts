import { DemandRepository } from '../../demand/demand.repository';
import { DemandAggregator } from '../../demand/engines/demand-aggregator';

export class DemandReconciliationJob {
  /**
   * Periodic reconciliation job checking campaign aggregated quantity vs sum of ELIGIBLE DemandItems (Step 18.28)
   */
  public static async runReconciliation(): Promise<{ reconciledCount: number; discrepanciesFound: number }> {
    const campaigns = await DemandRepository.findAllCampaigns();
    let reconciledCount = 0;
    let discrepanciesFound = 0;

    for (const campaign of campaigns) {
      const items = await DemandRepository.findDemandItemsByCampaignId(campaign.id);
      const calculatedQty = DemandAggregator.calculateEligibleQuantity(items);

      if (calculatedQty !== campaign.aggregatedQuantity) {
        discrepanciesFound += 1;
        console.warn(
          `⚠️ [DEMAND RECONCILIATION DISCREPANCY] Campaign ${campaign.id}: stored=${campaign.aggregatedQuantity}, calculated=${calculatedQty}. Auto-repairing.`
        );
        campaign.aggregatedQuantity = calculatedQty;
        reconciledCount += 1;
      }
    }

    return { reconciledCount, discrepanciesFound };
  }
}
