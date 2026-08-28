import { VendorNegotiationRepository, LocalNegotiationRecord, LocalNegotiationOfferRecord } from './vendor-negotiations.repository';
import { CreateNegotiationSessionDto } from './dto/create-negotiation.dto';
import { AddNegotiationOfferDto } from './dto/add-offer.dto';
import { NegotiationResponseDto, NegotiationOfferResponseDto } from './responses/negotiation-response.dto';
import { DemandRepository } from '../demand/demand.repository';
import { VendorsRepository } from '../vendors/vendors.repository';
import { ErrorCode } from '../common/types/error-codes.enum';

export class VendorNegotiationsService {
  /**
   * Starts a new negotiation session with INITIAL quote (Step 25.6)
   */
  public static async startNegotiation(campaignId: string, dto: CreateNegotiationSessionDto, adminUserId: string): Promise<NegotiationResponseDto> {
    const campaign = await DemandRepository.findCampaignById(campaignId);
    if (!campaign) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'Demand Campaign not found',
      };
    }

    const vendor = await VendorsRepository.findById(dto.vendorId);
    if (!vendor) {
      throw {
        statusCode: 404,
        code: ErrorCode.SERVICE_NOT_FOUND,
        message: 'Vendor not found',
      };
    }

    const quantity = campaign.aggregatedQuantity || 1;

    const { session } = await VendorNegotiationRepository.createNegotiationSession({
      vendorId: vendor.id,
      vendorCode: vendor.vendorCode,
      businessName: vendor.businessName,
      campaignId: campaign.id,
      quantity,
      initialRate: dto.unitRate,
      notes: dto.notes,
      createdBy: adminUserId,
    });

    return this.getNegotiationById(session.id);
  }

  /**
   * Appends an immutable offer to the negotiation history (Step 25.8 & 25.26)
   */
  public static async addOffer(negotiationId: string, dto: AddNegotiationOfferDto, adminUserId: string): Promise<NegotiationResponseDto> {
    const session = await VendorNegotiationRepository.findById(negotiationId);
    if (!session) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'Negotiation session not found',
      };
    }

    if (session.status !== 'OPEN') {
      throw {
        statusCode: 400,
        code: ErrorCode.VALIDATION_ERROR,
        message: `Cannot append offer to a negotiation with status '${session.status}'`,
      };
    }

    await VendorNegotiationRepository.addOffer({
      negotiationId: session.id,
      offerType: dto.offerType,
      unitRate: dto.unitRate,
      quantity: session.quantity,
      notes: dto.notes,
      createdBy: adminUserId,
    });

    return this.getNegotiationById(session.id);
  }

  /**
   * Accepts final offer and locks rate for vendor assignment (Step 25.14 & 25.15)
   */
  public static async acceptNegotiation(negotiationId: string, offerId?: string, adminUserId = 'SYSTEM'): Promise<NegotiationResponseDto> {
    const session = await VendorNegotiationRepository.findById(negotiationId);
    if (!session) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'Negotiation session not found',
      };
    }

    const offers = await VendorNegotiationRepository.findOffersByNegotiationId(session.id);
    let targetOffer = offerId ? offers.find((o) => o.id === offerId) : offers[offers.length - 1];

    if (!targetOffer) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'Negotiation offer record not found',
      };
    }

    // Step 25.15: Server derives rate directly from targetOffer.unitRate
    await VendorNegotiationRepository.updateSessionStatus(session.id, 'ACCEPTED', targetOffer.id);
    return this.getNegotiationById(session.id);
  }

  /**
   * Rejects negotiation session
   */
  public static async rejectNegotiation(negotiationId: string): Promise<NegotiationResponseDto> {
    const session = await VendorNegotiationRepository.findById(negotiationId);
    if (!session) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'Negotiation session not found',
      };
    }

    await VendorNegotiationRepository.updateSessionStatus(session.id, 'REJECTED');
    return this.getNegotiationById(session.id);
  }

  public static async getNegotiationById(id: string): Promise<NegotiationResponseDto> {
    const session = await VendorNegotiationRepository.findById(id);
    if (!session) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'Negotiation session not found',
      };
    }

    const offers = await VendorNegotiationRepository.findOffersByNegotiationId(session.id);
    const finalOffer = offers.find((o) => o.id === session.finalOfferId) || offers[offers.length - 1];

    return {
      id: session.id,
      negotiationNumber: session.negotiationNumber,
      vendorId: session.vendorId,
      vendorCode: session.vendorCode,
      businessName: session.businessName,
      campaignId: session.campaignId,
      quantity: session.quantity,
      status: session.status,
      finalOfferId: session.finalOfferId,
      finalRate: finalOffer ? finalOffer.unitRate : null,
      offers: offers.map(this.toOfferDto),
      createdBy: session.createdBy,
      createdAt: session.createdAt,
    };
  }

  public static async getCampaignNegotiations(campaignId: string): Promise<NegotiationResponseDto[]> {
    const list = await VendorNegotiationRepository.findByCampaignId(campaignId);
    const results: NegotiationResponseDto[] = [];
    for (const s of list) {
      results.push(await this.getNegotiationById(s.id));
    }
    return results;
  }

  private static toOfferDto(o: LocalNegotiationOfferRecord): NegotiationOfferResponseDto {
    return {
      id: o.id,
      offerType: o.offerType,
      unitRate: o.unitRate,
      quantity: o.quantity,
      totalAmount: o.totalAmount,
      notes: o.notes,
      createdBy: o.createdBy,
      createdAt: o.createdAt,
    };
  }
}
