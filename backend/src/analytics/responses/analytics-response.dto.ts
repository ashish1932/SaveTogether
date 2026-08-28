export interface AnalyticsOverviewResponseDto {
  totalUsers: number;
  totalBookings: number;
  activeDemandCampaigns: number;
  grossRevenue: number;
  platformCommission: number;
  totalCustomerSavings: number;
}

export interface RevenueReportResponseDto {
  grossRevenue: number;
  refunds: number;
  vendorCost: number;
  netRevenue: number;
  platformCommission: number;
  customerSavings: number;
  series: Array<{
    date: string;
    revenue: number;
    commission: number;
  }>;
}

export interface BookingReportResponseDto {
  total: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  pendingPayment: number;
  trend: Array<{
    date: string;
    bookings: number;
    completed: number;
    cancelled: number;
  }>;
}

export interface ServicePerformanceReportDto {
  serviceId: string;
  serviceName: string;
  bookingsCount: number;
  totalQuantity: number;
  grossRevenue: number;
  averageRating: number;
  cancellationRate: number;
  customerSavings: number;
}

export interface SocietyPerformanceReportDto {
  societyId: string;
  societyName: string;
  registeredUsers: number;
  totalBookings: number;
  activeCampaigns: number;
  grossRevenue: number;
  customerSavings: number;
}

export interface VendorPerformanceReportDto {
  vendorId: string;
  vendorName: string;
  assignedJobs: number;
  completedJobs: number;
  completionRate: number;
  capacityUtilization: number;
  averageRating: number;
  averageNegotiatedRate: number;
}

export interface CustomerSavingsReportDto {
  totalSavingsAmount: number;
  averageSavingsPerBooking: number;
  topSavingsService: string;
  topSavingsSociety: string;
}

export interface ReferralFunnelReportDto {
  invitedCount: number;
  registeredCount: number;
  bookedCount: number;
  completedCount: number;
  rewardedCount: number;
  conversionRate: number;
}

export interface CancellationReportDto {
  totalCancellations: number;
  cancellationRate: number;
  totalRefundedAmount: number;
  breakdownByReason: Record<string, number>;
}
