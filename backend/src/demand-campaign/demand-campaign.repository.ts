import { CampaignStatus } from './state-machine/campaign-state-machine';

export interface ExtendedCampaignRecord {
  id: string;
  societyId: string;
  societyName: string;
  serviceId: string;
  serviceName: string;
  serviceDate: string;
  status: CampaignStatus;
  aggregatedQuantity: number;
  currentUnitPrice: number;
  startsAt: string;
  expiresAt: string | null;
  version: number;
  createdAt: string;
  thresholdReachedAt?: string;
  processingAt?: string;
  vendorAssignedAt?: string;
  scheduledAt?: string;
  completedAt?: string;
  expiredAt?: string;
  cancelledAt?: string;
}

const mockExtendedCampaignsStore: ExtendedCampaignRecord[] = [
  {
    id: 'cmp_soc1_ac_sep06',
    societyId: 'soc_1',
    societyName: 'ABC Residency',
    serviceId: 'srv_ac',
    serviceName: 'AC General Service',
    serviceDate: '2026-09-06',
    status: 'OPEN',
    aggregatedQuantity: 18,
    currentUnitPrice: 699,
    startsAt: '2026-08-01',
    expiresAt: '2026-09-05T18:00:00Z',
    version: 1,
    createdAt: '2026-08-01',
  },
  {
    id: 'cmp_soc1_cleaning_sep06',
    societyId: 'soc_1',
    societyName: 'ABC Residency',
    serviceId: 'srv_cleaning',
    serviceName: 'Full Home Deep Cleaning',
    serviceDate: '2026-09-06',
    status: 'OPEN',
    aggregatedQuantity: 8,
    currentUnitPrice: 849,
    startsAt: '2026-08-01',
    expiresAt: '2026-09-05T18:00:00Z',
    version: 1,
    createdAt: '2026-08-01',
  },
];

export class DemandCampaignRepository {
  public static async findBySocietyServiceDate(societyId: string, serviceId: string, serviceDate: string): Promise<ExtendedCampaignRecord | undefined> {
    return mockExtendedCampaignsStore.find(
      (c) => c.societyId === societyId && c.serviceId === serviceId && (c.serviceDate === serviceDate || c.status === 'OPEN')
    );
  }

  public static async findById(id: string): Promise<ExtendedCampaignRecord | undefined> {
    return mockExtendedCampaignsStore.find((c) => c.id === id);
  }

  public static async findAll(filters?: { societyId?: string; serviceId?: string; status?: string; serviceDate?: string }): Promise<ExtendedCampaignRecord[]> {
    let items = mockExtendedCampaignsStore;
    if (filters?.societyId) items = items.filter((c) => c.societyId === filters.societyId);
    if (filters?.serviceId) items = items.filter((c) => c.serviceId === filters.serviceId);
    if (filters?.status) items = items.filter((c) => c.status === filters.status);
    if (filters?.serviceDate) items = items.filter((c) => c.serviceDate === filters.serviceDate);
    return items;
  }

  public static async updateStatus(id: string, newStatus: CampaignStatus, timestampField?: string): Promise<ExtendedCampaignRecord | undefined> {
    const campaign = await this.findById(id);
    if (!campaign) return undefined;

    campaign.status = newStatus;
    campaign.version += 1;

    const now = new Date().toISOString();
    if (newStatus === 'THRESHOLD_REACHED') campaign.thresholdReachedAt = now;
    if (newStatus === 'PROCESSING') campaign.processingAt = now;
    if (newStatus === 'VENDOR_ASSIGNED') campaign.vendorAssignedAt = now;
    if (newStatus === 'SCHEDULED') campaign.scheduledAt = now;
    if (newStatus === 'COMPLETED') campaign.completedAt = now;
    if (newStatus === 'EXPIRED') campaign.expiredAt = now;
    if (newStatus === 'CANCELLED') campaign.cancelledAt = now;

    return campaign;
  }
}
