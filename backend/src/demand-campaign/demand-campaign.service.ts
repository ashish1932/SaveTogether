import { DemandCampaignRepository, ExtendedCampaignRecord } from './demand-campaign.repository';
import { CampaignStateMachine, CampaignStatus } from './state-machine/campaign-state-machine';
import { PricingService } from '../pricing/pricing.service';
import { ErrorCode } from '../common/types/error-codes.enum';

export class DemandCampaignService {
  /**
   * Retrieves campaign details with display status and timeline (Step 16.29 & 16.48)
   */
  public static async getCampaignDetails(id: string) {
    const campaign = await DemandCampaignRepository.findById(id);
    if (!campaign) {
      throw {
        statusCode: 404,
        code: ErrorCode.SERVICE_NOT_FOUND,
        message: 'Demand campaign not found',
      };
    }

    const displayStatus = CampaignStateMachine.getDisplayStatus(campaign.status);

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
      serviceDate: campaign.serviceDate,
      status: campaign.status,
      displayStatus,
      aggregatedQuantity: campaign.aggregatedQuantity,
      currentUnitPrice: pricing.currentPrice,
      startsAt: campaign.startsAt,
      expiresAt: campaign.expiresAt,
      version: campaign.version,
      pricing,
      timeline: {
        createdAt: campaign.createdAt,
        thresholdReachedAt: campaign.thresholdReachedAt || null,
        processingAt: campaign.processingAt || null,
        vendorAssignedAt: campaign.vendorAssignedAt || null,
        scheduledAt: campaign.scheduledAt || null,
        completedAt: campaign.completedAt || null,
        expiredAt: campaign.expiredAt || null,
        cancelledAt: campaign.cancelledAt || null,
      },
    };
  }

  /**
   * Lists campaigns for Customer Discovery or Admin Dashboard
   */
  public static async listCampaigns(filters?: any) {
    const campaigns = await DemandCampaignRepository.findAll(filters);
    return campaigns.map((c) => ({
      ...c,
      displayStatus: CampaignStateMachine.getDisplayStatus(c.status),
    }));
  }

  /**
   * State Machine transition engine (Step 16.46)
   */
  public static async transitionCampaign(id: string, targetStatus: CampaignStatus, adminUserId?: string) {
    const campaign = await DemandCampaignRepository.findById(id);
    if (!campaign) {
      throw {
        statusCode: 404,
        code: ErrorCode.SERVICE_NOT_FOUND,
        message: 'Demand campaign not found',
      };
    }

    // Validate legal state transition via CampaignStateMachine
    if (!CampaignStateMachine.canTransition(campaign.status, targetStatus)) {
      throw {
        statusCode: 400,
        code: ErrorCode.VALIDATION_ERROR,
        message: `Illegal campaign state transition from '${campaign.status}' to '${targetStatus}'.`,
      };
    }

    const updated = await DemandCampaignRepository.updateStatus(id, targetStatus);
    console.log(`📌 [CAMPAIGN STATE TRANSITION] Campaign ${id} transitioned from ${campaign.status} -> ${targetStatus} by ${adminUserId || 'SYSTEM'}`);

    return {
      ...updated,
      displayStatus: CampaignStateMachine.getDisplayStatus(targetStatus),
    };
  }

  /**
   * Admin action: Locks demand and closes campaign for vendor processing (Step 16.21)
   */
  public static async processCampaign(id: string, adminUserId?: string) {
    return this.transitionCampaign(id, 'PROCESSING', adminUserId);
  }

  /**
   * Admin action: Cancels campaign
   */
  public static async cancelCampaign(id: string, reason?: string, adminUserId?: string) {
    return this.transitionCampaign(id, 'CANCELLED', adminUserId);
  }
}
