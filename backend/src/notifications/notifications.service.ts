import { NotificationsRepository, LocalNotificationRecord } from './notifications.repository';
import { NotificationListResponseDto, NotificationItemDto, UserDeviceResponseDto, NotificationPreferenceResponseDto, NotificationType } from './responses/notification-response.dto';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { UpdateNotificationPreferenceDto } from './dto/update-preference.dto';
import { ErrorCode } from '../common/types/error-codes.enum';

export class NotificationsService {
  /**
   * Assembles customer In-App Notification Center list & unread count (Step 28.19 - 28.21)
   */
  public static async getUserNotifications(userId: string): Promise<NotificationListResponseDto> {
    const list = await NotificationsRepository.findByUserId(userId);
    const unreadCount = list.filter((n) => !n.readAt).length;

    return {
      unreadCount,
      items: list.map(this.toDto),
    };
  }

  public static async getNotificationById(id: string, userId: string): Promise<NotificationItemDto> {
    const notification = await NotificationsRepository.findById(id);
    if (!notification || notification.userId !== userId) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'Notification not found',
      };
    }
    return this.toDto(notification);
  }

  public static async markAsRead(id: string, userId: string): Promise<NotificationItemDto> {
    const updated = await NotificationsRepository.markAsRead(id, userId);
    if (!updated) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'Notification not found',
      };
    }
    return this.toDto(updated);
  }

  public static async markAllAsRead(userId: string): Promise<{ success: boolean; message: string }> {
    await NotificationsRepository.markAllAsRead(userId);
    return {
      success: true,
      message: 'All notifications marked as read',
    };
  }

  // Device Management APIs (Step 28.8 & 28.9)
  public static async registerDevice(userId: string, dto: RegisterDeviceDto): Promise<UserDeviceResponseDto> {
    const dev = await NotificationsRepository.registerDevice({
      userId,
      deviceId: dto.deviceId,
      fcmToken: dto.fcmToken,
      platform: dto.platform || 'ANDROID',
      appVersion: dto.appVersion || '1.0.0',
    });

    return {
      id: dev.id,
      userId: dev.userId,
      deviceId: dev.deviceId,
      platform: dev.platform,
      isActive: dev.isActive,
      lastSeenAt: dev.lastSeenAt,
    };
  }

  public static async removeDevice(userId: string, deviceId: string): Promise<{ success: boolean }> {
    const success = await NotificationsRepository.deactivateDevice(userId, deviceId);
    return { success };
  }

  // Notification Preferences APIs (Step 28.28 & 28.29)
  public static async getPreferences(userId: string): Promise<NotificationPreferenceResponseDto> {
    return NotificationsRepository.getPreferences(userId);
  }

  public static async updatePreferences(userId: string, dto: UpdateNotificationPreferenceDto): Promise<NotificationPreferenceResponseDto> {
    return NotificationsRepository.updatePreferences(userId, dto);
  }

  /**
   * Event-Driven Notification Dispatcher (Step 28.1 - 28.15)
   * Dispatches notifications asynchronously without blocking callers.
   */
  public static async dispatchNotificationEvent(event: {
    userId: string;
    type: NotificationType;
    referenceType?: string;
    referenceId?: string;
    eventKey?: string;
    customTitle?: string;
    customMessage?: string;
    metadata?: Record<string, any>;
  }): Promise<NotificationItemDto | null> {
    const pref = await NotificationsRepository.getPreferences(event.userId);

    // Preference filters
    if (!pref.pushEnabled) return null;
    if (event.type.startsWith('BOOKING_') && !pref.bookingUpdates) return null;
    if (event.type.startsWith('PAYMENT_') && !pref.paymentUpdates) return null;
    if (event.type.startsWith('REFERRAL_') && !pref.rewardUpdates) return null;

    // Step 28.12: Template engine fallback
    const { title, message } = this.resolveTemplate(event);

    const record = await NotificationsRepository.createNotification({
      userId: event.userId,
      type: event.type,
      title: event.customTitle || title,
      message: event.customMessage || message,
      referenceType: event.referenceType,
      referenceId: event.referenceId,
      eventKey: event.eventKey,
    });

    // Step 28.15: Async FCM dispatch simulation to user devices
    const devices = await NotificationsRepository.getUserDevices(event.userId);
    if (devices.length > 0) {
      console.log(`🚀 [FCM PUSH DISPATCH] Sent to ${devices.length} devices for user ${event.userId}: "${record.title}"`);
    }

    return this.toDto(record);
  }

  private static resolveTemplate(event: { type: NotificationType; metadata?: Record<string, any>; referenceId?: string }): { title: string; message: string } {
    const m = event.metadata || {};
    const ref = event.referenceId || '';

    switch (event.type) {
      case 'BOOKING_CONFIRMED':
        return {
          title: 'Booking Confirmed!',
          message: `Your booking #${ref} has been confirmed. Thank you for booking with SaveTogether!`,
        };
      case 'PAYMENT_SUCCESS':
        return {
          title: 'Payment Successful',
          message: `Your payment of ₹${m.amount || ''} for booking #${ref} was processed successfully.`,
        };
      case 'PRICE_DROPPED':
        return {
          title: 'Community Price Dropped! 🎉',
          message: `AC Service price for your society dropped to ₹${m.newPrice || '599'} per unit!`,
        };
      case 'NEXT_TIER_REACHED':
        return {
          title: 'New Bulk Tier Reached! 🚀',
          message: `Congratulations! Your society reached ${m.quantity || ''} units, unlocking lower pricing.`,
        };
      case 'VENDOR_ASSIGNED':
        return {
          title: 'Service Partner Assigned',
          message: `Vendor ${m.vendorName || 'CoolCare Services'} has been assigned to your booking #${ref}.`,
        };
      case 'SERVICE_COMPLETED':
        return {
          title: 'Service Completed',
          message: `Your service booking #${ref} is complete. Please rate your service experience!`,
        };
      case 'REFERRAL_REWARD':
        return {
          title: 'Referral Bonus Credited! 🎁',
          message: `₹50 referral bonus has been added to your SaveTogether Rewards Wallet.`,
        };
      default:
        return {
          title: 'SaveTogether Update',
          message: `Notification update for booking #${ref}`,
        };
    }
  }

  private static toDto(n: LocalNotificationRecord): NotificationItemDto {
    return {
      id: n.id,
      notificationNumber: n.notificationNumber,
      userId: n.userId,
      type: n.type,
      title: n.title,
      message: n.message,
      status: n.status,
      referenceType: n.referenceType,
      referenceId: n.referenceId,
      read: !!n.readAt,
      readAt: n.readAt,
      createdAt: n.createdAt,
    };
  }
}
