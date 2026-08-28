import { VendorCapacityService } from '../capacity/vendor-capacity.service';

export type VendorSlotStatus = 'AVAILABLE' | 'FULL' | 'BLOCKED' | 'CANCELLED';

export interface VendorSlotRecord {
  id: string;
  vendorId: string;
  serviceId: string;
  serviceDate: string;
  timeSlotId: string;
  capacity: number;
  reservedCapacity: number;
  bookedCapacity: number;
  status: VendorSlotStatus;
}

const mockVendorSlotsStore: VendorSlotRecord[] = [
  {
    id: 'vslot_1',
    vendorId: 'vnd_001',
    serviceId: 'srv_ac',
    serviceDate: '2026-09-06',
    timeSlotId: 'MORNING',
    capacity: 30,
    reservedCapacity: 0,
    bookedCapacity: 18,
    status: 'AVAILABLE',
  },
  {
    id: 'vslot_2',
    vendorId: 'vnd_001',
    serviceId: 'srv_ac',
    serviceDate: '2026-09-06',
    timeSlotId: 'AFTERNOON',
    capacity: 30,
    reservedCapacity: 0,
    bookedCapacity: 10,
    status: 'AVAILABLE',
  },
  {
    id: 'vslot_3',
    vendorId: 'vnd_002',
    serviceId: 'srv_cleaning',
    serviceDate: '2026-09-06',
    timeSlotId: 'MORNING',
    capacity: 20,
    reservedCapacity: 0,
    bookedCapacity: 15,
    status: 'AVAILABLE',
  },
];

export class VendorSlotService {
  /**
   * Retrieves or initializes VendorSlot record for (vendorId, serviceId, date, timeSlotId)
   */
  public static async getOrInitializeSlot(
    vendorId: string,
    serviceId: string,
    serviceDate: string,
    timeSlotId: string,
    defaultCapacity = 30
  ): Promise<VendorSlotRecord> {
    let slot = mockVendorSlotsStore.find(
      (s) => s.vendorId === vendorId && s.serviceId === serviceId && s.serviceDate === serviceDate && s.timeSlotId === timeSlotId
    );

    if (!slot) {
      slot = {
        id: `vslot_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        vendorId,
        serviceId,
        serviceDate,
        timeSlotId,
        capacity: defaultCapacity,
        reservedCapacity: 0,
        bookedCapacity: 0,
        status: 'AVAILABLE',
      };
      mockVendorSlotsStore.push(slot);
    }

    return slot;
  }

  public static async findSlotsByVendor(vendorId: string, serviceDate?: string, serviceId?: string): Promise<VendorSlotRecord[]> {
    let list = mockVendorSlotsStore.filter((s) => s.vendorId === vendorId);
    if (serviceDate) list = list.filter((s) => s.serviceDate === serviceDate);
    if (serviceId) list = list.filter((s) => s.serviceId === serviceId);
    return list;
  }

  /**
   * Admin Action: Blocks a vendor slot (Step 23.16)
   */
  public static async blockSlot(vendorId: string, serviceId: string, serviceDate: string, timeSlotId: string): Promise<VendorSlotRecord> {
    const slot = await this.getOrInitializeSlot(vendorId, serviceId, serviceDate, timeSlotId);
    slot.status = 'BLOCKED';
    return slot;
  }

  /**
   * Admin Action: Unblocks a vendor slot (Step 23.16)
   */
  public static async unblockSlot(vendorId: string, serviceId: string, serviceDate: string, timeSlotId: string): Promise<VendorSlotRecord> {
    const slot = await this.getOrInitializeSlot(vendorId, serviceId, serviceDate, timeSlotId);
    const rem = VendorCapacityService.calculateRemainingCapacity(slot);
    slot.status = rem > 0 ? 'AVAILABLE' : 'FULL';
    return slot;
  }

  /**
   * Admin Action: Updates total capacity with Step 23.17 protection against reducing capacity below booked work
   */
  public static async updateSlotCapacity(vendorId: string, serviceId: string, serviceDate: string, timeSlotId: string, newCapacity: number): Promise<VendorSlotRecord> {
    const slot = await this.getOrInitializeSlot(vendorId, serviceId, serviceDate, timeSlotId);
    if (newCapacity < slot.bookedCapacity) {
      throw new Error(`Cannot reduce capacity to ${newCapacity} units. Already booked quantity is ${slot.bookedCapacity} units.`);
    }

    slot.capacity = newCapacity;
    const rem = VendorCapacityService.calculateRemainingCapacity(slot);
    slot.status = rem > 0 ? 'AVAILABLE' : 'FULL';
    return slot;
  }
}
