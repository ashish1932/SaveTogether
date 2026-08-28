import { VendorsRepository } from '../vendors.repository';
import { VendorSlotService } from '../availability/vendor-slot.service';
import { VendorCapacityService } from '../capacity/vendor-capacity.service';

export interface EligibleVendorCandidate {
  vendorId: string;
  vendorCode: string;
  businessName: string;
  rating: number;
  negotiatedPrice: number;
  slotId: string;
  totalCapacity: number;
  bookedCapacity: number;
  reservedCapacity: number;
  remainingCapacity: number;
  isEligible: boolean;
  rejectionReason?: string;
}

export class VendorEligibilityService {
  /**
   * Filters all candidate vendors for a Demand Campaign based on availability, capacity & service support (Step 23.11 & 23.41)
   */
  public static async findEligibleVendors(
    serviceId: string,
    serviceDate: string,
    timeSlotId = 'MORNING',
    requestedQuantity = 1
  ): Promise<EligibleVendorCandidate[]> {
    const allVendors = await VendorsRepository.findAll({ status: 'ACTIVE' });
    const candidates: EligibleVendorCandidate[] = [];

    for (const vendor of allVendors) {
      const services = await VendorsRepository.getVendorServices(vendor.id);
      const supportsService = services.some((s) => s.serviceId === serviceId && s.active);

      if (!supportsService) {
        candidates.push({
          vendorId: vendor.id,
          vendorCode: vendor.vendorCode,
          businessName: vendor.businessName,
          rating: 4.8,
          negotiatedPrice: 0,
          slotId: '',
          totalCapacity: 0,
          bookedCapacity: 0,
          reservedCapacity: 0,
          remainingCapacity: 0,
          isEligible: false,
          rejectionReason: `Vendor does not provide service '${serviceId}'`,
        });
        continue;
      }

      const pricingList = await VendorsRepository.getVendorPricing(vendor.id);
      const pricing = pricingList.find((p) => p.serviceId === serviceId);
      const negotiatedPrice = pricing ? pricing.price : 600;

      const slot = await VendorSlotService.getOrInitializeSlot(vendor.id, serviceId, serviceDate, timeSlotId);
      const remainingCapacity = VendorCapacityService.calculateRemainingCapacity(slot);

      if (slot.status === 'BLOCKED') {
        candidates.push({
          vendorId: vendor.id,
          vendorCode: vendor.vendorCode,
          businessName: vendor.businessName,
          rating: 4.8,
          negotiatedPrice,
          slotId: slot.id,
          totalCapacity: slot.capacity,
          bookedCapacity: slot.bookedCapacity,
          reservedCapacity: slot.reservedCapacity,
          remainingCapacity,
          isEligible: false,
          rejectionReason: `Vendor slot is BLOCKED on ${serviceDate}`,
        });
        continue;
      }

      if (remainingCapacity < requestedQuantity) {
        candidates.push({
          vendorId: vendor.id,
          vendorCode: vendor.vendorCode,
          businessName: vendor.businessName,
          rating: 4.8,
          negotiatedPrice,
          slotId: slot.id,
          totalCapacity: slot.capacity,
          bookedCapacity: slot.bookedCapacity,
          reservedCapacity: slot.reservedCapacity,
          remainingCapacity,
          isEligible: false,
          rejectionReason: `Insufficient remaining capacity (${remainingCapacity} available < ${requestedQuantity} required)`,
        });
        continue;
      }

      // Eligible candidate!
      candidates.push({
        vendorId: vendor.id,
        vendorCode: vendor.vendorCode,
        businessName: vendor.businessName,
        rating: 4.8,
        negotiatedPrice,
        slotId: slot.id,
        totalCapacity: slot.capacity,
        bookedCapacity: slot.bookedCapacity,
        reservedCapacity: slot.reservedCapacity,
        remainingCapacity,
        isEligible: true,
      });
    }

    return candidates;
  }
}
