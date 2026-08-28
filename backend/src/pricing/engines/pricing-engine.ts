import { PricingTierDetail, PricingQuoteResponseDto } from '../responses/pricing-quote-response.dto';

export interface TierConfig {
  id?: string;
  minQuantity: number;
  maxQuantity?: number | null;
  price: number;
}

export class PricingEngine {
  /**
   * Pure function: Finds matching pricing tier for a given projected community quantity
   */
  public static findMatchingTier(quantity: number, tiers: TierConfig[]): TierConfig {
    const sorted = [...tiers].sort((a, b) => a.minQuantity - b.minQuantity);

    for (const tier of sorted) {
      if (quantity >= tier.minQuantity) {
        if (tier.maxQuantity === null || quantity <= tier.maxQuantity) {
          return tier;
        }
      }
    }

    // Default to highest tier if quantity exceeds all maxQuantities, or lowest tier
    return sorted[sorted.length - 1] || { minQuantity: 1, maxQuantity: 9, price: 799 };
  }

  /**
   * Pure function: Finds next higher pricing tier if one exists
   */
  public static findNextTier(currentTier: TierConfig, tiers: TierConfig[]): TierConfig | null {
    const sorted = [...tiers].sort((a, b) => a.minQuantity - b.minQuantity);
    const currentIndex = sorted.findIndex((t) => t.minQuantity === currentTier.minQuantity);

    if (currentIndex !== -1 && currentIndex + 1 < sorted.length) {
      return sorted[currentIndex + 1];
    }
    return null;
  }

  /**
   * Calculates comprehensive pricing quote & progress towards lower price tier
   */
  public static calculateQuote(params: {
    serviceId: string;
    societyId: string;
    userQuantity: number;
    existingCommunityQuantity: number;
    basePrice: number;
    tiers: TierConfig[];
  }): PricingQuoteResponseDto {
    const projectedCommunityQuantity = params.existingCommunityQuantity + params.userQuantity;
    const currentTier = this.findMatchingTier(projectedCommunityQuantity, params.tiers);
    const nextTier = this.findNextTier(currentTier, params.tiers);

    const currentPrice = currentTier.price;
    const currentSavingsPerUnit = Math.max(0, params.basePrice - currentPrice);
    const currentSavings = currentSavingsPerUnit * projectedCommunityQuantity;

    let nextPrice: number | null = null;
    let nextTierQuantity: number | null = null;
    let remainingQuantity = 0;
    let potentialAdditionalSavingsPerUnit = 0;
    let potentialAdditionalSavings = 0;
    let progressPercentage = 100;

    if (nextTier) {
      nextPrice = nextTier.price;
      nextTierQuantity = nextTier.minQuantity;
      remainingQuantity = Math.max(0, nextTier.minQuantity - projectedCommunityQuantity);

      potentialAdditionalSavingsPerUnit = Math.max(0, currentPrice - nextPrice);
      potentialAdditionalSavings = potentialAdditionalSavingsPerUnit * projectedCommunityQuantity;

      // Step 14.25 Formula: (projected - min) / (nextMin - min) * 100
      const range = nextTier.minQuantity - currentTier.minQuantity;
      const progress = projectedCommunityQuantity - currentTier.minQuantity;
      progressPercentage = range > 0 ? Math.min(100, Math.max(0, Math.round((progress / range) * 100))) : 100;
    }

    return {
      serviceId: params.serviceId,
      societyId: params.societyId,
      userQuantity: params.userQuantity,
      existingCommunityQuantity: params.existingCommunityQuantity,
      projectedCommunityQuantity,
      basePrice: params.basePrice,
      currentPrice,
      currentTier: {
        minQuantity: currentTier.minQuantity,
        maxQuantity: currentTier.maxQuantity,
        price: currentTier.price,
      },
      currentSavingsPerUnit,
      currentSavings,
      nextTier: nextTier
        ? {
            minQuantity: nextTier.minQuantity,
            maxQuantity: nextTier.maxQuantity,
            price: nextTier.price,
          }
        : null,
      nextPrice,
      nextTierQuantity,
      remainingQuantity,
      potentialAdditionalSavingsPerUnit,
      potentialAdditionalSavings,
      progressPercentage,
    };
  }

  /**
   * Validates pricing tier matrix for overlaps, gaps, and open-ended constraints (Step 14.30 - 14.32)
   */
  public static validateTierMatrix(tiers: TierConfig[]): { isValid: boolean; error?: string } {
    if (!tiers || tiers.length === 0) {
      return { isValid: false, error: 'At least one pricing tier must be defined' };
    }

    const sorted = [...tiers].sort((a, b) => a.minQuantity - b.minQuantity);

    let nullCount = 0;
    for (let i = 0; i < sorted.length; i++) {
      const tier = sorted[i];

      if (tier.maxQuantity === null) {
        nullCount++;
        if (i !== sorted.length - 1) {
          return { isValid: false, error: 'Only the highest tier can have an open-ended maxQuantity (NULL).' };
        }
      } else if (tier.maxQuantity < tier.minQuantity) {
        return { isValid: false, error: `Invalid tier range: minQuantity (${tier.minQuantity}) > maxQuantity (${tier.maxQuantity}).` };
      }

      if (i > 0) {
        const prev = sorted[i - 1];
        if (prev.maxQuantity !== null && tier.minQuantity <= prev.maxQuantity) {
          return { isValid: false, error: `Overlapping pricing tiers detected between range ${prev.minQuantity}-${prev.maxQuantity} and ${tier.minQuantity}-${tier.maxQuantity}.` };
        }
        if (prev.maxQuantity !== null && tier.minQuantity > prev.maxQuantity + 1) {
          return { isValid: false, error: `Gap detected in pricing matrix between quantity ${prev.maxQuantity} and ${tier.minQuantity}.` };
        }
      }
    }

    return { isValid: true };
  }
}
