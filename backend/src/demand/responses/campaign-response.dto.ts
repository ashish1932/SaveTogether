import { PricingQuoteResponseDto } from '../../pricing/responses/pricing-quote-response.dto';

export interface DemandCampaignResponseDto {
  id: string;
  societyId: string;
  societyName: string;
  serviceId: string;
  serviceName: string;
  status: string;
  aggregatedQuantity: number;
  uniqueUsersCount: number;
  startsAt: string;
  expiresAt: string | null;
  pricing: PricingQuoteResponseDto;
  createdAt: string;
}
