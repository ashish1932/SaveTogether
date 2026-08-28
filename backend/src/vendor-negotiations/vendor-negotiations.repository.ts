import { NegotiationStatus, NegotiationOfferType } from './responses/negotiation-response.dto';

export interface LocalNegotiationRecord {
  id: string;
  negotiationNumber: string;
  vendorId: string;
  vendorCode: string;
  businessName: string;
  campaignId: string;
  quantity: number;
  status: NegotiationStatus;
  finalOfferId: string | null;
  createdBy: string;
  createdAt: string;
}

export interface LocalNegotiationOfferRecord {
  id: string;
  negotiationId: string;
  offerType: NegotiationOfferType;
  unitRate: number;
  quantity: number;
  totalAmount: number;
  notes: string | null;
  createdBy: string;
  createdAt: string;
}

const mockNegotiationsStore: LocalNegotiationRecord[] = [];
const mockOffersStore: LocalNegotiationOfferRecord[] = [];

export class VendorNegotiationRepository {
  public static async createNegotiationSession(data: {
    vendorId: string;
    vendorCode: string;
    businessName: string;
    campaignId: string;
    quantity: number;
    initialRate: number;
    notes?: string;
    createdBy: string;
  }): Promise<{ session: LocalNegotiationRecord; offer: LocalNegotiationOfferRecord }> {
    const id = `neg_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const negotiationNumber = `NEG-${Math.floor(10000 + Math.random() * 90000)}`;

    const session: LocalNegotiationRecord = {
      id,
      negotiationNumber,
      vendorId: data.vendorId,
      vendorCode: data.vendorCode,
      businessName: data.businessName,
      campaignId: data.campaignId,
      quantity: data.quantity,
      status: 'OPEN',
      finalOfferId: null,
      createdBy: data.createdBy,
      createdAt: new Date().toISOString(),
    };

    mockNegotiationsStore.push(session);

    // Initial offer insertion
    const offer: LocalNegotiationOfferRecord = {
      id: `off_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      negotiationId: id,
      offerType: 'INITIAL',
      unitRate: data.initialRate,
      quantity: data.quantity,
      totalAmount: Math.round(data.initialRate * data.quantity * 100) / 100,
      notes: data.notes || 'Initial vendor catalog rate',
      createdBy: data.createdBy,
      createdAt: new Date().toISOString(),
    };

    mockOffersStore.push(offer);

    return { session, offer };
  }

  public static async findById(id: string): Promise<LocalNegotiationRecord | undefined> {
    return mockNegotiationsStore.find((n) => n.id === id || n.negotiationNumber === id);
  }

  public static async findByCampaignId(campaignId: string): Promise<LocalNegotiationRecord[]> {
    return mockNegotiationsStore.filter((n) => n.campaignId === campaignId);
  }

  public static async findOffersByNegotiationId(negotiationId: string): Promise<LocalNegotiationOfferRecord[]> {
    return mockOffersStore.filter((o) => o.negotiationId === negotiationId);
  }

  /**
   * Append new offer record (IMMUTABLE INSERT - Step 25.8 & 25.26)
   */
  public static async addOffer(data: {
    negotiationId: string;
    offerType: NegotiationOfferType;
    unitRate: number;
    quantity: number;
    notes?: string;
    createdBy: string;
  }): Promise<LocalNegotiationOfferRecord> {
    const offer: LocalNegotiationOfferRecord = {
      id: `off_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      negotiationId: data.negotiationId,
      offerType: data.offerType,
      unitRate: data.unitRate,
      quantity: data.quantity,
      totalAmount: Math.round(data.unitRate * data.quantity * 100) / 100,
      notes: data.notes || null,
      createdBy: data.createdBy,
      createdAt: new Date().toISOString(),
    };

    mockOffersStore.push(offer);
    return offer;
  }

  public static async updateSessionStatus(id: string, status: NegotiationStatus, finalOfferId?: string): Promise<LocalNegotiationRecord | undefined> {
    const session = await this.findById(id);
    if (!session) return undefined;

    session.status = status;
    if (finalOfferId) session.finalOfferId = finalOfferId;
    return session;
  }
}
