import { VendorAssignmentRepository, LocalVendorAssignmentRecord } from './vendor-assignment.repository';
import { AssignVendorDto } from './dto/assign-vendor.dto';
import { CreateNegotiationDto } from './dto/negotiation.dto';
import { VendorAssignmentResponseDto } from './responses/assignment-response.dto';
import { DemandRepository } from '../demand/demand.repository';
import { VendorsRepository } from '../vendors/vendors.repository';
import { VendorSlotService } from '../vendors/availability/vendor-slot.service';
import { VendorEligibilityService } from '../vendors/eligibility/vendor-eligibility.service';
import { BookingsRepository } from '../bookings/bookings.repository';
import { BookingsService } from '../bookings/bookings.service';
import { ErrorCode } from '../common/types/error-codes.enum';

export class VendorAssignmentService {
  /**
   * Returns eligible vendor candidate options for a campaign (Step 24.7)
   */
  public static async getVendorOptions(campaignId: string) {
    const campaign = await DemandRepository.findCampaignById(campaignId);
    if (!campaign) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'Demand Campaign not found',
      };
    }

    const serviceDate = campaign.serviceDate || '2026-09-06';
    const quantity = campaign.aggregatedQuantity || 1;

    return VendorEligibilityService.findEligibleVendors(campaign.serviceId, serviceDate, 'MORNING', quantity);
  }

  /**
   * Saves a negotiated rate entry for a vendor candidate (Step 24.9)
   */
  public static async createNegotiation(campaignId: string, dto: CreateNegotiationDto, adminUserId: string) {
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

    const pricingList = await VendorsRepository.getVendorPricing(vendor.id);
    const pricing = pricingList.find((p) => p.serviceId === campaign.serviceId);
    const initialRate = pricing ? pricing.price : 600;

    return VendorAssignmentRepository.createNegotiation({
      vendorId: vendor.id,
      campaignId: campaign.id,
      quantity: campaign.aggregatedQuantity || 1,
      initialRate,
      negotiatedRate: dto.negotiatedRate,
      notes: dto.notes,
      createdBy: adminUserId,
    });
  }

  /**
   * Atomic Vendor Assignment Transaction (Step 24.14 - 24.17 & 24.37)
   */
  public static async assignVendorToCampaign(campaignId: string, dto: AssignVendorDto, adminUserId: string): Promise<VendorAssignmentResponseDto> {
    const campaign = await DemandRepository.findCampaignById(campaignId);
    if (!campaign) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'Demand Campaign not found',
      };
    }

    // Step 24.35: One Campaign -> One Vendor Assignment Enforcement
    const existing = await VendorAssignmentRepository.findByCampaignId(campaignId);
    if (existing) {
      throw {
        statusCode: 400,
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Vendor has already been assigned to this campaign',
      };
    }

    const vendor = await VendorsRepository.findById(dto.vendorId);
    if (!vendor || vendor.status !== 'ACTIVE') {
      throw {
        statusCode: 400,
        code: ErrorCode.SERVICE_NOT_FOUND,
        message: 'Vendor is invalid or inactive',
      };
    }

    const serviceDate = campaign.serviceDate || '2026-09-06';
    const quantity = campaign.aggregatedQuantity || 1;

    // Check rate: Priority -> DTO negotiatedRate -> Saved Negotiation -> Vendor Catalog Pricing
    let agreedUnitRate = dto.negotiatedRate;
    if (!agreedUnitRate) {
      const negotiations = await VendorAssignmentRepository.findNegotiationsByCampaign(campaign.id);
      const neg = negotiations.find((n) => n.vendorId === vendor.id);
      if (neg) agreedUnitRate = neg.negotiatedRate;
    }
    if (!agreedUnitRate) {
      const pricingList = await VendorsRepository.getVendorPricing(vendor.id);
      const p = pricingList.find((pr) => pr.serviceId === campaign.serviceId);
      agreedUnitRate = p ? p.price : 580;
    }

    // Reserve capacity on VendorSlot
    const slot = await VendorSlotService.getOrInitializeSlot(vendor.id, campaign.serviceId, serviceDate, dto.timeSlotId || 'MORNING');
    const remaining = slot.capacity - slot.reservedCapacity - slot.bookedCapacity;

    if (slot.status === 'BLOCKED' || remaining < quantity) {
      throw {
        statusCode: 400,
        code: ErrorCode.VALIDATION_ERROR,
        message: `Insufficient vendor slot capacity. (${remaining} available < ${quantity} required)`,
      };
    }

    // Lock capacity reservation
    slot.reservedCapacity += quantity;

    // Create Assignment record with price snapshot (Step 24.4)
    const assignment = await VendorAssignmentRepository.createAssignment({
      vendorId: vendor.id,
      vendorCode: vendor.vendorCode,
      businessName: vendor.businessName,
      campaignId: campaign.id,
      societyId: campaign.societyId,
      societyName: campaign.societyName,
      serviceId: campaign.serviceId,
      serviceName: campaign.serviceName,
      quantity,
      serviceDate,
      timeSlotId: dto.timeSlotId || 'MORNING',
      agreedUnitRate,
      assignedBy: adminUserId,
    });

    return this.toResponseDto(assignment);
  }

  /**
   * Confirms Vendor Assignment, Commits Capacity, & Updates Linked Bookings (Step 24.20 & 24.21)
   */
  public static async confirmAssignment(assignmentId: string, adminUserId: string): Promise<VendorAssignmentResponseDto> {
    const assignment = await VendorAssignmentRepository.findById(assignmentId);
    if (!assignment) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'Vendor assignment record not found',
      };
    }

    if (assignment.status === 'CONFIRMED') {
      return this.toResponseDto(assignment);
    }

    // Commit Vendor Capacity (Step 23.19: reserved -> booked)
    const slot = await VendorSlotService.getOrInitializeSlot(
      assignment.vendorId,
      assignment.serviceId,
      assignment.serviceDate,
      assignment.timeSlotId
    );
    slot.reservedCapacity = Math.max(0, slot.reservedCapacity - assignment.quantity);
    slot.bookedCapacity += assignment.quantity;

    // Update assignment status
    const confirmed = await VendorAssignmentRepository.updateStatus(assignment.id, 'CONFIRMED');

    // Update Campaign state to VENDOR_ASSIGNED
    const campaign = await DemandRepository.findCampaignById(assignment.campaignId);
    if (campaign) {
      (campaign as any).status = 'VENDOR_ASSIGNED';
    }

    // Update linked bookings to VENDOR_ASSIGNED (Step 24.21 & 24.23)
    const allBookings = await BookingsRepository.findAll();
    const campaignBookings = allBookings.filter((b) => (b as any).campaignId === assignment.campaignId);

    for (const b of campaignBookings) {
      if (b.status !== 'CANCELLED') {
        await BookingsService.transitionStatus(b.id, 'VENDOR_ASSIGNED', 'ADMIN', adminUserId, `Assigned to ${assignment.businessName}`);
      }
    }

    return this.toResponseDto(confirmed!);
  }

  public static async getAssignmentById(id: string): Promise<VendorAssignmentResponseDto> {
    const assignment = await VendorAssignmentRepository.findById(id);
    if (!assignment) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'Vendor assignment record not found',
      };
    }
    return this.toResponseDto(assignment);
  }

  public static async listAssignments() {
    const list = await VendorAssignmentRepository.findAll();
    return list.map(this.toResponseDto);
  }

  private static toResponseDto(a: LocalVendorAssignmentRecord): VendorAssignmentResponseDto {
    return {
      id: a.id,
      assignmentNumber: a.assignmentNumber,
      vendorId: a.vendorId,
      vendorCode: a.vendorCode,
      businessName: a.businessName,
      campaignId: a.campaignId,
      societyId: a.societyId,
      societyName: a.societyName,
      serviceId: a.serviceId,
      serviceName: a.serviceName,
      quantity: a.quantity,
      serviceDate: a.serviceDate,
      timeSlotId: a.timeSlotId,
      agreedUnitRate: a.agreedUnitRate,
      totalVendorCost: a.totalVendorCost,
      status: a.status,
      assignedBy: a.assignedBy,
      confirmedAt: a.confirmedAt,
      createdAt: a.createdAt,
    };
  }
}
