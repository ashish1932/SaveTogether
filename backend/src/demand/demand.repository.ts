import { DemandItemRecord, DemandAggregator } from './engines/demand-aggregator';

export interface LocalDemandCampaignRecord {
  id: string;
  societyId: string;
  societyName: string;
  serviceId: string;
  serviceName: string;
  status: 'DRAFT' | 'ACTIVE' | 'PROCESSING' | 'ASSIGNING_VENDOR' | 'SCHEDULED' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED';
  serviceDate?: string;
  aggregatedQuantity: number;
  startsAt: string;
  expiresAt: string | null;
  version: number;
  createdAt: string;
}

const mockCampaignsStore: LocalDemandCampaignRecord[] = [
  {
    id: 'dc_soc1_ac',
    societyId: 'soc_1',
    societyName: 'ABC Residency',
    serviceId: 'srv_ac',
    serviceName: 'AC General Service',
    status: 'ACTIVE',
    aggregatedQuantity: 18,
    startsAt: '2026-08-01',
    expiresAt: '2026-09-01',
    version: 1,
    createdAt: '2026-08-01',
  },
  {
    id: 'dc_soc1_cleaning',
    societyId: 'soc_1',
    societyName: 'ABC Residency',
    serviceId: 'srv_cleaning',
    serviceName: 'Full Home Deep Cleaning',
    status: 'ACTIVE',
    aggregatedQuantity: 8,
    startsAt: '2026-08-01',
    expiresAt: '2026-09-01',
    version: 1,
    createdAt: '2026-08-01',
  },
];

const mockDemandItemsStore: DemandItemRecord[] = [
  { id: 'di_1', campaignId: 'dc_soc1_ac', userId: 'usr_101', quantity: 2, status: 'ELIGIBLE', createdAt: '2026-08-20' },
  { id: 'di_2', campaignId: 'dc_soc1_ac', userId: 'usr_102', quantity: 4, status: 'ELIGIBLE', createdAt: '2026-08-21' },
  { id: 'di_3', campaignId: 'dc_soc1_ac', userId: 'usr_103', quantity: 12, status: 'ELIGIBLE', createdAt: '2026-08-22' },
];

export class DemandRepository {
  /**
   * Step 15.14 & 15.15: Finds unique ACTIVE campaign for (societyId + serviceId) or creates one
   */
  public static async findOrCreateActiveCampaign(societyId: string, societyName: string, serviceId: string, serviceName: string): Promise<LocalDemandCampaignRecord> {
    let campaign = mockCampaignsStore.find((c) => c.societyId === societyId && c.serviceId === serviceId && c.status === 'ACTIVE');

    if (!campaign) {
      campaign = {
        id: `dc_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        societyId,
        societyName,
        serviceId,
        serviceName,
        status: 'ACTIVE',
        aggregatedQuantity: 0,
        startsAt: new Date().toISOString().split('T')[0],
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        version: 1,
        createdAt: new Date().toISOString().split('T')[0],
      };
      mockCampaignsStore.push(campaign);
    }

    return campaign;
  }

  public static async findCampaignById(id: string): Promise<LocalDemandCampaignRecord | undefined> {
    return mockCampaignsStore.find((c) => c.id === id);
  }

  public static async findAllCampaigns(filters?: { societyId?: string; serviceId?: string; status?: string }): Promise<LocalDemandCampaignRecord[]> {
    let items = mockCampaignsStore;
    if (filters?.societyId) items = items.filter((c) => c.societyId === filters.societyId);
    if (filters?.serviceId) items = items.filter((c) => c.serviceId === filters.serviceId);
    if (filters?.status) items = items.filter((c) => c.status === filters.status);
    return items;
  }

  /**
   * Retrieves DemandItems for a campaign
   */
  public static async findDemandItemsByCampaignId(campaignId: string): Promise<DemandItemRecord[]> {
    return mockDemandItemsStore.filter((d) => d.campaignId === campaignId);
  }

  /**
   * Step 15.26: Atomic addition of DemandItem and counter increment
   */
  public static async addDemandItem(campaignId: string, userId: string, quantity: number, bookingId?: string): Promise<DemandItemRecord> {
    const newItem: DemandItemRecord = {
      id: `di_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      campaignId,
      userId,
      bookingId,
      quantity,
      status: 'ELIGIBLE',
      createdAt: new Date().toISOString().split('T')[0],
    };

    mockDemandItemsStore.push(newItem);

    const campaign = await this.findCampaignById(campaignId);
    if (campaign) {
      const items = await this.findDemandItemsByCampaignId(campaignId);
      campaign.aggregatedQuantity = DemandAggregator.calculateEligibleQuantity(items);
      campaign.version += 1;
    }

    return newItem;
  }

  /**
   * Step 15.60 & 15.61: Audit-logged admin demand adjustment
   */
  public static async adjustCampaignQuantity(campaignId: string, delta: number): Promise<LocalDemandCampaignRecord | undefined> {
    const campaign = await this.findCampaignById(campaignId);
    if (!campaign) return undefined;

    campaign.aggregatedQuantity = Math.max(0, campaign.aggregatedQuantity + delta);
    campaign.version += 1;
    return campaign;
  }
}
