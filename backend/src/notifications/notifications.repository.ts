import { NotificationType, NotificationStatus } from './responses/notification-response.dto';

export interface LocalNotificationRecord {
  id: string;
  notificationNumber: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  referenceType: string | null;
  referenceId: string | null;
  eventKey: string | null; // Step 28.27: Event Key for duplicate prevention
  readAt: string | null;
  createdAt: string;
}

export interface LocalUserDeviceRecord {
  id: string;
  userId: string;
  deviceId: string;
  fcmToken: string;
  platform: string;
  appVersion: string;
  isActive: boolean;
  lastSeenAt: string;
}

export interface LocalNotificationPreferenceRecord {
  userId: string;
  pushEnabled: boolean;
  bookingUpdates: boolean;
  paymentUpdates: boolean;
  rewardUpdates: boolean;
  promotionalUpdates: boolean;
}

const mockNotificationsStore: LocalNotificationRecord[] = [
  {
    id: 'nt_1001',
    notificationNumber: 'NT-000101',
    userId: 'usr_1',
    type: 'BOOKING_CONFIRMED',
    title: 'Booking Confirmed!',
    message: 'Your AC General Service booking #BK10245 has been confirmed for Sector 54, Golf Course Road.',
    status: 'SENT',
    referenceType: 'Booking',
    referenceId: 'BK10245',
    eventKey: 'BOOKING_CONFIRMED:BK10245',
    readAt: null,
    createdAt: '2026-08-27T10:15:00Z',
  },
  {
    id: 'nt_1002',
    notificationNumber: 'NT-000102',
    userId: 'usr_1',
    type: 'PRICE_DROPPED',
    title: 'Community Price Dropped! 🎉',
    message: 'Great news! AC Service price for ABC Residency dropped from ₹699 to ₹599 per AC.',
    status: 'SENT',
    referenceType: 'Campaign',
    referenceId: 'dmd_101',
    eventKey: 'PRICE_DROPPED:dmd_101:599',
    readAt: '2026-08-27T11:00:00Z',
    createdAt: '2026-08-27T10:45:00Z',
  },
];

const mockDevicesStore: LocalUserDeviceRecord[] = [];
const mockPreferencesStore: LocalNotificationPreferenceRecord[] = [
  {
    userId: 'usr_1',
    pushEnabled: true,
    bookingUpdates: true,
    paymentUpdates: true,
    rewardUpdates: true,
    promotionalUpdates: true,
  },
];

export class NotificationsRepository {
  public static async createNotification(data: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    referenceType?: string;
    referenceId?: string;
    eventKey?: string;
  }): Promise<LocalNotificationRecord> {
    // Step 28.27: Duplicate Event Key check
    if (data.eventKey) {
      const existing = mockNotificationsStore.find((n) => n.eventKey === data.eventKey);
      if (existing) {
        return existing;
      }
    }

    const id = `nt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const notificationNumber = `NT-${Math.floor(100000 + Math.random() * 900000)}`;

    const record: LocalNotificationRecord = {
      id,
      notificationNumber,
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      status: 'SENT',
      referenceType: data.referenceType || null,
      referenceId: data.referenceId || null,
      eventKey: data.eventKey || null,
      readAt: null,
      createdAt: new Date().toISOString(),
    };

    mockNotificationsStore.unshift(record);
    return record;
  }

  public static async findByUserId(userId: string): Promise<LocalNotificationRecord[]> {
    return mockNotificationsStore.filter((n) => n.userId === userId);
  }

  public static async findById(id: string): Promise<LocalNotificationRecord | undefined> {
    return mockNotificationsStore.find((n) => n.id === id || n.notificationNumber === id);
  }

  public static async markAsRead(id: string, userId: string): Promise<LocalNotificationRecord | undefined> {
    const item = mockNotificationsStore.find((n) => n.id === id && n.userId === userId);
    if (item) {
      item.readAt = new Date().toISOString();
    }
    return item;
  }

  public static async markAllAsRead(userId: string): Promise<void> {
    const list = mockNotificationsStore.filter((n) => n.userId === userId && !n.readAt);
    const now = new Date().toISOString();
    for (const item of list) {
      item.readAt = now;
    }
  }

  // Device registration (Step 28.8)
  public static async registerDevice(data: {
    userId: string;
    deviceId: string;
    fcmToken: string;
    platform: string;
    appVersion: string;
  }): Promise<LocalUserDeviceRecord> {
    let device = mockDevicesStore.find((d) => d.userId === data.userId && d.deviceId === data.deviceId);

    if (device) {
      device.fcmToken = data.fcmToken;
      device.platform = data.platform;
      device.appVersion = data.appVersion;
      device.isActive = true;
      device.lastSeenAt = new Date().toISOString();
    } else {
      device = {
        id: `dev_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        userId: data.userId,
        deviceId: data.deviceId,
        fcmToken: data.fcmToken,
        platform: data.platform,
        appVersion: data.appVersion,
        isActive: true,
        lastSeenAt: new Date().toISOString(),
      };
      mockDevicesStore.push(device);
    }

    return device;
  }

  public static async deactivateDevice(userId: string, deviceId: string): Promise<boolean> {
    const device = mockDevicesStore.find((d) => d.userId === userId && d.deviceId === deviceId);
    if (device) {
      device.isActive = false;
      return true;
    }
    return false;
  }

  public static async getUserDevices(userId: string): Promise<LocalUserDeviceRecord[]> {
    return mockDevicesStore.filter((d) => d.userId === userId && d.isActive);
  }

  // Notification Preferences (Step 28.28 & 28.29)
  public static async getPreferences(userId: string): Promise<LocalNotificationPreferenceRecord> {
    let pref = mockPreferencesStore.find((p) => p.userId === userId);
    if (!pref) {
      pref = {
        userId,
        pushEnabled: true,
        bookingUpdates: true,
        paymentUpdates: true,
        rewardUpdates: true,
        promotionalUpdates: true,
      };
      mockPreferencesStore.push(pref);
    }
    return pref;
  }

  public static async updatePreferences(userId: string, updates: Partial<LocalNotificationPreferenceRecord>): Promise<LocalNotificationPreferenceRecord> {
    const pref = await this.getPreferences(userId);
    Object.assign(pref, updates);
    return pref;
  }
}
