export type NotificationType =
  | 'BOOKING_CONFIRMED'
  | 'PAYMENT_SUCCESS'
  | 'PRICE_DROPPED'
  | 'NEXT_TIER_REACHED'
  | 'SERVICE_REMINDER'
  | 'VENDOR_ASSIGNED'
  | 'SERVICE_COMPLETED'
  | 'REFERRAL_REWARD'
  | 'REFUND_COMPLETED'
  | 'COMPLAINT_UPDATED'
  | 'BOOKING_CANCELLED'
  | 'PAYMENT_FAILED'
  | 'BOOKING_RESCHEDULED';

export type NotificationStatus = 'CREATED' | 'QUEUED' | 'SENT' | 'FAILED';

export interface NotificationItemDto {
  id: string;
  notificationNumber: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  referenceType: string | null;
  referenceId: string | null;
  read: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationListResponseDto {
  unreadCount: number;
  items: NotificationItemDto[];
}

export interface UserDeviceResponseDto {
  id: string;
  userId: string;
  deviceId: string;
  platform: string;
  isActive: boolean;
  lastSeenAt: string;
}

export interface NotificationPreferenceResponseDto {
  userId: string;
  pushEnabled: boolean;
  bookingUpdates: boolean;
  paymentUpdates: boolean;
  rewardUpdates: boolean;
  promotionalUpdates: boolean;
}
