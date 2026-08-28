import { TierConfig } from './engines/pricing-engine';

export interface LocalPricingTierRecord extends TierConfig {
  id: string;
  serviceId: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

const mockPricingTiersStore: LocalPricingTierRecord[] = [
  // AC General Service Tiers (srv_ac)
  { id: 'pt_ac_1', serviceId: 'srv_ac', minQuantity: 1, maxQuantity: 9, price: 799, status: 'ACTIVE', createdAt: '2026-08-28' },
  { id: 'pt_ac_2', serviceId: 'srv_ac', minQuantity: 10, maxQuantity: 19, price: 699, status: 'ACTIVE', createdAt: '2026-08-28' },
  { id: 'pt_ac_3', serviceId: 'srv_ac', minQuantity: 20, maxQuantity: 39, price: 599, status: 'ACTIVE', createdAt: '2026-08-28' },
  { id: 'pt_ac_4', serviceId: 'srv_ac', minQuantity: 40, maxQuantity: 59, price: 549, status: 'ACTIVE', createdAt: '2026-08-28' },
  { id: 'pt_ac_5', serviceId: 'srv_ac', minQuantity: 60, maxQuantity: null, price: 499, status: 'ACTIVE', createdAt: '2026-08-28' },

  // Home Deep Cleaning Tiers (srv_cleaning)
  { id: 'pt_cl_1', serviceId: 'srv_cleaning', minQuantity: 1, maxQuantity: 4, price: 999, status: 'ACTIVE', createdAt: '2026-08-28' },
  { id: 'pt_cl_2', serviceId: 'srv_cleaning', minQuantity: 5, maxQuantity: 14, price: 849, status: 'ACTIVE', createdAt: '2026-08-28' },
  { id: 'pt_cl_3', serviceId: 'srv_cleaning', minQuantity: 15, maxQuantity: null, price: 749, status: 'ACTIVE', createdAt: '2026-08-28' },
];

export class PricingRepository {
  /**
   * Retrieves active pricing tiers for a given serviceId
   */
  public static async findTiersByServiceId(serviceId: string): Promise<LocalPricingTierRecord[]> {
    const list = mockPricingTiersStore.filter((t) => t.serviceId === serviceId && t.status === 'ACTIVE');
    if (list.length > 0) return list;

    // Fallback default tiers for services without explicit tiers configured yet
    return [
      { id: `pt_${serviceId}_1`, serviceId, minQuantity: 1, maxQuantity: 9, price: 799, status: 'ACTIVE', createdAt: '2026-08-28' },
      { id: `pt_${serviceId}_2`, serviceId, minQuantity: 10, maxQuantity: 19, price: 699, status: 'ACTIVE', createdAt: '2026-08-28' },
      { id: `pt_${serviceId}_3`, serviceId, minQuantity: 20, maxQuantity: 39, price: 599, status: 'ACTIVE', createdAt: '2026-08-28' },
      { id: `pt_${serviceId}_4`, serviceId, minQuantity: 40, maxQuantity: 59, price: 549, status: 'ACTIVE', createdAt: '2026-08-28' },
      { id: `pt_${serviceId}_5`, serviceId, minQuantity: 60, maxQuantity: null, price: 499, status: 'ACTIVE', createdAt: '2026-08-28' },
    ];
  }

  /**
   * Retrieves aggregated community demand quantity for (serviceId + societyId)
   */
  public static async getExistingCommunityDemand(serviceId: string, societyId: string): Promise<number> {
    // In dev seed scenario, return realistic community demand (e.g. 16 units for soc_1 + srv_ac)
    if (societyId === 'soc_1' && serviceId === 'srv_ac') return 16;
    if (societyId === 'soc_1' && serviceId === 'srv_cleaning') return 8;
    return 12;
  }

  /**
   * Creates a new Pricing Tier
   */
  public static async createTier(data: { serviceId: string; minQuantity: number; maxQuantity?: number | null; price: number }): Promise<LocalPricingTierRecord> {
    const newTier: LocalPricingTierRecord = {
      id: `pt_${Date.now()}`,
      serviceId: data.serviceId,
      minQuantity: data.minQuantity,
      maxQuantity: data.maxQuantity !== undefined ? data.maxQuantity : null,
      price: data.price,
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0],
    };

    mockPricingTiersStore.push(newTier);
    return newTier;
  }
}
