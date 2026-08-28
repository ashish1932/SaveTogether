import { demandOpportunitiesData, bookingsData, societiesData } from '../data/mockDatabase';
import { DemandOpportunity, Booking } from '../types';
import { PricingEngine } from './pricingEngine';

export class DemandAggregationEngine {
  /**
   * Recalculate and update society demand when a new booking is created or cancelled
   */
  public static reevaluateSocietyDemand(societyId: string, serviceId: string): DemandOpportunity {
    const activeBookings = bookingsData.filter(
      (b) => b.societyId === societyId && b.serviceId === serviceId && b.status !== 'CANCELLED'
    );

    const totalAggregatedQty = activeBookings.reduce((sum, b) => sum + b.quantity, 0);
    const participantsCount = new Set(activeBookings.map((b) => b.userId)).size;

    const pricing = PricingEngine.calculatePrice(serviceId, Math.max(1, totalAggregatedQty));

    const society = societiesData.find((s) => s.id === societyId);
    let opportunity = demandOpportunitiesData.find(
      (d) => d.societyId === societyId && d.serviceId === serviceId
    );

    let nextTarget = 40;
    let nextPrice = 549;
    if (totalAggregatedQty < 10) {
      nextTarget = 10;
      nextPrice = 699;
    } else if (totalAggregatedQty < 20) {
      nextTarget = 20;
      nextPrice = 599;
    } else if (totalAggregatedQty < 40) {
      nextTarget = 40;
      nextPrice = 549;
    } else {
      nextTarget = 60;
      nextPrice = 499;
    }

    if (!opportunity) {
      opportunity = {
        id: `dmd_${Date.now()}`,
        societyId,
        societyName: society ? society.name : 'Target Society',
        serviceId,
        serviceName: pricing.serviceName,
        totalAggregatedQty,
        currentTierPrice: pricing.unitPrice,
        nextTierTarget: nextTarget,
        nextTierPrice: nextPrice,
        potentialSavingsPerUnit: pricing.baseCatalogPrice - pricing.unitPrice,
        participantsCount,
        status: totalAggregatedQty >= 40 ? 'THRESHOLD_REACHED' : 'AGGREGATING',
        expiryDate: 'In 2 days',
      };
      demandOpportunitiesData.push(opportunity);
    } else {
      opportunity.totalAggregatedQty = totalAggregatedQty;
      opportunity.currentTierPrice = pricing.unitPrice;
      opportunity.nextTierTarget = nextTarget;
      opportunity.nextTierPrice = nextPrice;
      opportunity.potentialSavingsPerUnit = pricing.baseCatalogPrice - pricing.unitPrice;
      opportunity.participantsCount = participantsCount;
      opportunity.status = totalAggregatedQty >= 40 ? 'THRESHOLD_REACHED' : 'AGGREGATING';
    }

    return opportunity;
  }
}
