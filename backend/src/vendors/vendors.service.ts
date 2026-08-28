import { VendorsRepository, LocalVendorRecord } from './vendors.repository';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorPricingDto } from './dto/vendor-pricing.dto';
import { VendorResponseDto } from './responses/vendor-response.dto';
import { VendorSlotService } from './availability/vendor-slot.service';
import { VendorCapacityService } from './capacity/vendor-capacity.service';
import { VendorEligibilityService } from './eligibility/vendor-eligibility.service';
import { ServiceCatalogRepository } from '../service-catalog/service-catalog.repository';
import { ErrorCode } from '../common/types/error-codes.enum';

export class VendorsService {
  public static async createVendor(dto: CreateVendorDto): Promise<VendorResponseDto> {
    const vendor = await VendorsRepository.createVendor(dto);
    return this.getVendorDetails(vendor.id);
  }

  public static async getVendorDetails(id: string): Promise<VendorResponseDto> {
    const vendor = await VendorsRepository.findById(id);
    if (!vendor) {
      throw {
        statusCode: 404,
        code: ErrorCode.SERVICE_NOT_FOUND,
        message: 'Vendor not found',
      };
    }

    const services = await VendorsRepository.getVendorServices(vendor.id);
    const pricing = await VendorsRepository.getVendorPricing(vendor.id);

    return {
      id: vendor.id,
      vendorCode: vendor.vendorCode,
      businessName: vendor.businessName,
      contactName: vendor.contactName,
      phone: vendor.phone,
      email: vendor.email,
      address: vendor.address,
      city: vendor.city,
      state: vendor.state,
      pinCode: vendor.pinCode,
      status: vendor.status,
      notes: vendor.notes,
      services: services.map((s) => ({
        serviceId: s.serviceId,
        serviceName: s.serviceName,
        active: s.active,
      })),
      pricing: pricing.map((p) => ({
        serviceId: p.serviceId,
        price: p.price,
        minQuantity: p.minQuantity,
        maxQuantity: p.maxQuantity,
      })),
      capacity: {
        maxQuantityPerDay: 30,
      },
      performance: {
        rating: 4.8,
        totalJobs: 142,
        completedJobs: 139,
        onTimePercentage: 96.5,
      },
      createdAt: vendor.createdAt,
    };
  }

  public static async listVendors(filters?: any) {
    const list = await VendorsRepository.findAll(filters);
    const results: VendorResponseDto[] = [];
    for (const v of list) {
      results.push(await this.getVendorDetails(v.id));
    }
    return results;
  }

  public static async updateVendor(id: string, dto: UpdateVendorDto): Promise<VendorResponseDto> {
    const updated = await VendorsRepository.updateVendor(id, dto);
    if (!updated) {
      throw {
        statusCode: 404,
        code: ErrorCode.SERVICE_NOT_FOUND,
        message: 'Vendor not found',
      };
    }
    return this.getVendorDetails(updated.id);
  }

  public static async addVendorService(vendorId: string, serviceId: string): Promise<VendorResponseDto> {
    const service = await ServiceCatalogRepository.findServiceById(serviceId, false);
    if (!service) {
      throw {
        statusCode: 404,
        code: ErrorCode.SERVICE_NOT_FOUND,
        message: 'Service not found in catalog',
      };
    }

    await VendorsRepository.addVendorService(vendorId, service.id, service.name);
    return this.getVendorDetails(vendorId);
  }

  public static async setVendorPricing(vendorId: string, dto: VendorPricingDto, adminUserId: string): Promise<VendorResponseDto> {
    const vendor = await VendorsRepository.findById(vendorId);
    if (!vendor) {
      throw {
        statusCode: 404,
        code: ErrorCode.SERVICE_NOT_FOUND,
        message: 'Vendor not found',
      };
    }

    await VendorsRepository.setVendorPricing(
      vendor.id,
      dto.serviceId,
      dto.price,
      dto.minQuantity,
      dto.maxQuantity,
      dto.reason,
      adminUserId
    );

    return this.getVendorDetails(vendor.id);
  }

  public static async getPriceHistory(vendorId: string) {
    return VendorsRepository.getPriceHistory(vendorId);
  }

  // ==========================================
  // AVAILABILITY & CAPACITY OPERATIONS
  // ==========================================

  public static async getVendorAvailability(vendorId: string, date: string, serviceId?: string) {
    const slots = await VendorSlotService.findSlotsByVendor(vendorId, date, serviceId);
    return slots.map((s) => ({
      slotId: s.id,
      timeSlotId: s.timeSlotId,
      serviceDate: s.serviceDate,
      capacity: s.capacity,
      reservedCapacity: s.reservedCapacity,
      bookedCapacity: s.bookedCapacity,
      remainingCapacity: VendorCapacityService.calculateRemainingCapacity(s),
      status: s.status,
    }));
  }

  public static async blockVendorSlot(vendorId: string, serviceId: string, date: string, timeSlotId: string) {
    return VendorSlotService.blockSlot(vendorId, serviceId, date, timeSlotId);
  }

  public static async unblockVendorSlot(vendorId: string, serviceId: string, date: string, timeSlotId: string) {
    return VendorSlotService.unblockSlot(vendorId, serviceId, date, timeSlotId);
  }

  public static async updateVendorCapacity(vendorId: string, serviceId: string, date: string, timeSlotId: string, newCapacity: number) {
    return VendorSlotService.updateSlotCapacity(vendorId, serviceId, date, timeSlotId, newCapacity);
  }

  public static async findEligibleVendors(serviceId: string, date: string, timeSlotId = 'MORNING', quantity = 1) {
    return VendorEligibilityService.findEligibleVendors(serviceId, date, timeSlotId, quantity);
  }
}
