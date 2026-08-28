import { DemandRepository } from './demand.repository';
import { DemandAggregator } from './engines/demand-aggregator';
import { DemandQueryDto } from './dto/demand-query.dto';
import { DemandAdjustmentDto } from './dto/demand-adjustment.dto';
import { DemandCampaignResponseDto } from './responses/campaign-response.dto';
import { PricingService } from '../pricing/pricing.service';
import { SocietiesRepository } from '../societies/societies.repository';
import { ServiceCatalogRepository } from '../service-catalog/service-catalog.repository';
import { ErrorCode } from '../common/types/error-codes.enum';

export class DemandService {
  /**
   * Retrieves active demand campaign and dynamic community pricing (Step 15.15 & 15.44)
   */
  public static async getActiveCampaign(query: DemandQueryDto): Promise<DemandCampaignResponseDto> {
    const society = await SocietiesRepository.findById(query.societyId, false);
    if (!society) {
      throw {
        statusCode: 404,
        code: ErrorCode.SOCIETY_NOT_FOUND,
        message: 'Society not found or is currently inactive',
      };
    }

    const service = await ServiceCatalogRepository.findServiceById(query.serviceId, false);
    if (!service) {
      throw {
        statusCode: 404,
        code: ErrorCode.SERVICE_NOT_FOUND,
        message: 'Service not found or is currently inactive',
      };
    }

    // Step 15.14 Find or initialize active campaign for (societyId + serviceId)
    const campaign = await DemandRepository.findOrCreateActiveCampaign(
      society.id,
      society.name,
      service.id,
      service.name
    );

    const items = await DemandRepository.findDemandItemsByCampaignId(campaign.id);
    const aggregatedQuantity = DemandAggregator.calculateEligibleQuantity(items) || campaign.aggregatedQuantity;
    const uniqueUsersCount = DemandAggregator.calculateUniqueUsers(items) || Math.max(1, Math.ceil(aggregatedQuantity / 2));

    // Get pricing quote for user quantity 1 on top of community demand
    const pricing = await PricingService.getPricingQuote({
      serviceId: service.id,
      societyId: society.id,
      quantity: 1,
    });

    return {
      id: campaign.id,
      societyId: campaign.societyId,
      societyName: campaign.societyName,
      serviceId: campaign.serviceId,
      serviceName: campaign.serviceName,
      status: campaign.status,
      aggregatedQuantity,
      uniqueUsersCount,
      startsAt: campaign.startsAt,
      expiresAt: campaign.expiresAt,
      pricing,
      createdAt: campaign.createdAt,
    };
  }

  /**
   * Retrieves single campaign by ID
   */
  public static async getCampaignById(id: string): Promise<DemandCampaignResponseDto> {
    const campaign = await DemandRepository.findCampaignById(id);
    if (!campaign) {
      throw {
        statusCode: 404,
        code: ErrorCode.SERVICE_NOT_FOUND,
        message: 'Demand campaign not found',
      };
    }

    const items = await DemandRepository.findDemandItemsByCampaignId(campaign.id);
    const aggregatedQuantity = DemandAggregator.calculateEligibleQuantity(items) || campaign.aggregatedQuantity;
    const uniqueUsersCount = DemandAggregator.calculateUniqueUsers(items) || Math.max(1, Math.ceil(aggregatedQuantity / 2));

    const pricing = await PricingService.getPricingQuote({
      serviceId: campaign.serviceId,
      societyId: campaign.societyId,
      quantity: 1,
    });

    return {
      id: campaign.id,
      societyId: campaign.societyId,
      societyName: campaign.societyName,
      serviceId: campaign.serviceId,
      serviceName: campaign.serviceName,
      status: campaign.status,
      aggregatedQuantity,
      uniqueUsersCount,
      startsAt: campaign.startsAt,
      expiresAt: campaign.expiresAt,
      pricing,
      createdAt: campaign.createdAt,
    };
  }

  /**
   * Lists campaigns for Admin Dashboard
   */
  public static async listAllCampaigns(filters?: any) {
    const list = await DemandRepository.findAllCampaigns(filters);
    return list;
  }

  /**
   * Audit-logged admin demand adjustment (Step 15.60 & 15.61)
   */
  public static async adjustCampaignDemand(id: string, dto: DemandAdjustmentDto, adminUserId: string) {
    const updated = await DemandRepository.adjustCampaignQuantity(id, dto.quantityDelta);
    if (!updated) {
      throw {
        statusCode: 404,
        code: ErrorCode.SERVICE_NOT_FOUND,
        message: 'Demand campaign not found',
      };
    }

    console.log(`📊 [DEMAND AUDIT] Admin ${adminUserId} adjusted Campaign ${id} by delta ${dto.quantityDelta}. Reason: ${dto.reason}`);
    return updated;
  }
}
