import { pricingTiersData, servicesData } from '../data/mockDatabase';
import { PricingTier } from '../types';

export interface PricingCalculationResult {
  serviceId: string;
  serviceName: string;
  baseCatalogPrice: number;
  aggregatedQuantity: number;
  matchedTier: PricingTier;
  unitPrice: number;
  totalCatalogPrice: number;
  totalBulkPrice: number;
  totalCustomerSavings: number;
  discountPercentage: number;
}

export class PricingEngine {
  /**
   * Evaluate applicable bulk pricing tier based on total quantity
   */
  public static calculatePrice(serviceId: string, aggregatedQuantity: number): PricingCalculationResult {
    const service = servicesData.find((s) => s.id === serviceId) || servicesData[0];
    const tiers = pricingTiersData.filter((t) => t.serviceId === serviceId);

    let matchedTier = tiers[0];
    for (const tier of tiers) {
      if (aggregatedQuantity >= tier.minQty && (tier.maxQty === undefined || aggregatedQuantity <= tier.maxQty)) {
        matchedTier = tier;
        break;
      }
    }

    // Fallback if quantity exceeds all defined max limits
    if (!matchedTier && tiers.length > 0) {
      matchedTier = tiers[tiers.length - 1];
    }

    const baseCatalogPrice = service.baseCatalogPrice;
    const unitPrice = matchedTier ? matchedTier.pricePerUnit : baseCatalogPrice;
    const totalCatalogPrice = baseCatalogPrice * aggregatedQuantity;
    const totalBulkPrice = unitPrice * aggregatedQuantity;
    const totalCustomerSavings = totalCatalogPrice - totalBulkPrice;
    const discountPercentage = Math.round((totalCustomerSavings / totalCatalogPrice) * 100 * 10) / 10;

    return {
      serviceId: service.id,
      serviceName: service.name,
      baseCatalogPrice,
      aggregatedQuantity,
      matchedTier,
      unitPrice,
      totalCatalogPrice,
      totalBulkPrice,
      totalCustomerSavings,
      discountPercentage,
    };
  }
}
