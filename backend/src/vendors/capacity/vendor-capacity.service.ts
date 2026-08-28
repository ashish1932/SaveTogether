export interface VendorSlotCapacityModel {
  capacity: number;
  reservedCapacity: number;
  bookedCapacity: number;
}

export class VendorCapacityService {
  /**
   * Pure calculation: remainingCapacity = capacity - reservedCapacity - bookedCapacity (Step 23.5)
   */
  public static calculateRemainingCapacity(slot: VendorSlotCapacityModel): number {
    return Math.max(0, slot.capacity - slot.reservedCapacity - slot.bookedCapacity);
  }

  /**
   * Validates if requested quantity can be accommodated
   */
  public static canAccommodate(slot: VendorSlotCapacityModel, requestedQuantity: number): boolean {
    return this.calculateRemainingCapacity(slot) >= requestedQuantity;
  }
}
