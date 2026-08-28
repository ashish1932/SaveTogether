export type NegotiationStatus = 'OPEN' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'EXPIRED';
export type NegotiationOfferType = 'INITIAL' | 'OFFER' | 'COUNTER_OFFER' | 'FINAL';

export interface NegotiationOfferResponseDto {
  id: string;
  offerType: NegotiationOfferType;
  unitRate: number;
  quantity: number;
  totalAmount: number;
  notes: string | null;
  createdBy: string;
  createdAt: string;
}

export interface NegotiationResponseDto {
  id: string;
  negotiationNumber: string;
  vendorId: string;
  vendorCode: string;
  businessName: string;
  campaignId: string;
  quantity: number;
  status: NegotiationStatus;
  finalOfferId: string | null;
  finalRate: number | null;
  offers: NegotiationOfferResponseDto[];
  createdBy: string;
  createdAt: string;
}
