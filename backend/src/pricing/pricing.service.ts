import { PricingRepository } from './pricing.repository';
import { PricingEngine } from './engines/pricing-engine';
import { PricingQuoteDto } from './dto/pricing-quote.dto';
import { CreatePricingTierDto } from './dto/create-pricing-tier.dto';
import { PricingQuoteResponseDto } from './responses/pricing-quote-response.dto';
import { ServiceCatalogRepository } from '../service-catalog/service-catalog.repository';
import { SocietiesRepository } from '../societies/societies.repository';
import { ErrorCode } from '../common/types/error-codes.enum';

export class PricingService {
  /**
   * Calculates pricing quote based on service, society, and aggregated community demand (Step 14.3 & 14.13)
   */
  public static async getPricingQuote(dto: PricingQuoteDto): Promise<PricingQuoteResponseDto> {
    // Validate Service is ACTIVE
    const service = await ServiceCatalogRepository.findServiceById(dto.serviceId, false);
    if (!service) {
      throw {
        statusCode: 404,
        code: ErrorCode.SERVICE_NOT_FOUND,
        message: 'Service is currently unavailable or inactive',
      };
    }

    // Validate Society is ACTIVE
    const society = await SocietiesRepository.findById(dto.societyId, false);
    if (!society) {
      throw {
        statusCode: 404,
        code: ErrorCode.SOCIETY_NOT_FOUND,
        message: 'Society is currently unavailable or inactive',
      };
    }

    // Fetch active tiers for service
    const tiers = await PricingRepository.findTiersByServiceId(dto.serviceId);
    if (!tiers || tiers.length === 0) {
      throw {
        statusCode: 400,
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Pricing tiers have not been configured for this service',
      };
    }

    // Step 14.13 & 14.16: Determine aggregated community demand for (serviceId + societyId)
    const existingCommunityQuantity = await PricingRepository.getExistingCommunityDemand(dto.serviceId, dto.societyId);

    const basePrice = Number(service.baseCatalogPrice || 799);

    // Compute pricing quote via pure PricingEngine
    return PricingEngine.calculateQuote({
      serviceId: dto.serviceId,
      societyId: dto.societyId,
      userQuantity: dto.quantity,
      existingCommunityQuantity,
      basePrice,
      tiers,
    });
  }

  /**
   * Retrieves tier matrix for Admin Panel
   */
  public static async getAdminTiers(serviceId: string) {
    return PricingRepository.findTiersByServiceId(serviceId);
  }

  /**
   * Creates a new pricing tier (Admin Panel) with overlap and gap validation
   */
  public static async createAdminTier(dto: CreatePricingTierDto) {
    const existingTiers = await PricingRepository.findTiersByServiceId(dto.serviceId);
    const candidateTiers = [...existingTiers, dto];

    // Step 14.30 - 14.32: Validate no overlaps or gaps
    const val = PricingEngine.validateTierMatrix(candidateTiers);
    if (!val.isValid) {
      throw {
        statusCode: 400,
        code: ErrorCode.VALIDATION_ERROR,
        message: val.error || 'Invalid pricing tier configuration',
      };
    }

    return PricingRepository.createTier(dto);
  }
}
