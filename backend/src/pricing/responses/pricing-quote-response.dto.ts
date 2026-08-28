export interface PricingTierDetail {
  minQuantity: number;
  maxQuantity: number | null;
  price: number;
}

export interface PricingQuoteResponseDto {
  serviceId: string;
  societyId: string;
  userQuantity: number;
  existingCommunityQuantity: number;
  projectedCommunityQuantity: number;
  basePrice: number;
  currentPrice: number;
  currentTier: PricingTierDetail;
  currentSavingsPerUnit: number;
  currentSavings: number;
  nextTier: PricingTierDetail | null;
  nextPrice: number | null;
  nextTierQuantity: number | null;
  remainingQuantity: number;
  potentialAdditionalSavingsPerUnit: number;
  potentialAdditionalSavings: number;
  progressPercentage: number;
}
