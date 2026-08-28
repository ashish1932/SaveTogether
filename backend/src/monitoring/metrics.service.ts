export interface TechnicalMetricsDto {
  apiUptimeSeconds: number;
  requestCountTotal: number;
  errorRate5xxPct: number;
  p95LatencyMs: number;
  activeDbConnections: number;
  redisMemoryUsageMb: number;
  queueStatus: {
    waitingJobs: number;
    activeJobs: number;
    failedJobs: number;
  };
}

export interface BusinessMetricsDto {
  totalBookings: number;
  paymentSuccessRatePct: number;
  pendingRefundsCount: number;
  activeDemandCampaigns: number;
  referralRewardVelocityPerHour: number;
  totalCustomerSavingsAmount: number;
}

export interface SystemAlertDto {
  id: string;
  severity: 'P0_CRITICAL' | 'P1_HIGH' | 'P2_MEDIUM' | 'P3_LOW';
  category: 'API' | 'DATABASE' | 'PAYMENT' | 'QUEUE' | 'SECURITY' | 'BUSINESS';
  title: string;
  message: string;
  timestamp: string;
}

export class MetricsService {
  public static async getTechnicalMetrics(): Promise<TechnicalMetricsDto> {
    return {
      apiUptimeSeconds: Math.floor(process.uptime()),
      requestCountTotal: 14205,
      errorRate5xxPct: 0.02,
      p95LatencyMs: 145,
      activeDbConnections: 8,
      redisMemoryUsageMb: 24.5,
      queueStatus: {
        waitingJobs: 2,
        activeJobs: 1,
        failedJobs: 0,
      },
    };
  }

  public static async getBusinessMetrics(): Promise<BusinessMetricsDto> {
    return {
      totalBookings: 2,
      paymentSuccessRatePct: 98.5,
      pendingRefundsCount: 0,
      activeDemandCampaigns: 2,
      referralRewardVelocityPerHour: 5,
      totalCustomerSavingsAmount: 600,
    };
  }

  public static async getActiveSystemAlerts(): Promise<SystemAlertDto[]> {
    return [
      {
        id: 'alt_1001',
        severity: 'P3_LOW',
        category: 'BUSINESS',
        title: 'High Demand Threshold Approaching',
        message: 'ABC Residency AC Service campaign reached 18 ACs (2 units away from ₹599 tier discount)',
        timestamp: new Date().toISOString(),
      },
    ];
  }
}
