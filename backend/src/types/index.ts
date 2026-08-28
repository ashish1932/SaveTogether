export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  societyId?: string;
  societyName?: string;
  address?: string;
  referralCode: string;
  referredBy?: string;
  walletBalance: number;
  rewardsBalance?: number;
  status: 'Active' | 'Blocked' | 'ACTIVE' | 'BLOCKED' | 'SUSPENDED' | 'DELETED';
  createdAt: string;
}

export interface Society {
  id: string;
  name: string;
  city: string;
  address: string;
  totalBlocks: number;
  totalFlats: number;
  activeUsers: number;
  registeredDemandCount: number;
  status: 'Active' | 'Pending';
}

export interface Service {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  unitLabel: string;
  baseCatalogPrice: number;
  iconName: string;
  isActive: boolean;
}

export interface PricingTier {
  id: string;
  serviceId: string;
  minQty: number;
  maxQty?: number;
  pricePerUnit: number;
  tierLabel: string;
}

export interface DemandOpportunity {
  id: string;
  societyId: string;
  societyName: string;
  serviceId: string;
  serviceName: string;
  totalAggregatedQty: number;
  currentTierPrice: number;
  nextTierTarget: number;
  nextTierPrice: number;
  potentialSavingsPerUnit: number;
  participantsCount: number;
  status: 'AGGREGATING' | 'THRESHOLD_REACHED' | 'ASSIGNED' | 'EXPIRED';
  expiryDate: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  serviceId: string;
  serviceName: string;
  societyId: string;
  societyName: string;
  address: string;
  quantity: number;
  unitLabel: string;
  baseUnitPrice: number;
  appliedUnitPrice: number;
  totalPrice: number;
  savingsAmount: number;
  scheduledDate: string;
  timeWindow: string;
  status: 'CREATED' | 'PAYMENT_PENDING' | 'AGGREGATING' | 'ASSIGNED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  assignedVendorId?: string;
  assignedVendorName?: string;
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  amount: number;
  gatewayTxnId: string;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Wallet';
  status: 'SUCCESS' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
  settlementStatus: 'PENDING' | 'SETTLED';
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  phone: string;
  services: string[];
  capacityPerDay: number;
  negotiatedRatePerUnit: number;
  rating: number;
  totalJobs: number;
  status: 'Active' | 'Inactive';
}

export interface ReferralRecord {
  id: string;
  referrerUserId: string;
  referrerName: string;
  referredUserId: string;
  referredName: string;
  qualifyingBookingId?: string;
  rewardAmount: number;
  status: 'PENDING' | 'QUALIFIED' | 'HOLD' | 'PAID';
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  userPhone: string;
  category: 'Quality' | 'Delay' | 'Billing' | 'Vendor Behaviour' | 'Other';
  description: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  slaDeadline: string;
  adminNotes?: string[];
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  module: string;
  action: string;
  beforeVal?: string;
  afterVal?: string;
  status: 'Success' | 'Failed';
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Operations' | 'Support' | 'Finance' | 'Marketing';
  requiresTwoFactor: boolean;
  status: 'Active' | 'Inactive';
}

export interface PlatformSettings {
  appName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  currency: string;
  timezone: string;
  maintenanceMode: boolean;
  minBookingQty: number;
  maxBookingQty: number;
  cancellationWindowHours: number;
  demandAggregationEnabled: boolean;
}
