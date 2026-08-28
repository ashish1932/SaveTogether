export interface AdminDashboardMetricsDto {
  totalBookings: number;
  completedBookings: number;
  grossRevenue: number;
  customerSavings: number;
  totalUsers: number;
  activeSocieties: number;
  totalVendors: number;
  openComplaints: number;
  publishedReviews: number;
}

export interface AdminDashboardResponseDto {
  metrics: AdminDashboardMetricsDto;
  recentAuditLogs: Array<{
    id: string;
    adminName: string;
    action: string;
    targetEntity: string;
    targetId: string;
    createdAt: string;
  }>;
}
