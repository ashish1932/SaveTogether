import { PricingEngine, TierConfig } from '../../src/pricing/engines/pricing-engine';

export function runPricingEngineUnitTests() {
  console.log('🧪 [TEST] Running Pricing Engine Unit Tests...');

  const mockTiers: TierConfig[] = [
    { minQuantity: 1, maxQuantity: 9, price: 799 },
    { minQuantity: 10, maxQuantity: 19, price: 699 },
    { minQuantity: 20, maxQuantity: 39, price: 599 },
    { minQuantity: 40, maxQuantity: 59, price: 549 },
    { minQuantity: 60, maxQuantity: null, price: 499 },
  ];

  // Test Tier Boundaries (Step 39.5)
  const testCases = [
    { qty: 1, expectedPrice: 799 },
    { qty: 9, expectedPrice: 799 },
    { qty: 10, expectedPrice: 699 },
    { qty: 19, expectedPrice: 699 },
    { qty: 20, expectedPrice: 599 },
    { qty: 39, expectedPrice: 599 },
    { qty: 40, expectedPrice: 549 },
    { qty: 59, expectedPrice: 549 },
    { qty: 60, expectedPrice: 499 },
    { qty: 100, expectedPrice: 499 },
  ];

  for (const tc of testCases) {
    const tier = PricingEngine.findMatchingTier(tc.qty, mockTiers);
    if (tier.price !== tc.expectedPrice) {
      throw new Error(`Pricing Test Failed for Quantity ${tc.qty}: Expected ₹${tc.expectedPrice}, got ₹${tier.price}`);
    }
  }

  // Test Next Tier Targets (Step 39.8)
  const currentTier18 = PricingEngine.findMatchingTier(18, mockTiers);
  const nextTier18 = PricingEngine.findNextTier(currentTier18, mockTiers);
  if (currentTier18.price !== 699 || !nextTier18 || nextTier18.price !== 599 || nextTier18.minQuantity !== 20) {
    throw new Error('Pricing Test Failed: Next tier calculation for 18 AC failed');
  }

  console.log('✅ [TEST PASSED] Pricing Engine Unit Tests (Tiers & Next-Tier Targets)');
}
