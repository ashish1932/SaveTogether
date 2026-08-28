import { SettingCategory } from './dto/update-settings.dto';

export interface LocalSettingRecord {
  id: string;
  category: SettingCategory;
  version: number;
  configuration: Record<string, any>;
  effectiveFrom: string;
  effectiveTo: string | null;
  isActive: boolean;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

const mockSettingsStore: LocalSettingRecord[] = [
  {
    id: 'set_1001',
    category: 'GENERAL',
    version: 1,
    configuration: {
      platformName: 'SaveTogether India',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      supportEmail: 'support@savetogether.in',
      maintenanceMode: false,
    },
    effectiveFrom: '2026-08-01T00:00:00Z',
    effectiveTo: null,
    isActive: true,
    createdBy: 'ADM1001',
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'set_1002',
    category: 'BUSINESS',
    version: 1,
    configuration: {
      minimumBookingQuantity: 1,
      maximumBookingQuantity: 10,
      campaignExpirationHours: 48,
      reviewWindowHours: 48,
    },
    effectiveFrom: '2026-08-01T00:00:00Z',
    effectiveTo: null,
    isActive: true,
    createdBy: 'ADM1001',
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'set_1003',
    category: 'PRICING',
    version: 1,
    configuration: {
      srv_ac: [
        { minQuantity: 1, maxQuantity: 4, price: 799 },
        { minQuantity: 5, maxQuantity: 9, price: 699 },
        { minQuantity: 10, maxQuantity: 19, price: 599 },
        { minQuantity: 20, maxQuantity: 50, price: 499 },
      ],
    },
    effectiveFrom: '2026-08-01T00:00:00Z',
    effectiveTo: null,
    isActive: true,
    createdBy: 'ADM1001',
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'set_1004',
    category: 'PAYMENT',
    version: 1,
    configuration: {
      provider: 'RAZORPAY',
      timeoutSeconds: 900,
      minimumOrderAmount: 100,
    },
    effectiveFrom: '2026-08-01T00:00:00Z',
    effectiveTo: null,
    isActive: true,
    createdBy: 'ADM1001',
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'set_1005',
    category: 'REFUND',
    version: 1,
    configuration: {
      cancellationPolicy: {
        above48HoursPct: 100,
        within24To48HoursPct: 75,
        below24HoursPct: 50,
      },
    },
    effectiveFrom: '2026-08-01T00:00:00Z',
    effectiveTo: null,
    isActive: true,
    createdBy: 'ADM1001',
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'set_1006',
    category: 'REFERRAL',
    version: 1,
    configuration: {
      referrerRewardAmount: 50,
      referredUserBonusAmount: 50,
      qualificationRequirement: 'FIRST_BOOKING_COMPLETED',
    },
    effectiveFrom: '2026-08-01T00:00:00Z',
    effectiveTo: null,
    isActive: true,
    createdBy: 'ADM1001',
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'set_1007',
    category: 'NOTIFICATION',
    version: 1,
    configuration: {
      pushEnabled: true,
      smsEnabled: true,
      emailEnabled: true,
    },
    effectiveFrom: '2026-08-01T00:00:00Z',
    effectiveTo: null,
    isActive: true,
    createdBy: 'ADM1001',
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z',
  },
];

export class SettingsRepository {
  public static async getActiveByCategory(category: SettingCategory): Promise<LocalSettingRecord | undefined> {
    return mockSettingsStore.find((s) => s.category === category && s.isActive);
  }

  public static async getAllActive(): Promise<LocalSettingRecord[]> {
    return mockSettingsStore.filter((s) => s.isActive);
  }

  public static async findCategoryVersions(category: SettingCategory): Promise<LocalSettingRecord[]> {
    return mockSettingsStore.filter((s) => s.category === category);
  }

  public static async createNewVersion(data: {
    category: SettingCategory;
    configuration: Record<string, any>;
    effectiveFrom?: string;
    createdBy?: string;
  }): Promise<LocalSettingRecord> {
    const existingActive = mockSettingsStore.find((s) => s.category === data.category && s.isActive);

    const nextVersion = existingActive ? existingActive.version + 1 : 1;
    const now = new Date().toISOString();

    // Deactivate previous active version
    if (existingActive) {
      existingActive.isActive = false;
      existingActive.effectiveTo = data.effectiveFrom || now;
      existingActive.updatedAt = now;
    }

    const id = `set_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const newRecord: LocalSettingRecord = {
      id,
      category: data.category,
      version: nextVersion,
      configuration: data.configuration,
      effectiveFrom: data.effectiveFrom || now,
      effectiveTo: null,
      isActive: true,
      createdBy: data.createdBy || null,
      createdAt: now,
      updatedAt: now,
    };

    mockSettingsStore.push(newRecord);
    return newRecord;
  }
}
