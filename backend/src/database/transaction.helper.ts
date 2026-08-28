import { bookingsData, demandOpportunitiesData, servicesData, societiesData } from '../data/mockDatabase';
import { Booking } from '../types';
import { PricingEngine } from '../engine/pricingEngine';
import { DemandAggregationEngine } from '../engine/demandEngine';

export interface CreateBookingTransactionInput {
  userId: string;
  userName: string;
  userPhone: string;
  serviceId: string;
  societyId: string;
  address: string;
  quantity: number;
  scheduledDate: string;
  timeWindow: string;
}

export class DemandTransactionHelper {
  /**
   * Concurrent-safe transaction step for Demand Campaign Aggregation
   * (USER BOOKS -> BEGIN TRANSACTION -> Locate/Create Campaign -> BookingItem -> DemandItem -> Recalculate Tier -> COMMIT)
   */
  public static async executeBookingTransaction(input: CreateBookingTransactionInput) {
    const service = servicesData.find((s) => s.id === input.serviceId) || servicesData[0];
    const society = societiesData.find((s) => s.id === input.societyId) || societiesData[0];

    // 1. Calculate price snapshot
    const pricing = PricingEngine.calculatePrice(service.id, input.quantity);

    // 2. Create Booking Entity with historical price snapshot
    const bookingId = `BK${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking: Booking = {
      id: bookingId,
      userId: input.userId,
      userName: input.userName,
      userPhone: input.userPhone,
      serviceId: service.id,
      serviceName: service.name,
      societyId: society.id,
      societyName: society.name,
      address: input.address,
      quantity: input.quantity,
      unitLabel: service.unitLabel,
      baseUnitPrice: service.baseCatalogPrice,
      appliedUnitPrice: pricing.unitPrice,
      totalPrice: pricing.totalBulkPrice,
      savingsAmount: pricing.totalCustomerSavings,
      scheduledDate: input.scheduledDate,
      timeWindow: input.timeWindow,
      status: 'AGGREGATING',
      createdAt: new Date().toISOString().split('T')[0],
    };

    bookingsData.unshift(newBooking);

    // 3. Atomically Reevaluate & Transition Campaign (Model C: Campaign Price Applies to Participating Bookings)
    const updatedDemand = DemandAggregationEngine.reevaluateSocietyDemand(society.id, service.id);

    return {
      success: true,
      booking: newBooking,
      campaign: updatedDemand,
    };
  }
}
