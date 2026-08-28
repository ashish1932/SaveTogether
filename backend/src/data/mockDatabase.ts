import {
  User,
  Society,
  Service,
  PricingTier,
  DemandOpportunity,
  Booking,
  PaymentTransaction,
  Vendor,
  ReferralRecord,
  SupportTicket,
  AuditLog,
  AdminUser,
  PlatformSettings
} from '../types';

export const societiesData: Society[] = [
  { id: 'soc_1', name: 'ABC Residency', city: 'Gurugram', address: 'Sector 54, Golf Course Road', totalBlocks: 4, totalFlats: 480, activeUsers: 420, registeredDemandCount: 12, status: 'Active' },
  { id: 'soc_2', name: 'Green Meadows', city: 'Gurugram', address: 'Sector 62, Golf Course Ext', totalBlocks: 6, totalFlats: 650, activeUsers: 315, registeredDemandCount: 8, status: 'Active' },
  { id: 'soc_3', name: 'Lake View Apartments', city: 'Bengaluru', address: 'Whitefield Main Road', totalBlocks: 3, totalFlats: 320, activeUsers: 280, registeredDemandCount: 6, status: 'Active' },
  { id: 'soc_4', name: 'Sunrise Towers', city: 'Gurugram', address: 'Sector 43, DLF Phase 5', totalBlocks: 2, totalFlats: 240, activeUsers: 210, registeredDemandCount: 5, status: 'Active' },
];

export const servicesData: Service[] = [
  { id: 'srv_ac', categoryId: 'cat_home', categoryName: 'Appliance Repair', name: 'AC General Service', description: 'Deep jet wash cleaning & pressure check', unitLabel: 'AC Unit', baseCatalogPrice: 799, iconName: 'ac_unit', isActive: true },
  { id: 'srv_cleaning', categoryId: 'cat_home', categoryName: 'Home Care', name: 'Full Home Deep Cleaning', description: 'Complete 3BHK sanitization & deep scrub', unitLabel: 'Flat/Home', baseCatalogPrice: 999, iconName: 'cleaning_services', isActive: true },
  { id: 'srv_pest', categoryId: 'cat_pest', categoryName: 'Pest Control', name: 'Full Home Pest Control', description: 'Gel & spray treatment for cockroaches', unitLabel: 'Flat/Home', baseCatalogPrice: 999, iconName: 'bug_report', isActive: true },
  { id: 'srv_car', categoryId: 'cat_vehicle', categoryName: 'Vehicle Wash', name: 'Car Wash & Polish', description: 'Exterior foam wash & interior vacuum', unitLabel: 'Car', baseCatalogPrice: 599, iconName: 'directions_car', isActive: true },
  { id: 'srv_ro', categoryId: 'cat_home', categoryName: 'Water Filter', name: 'RO Water Purifier Service', description: 'Filter replacement & TDS calibration', unitLabel: 'RO Unit', baseCatalogPrice: 699, iconName: 'water_drop', isActive: true },
];

export const pricingTiersData: PricingTier[] = [
  { id: 'tier_ac_1', serviceId: 'srv_ac', minQty: 1, maxQty: 9, pricePerUnit: 799, tierLabel: '1–9 Units (Catalog Standard)' },
  { id: 'tier_ac_2', serviceId: 'srv_ac', minQty: 10, maxQty: 19, pricePerUnit: 699, tierLabel: '10–19 Units (Society Tier 1)' },
  { id: 'tier_ac_3', serviceId: 'srv_ac', minQty: 20, maxQty: 39, pricePerUnit: 599, tierLabel: '20–39 Units (Society Tier 2)' },
  { id: 'tier_ac_4', serviceId: 'srv_ac', minQty: 40, maxQty: 59, pricePerUnit: 549, tierLabel: '40–59 Units (Society Tier 3)' },
  { id: 'tier_ac_5', serviceId: 'srv_ac', minQty: 60, pricePerUnit: 499, tierLabel: '60+ Units (Maximum Bulk Tier)' },
];

export const demandOpportunitiesData: DemandOpportunity[] = [
  { id: 'dmd_101', societyId: 'soc_1', societyName: 'ABC Residency', serviceId: 'srv_ac', serviceName: 'AC General Service', totalAggregatedQty: 27, currentTierPrice: 599, nextTierTarget: 40, nextTierPrice: 549, potentialSavingsPerUnit: 250, participantsCount: 18, status: 'AGGREGATING', expiryDate: 'Tomorrow, 08:00 PM' },
  { id: 'dmd_102', societyId: 'soc_2', societyName: 'Green Meadows', serviceId: 'srv_cleaning', serviceName: 'Full Home Deep Cleaning', totalAggregatedQty: 14, currentTierPrice: 799, nextTierTarget: 20, nextTierPrice: 699, potentialSavingsPerUnit: 300, participantsCount: 14, status: 'AGGREGATING', expiryDate: 'In 2 days' },
  { id: 'dmd_103', societyId: 'soc_1', societyName: 'ABC Residency', serviceId: 'srv_car', serviceName: 'Car Wash & Polish', totalAggregatedQty: 45, currentTierPrice: 449, nextTierTarget: 60, nextTierPrice: 399, potentialSavingsPerUnit: 200, participantsCount: 32, status: 'THRESHOLD_REACHED', expiryDate: 'Completed' },
];

export const usersData: User[] = [
  { id: 'usr_1', name: 'Ashish Kumar', phone: '+919876543210', email: 'ashish@example.com', societyId: 'soc_1', societyName: 'ABC Residency', address: 'Tower B - Flat 402, ABC Residency', referralCode: 'ASHISH50', walletBalance: 50, status: 'Active', createdAt: '2026-08-01' },
  { id: 'usr_2', name: 'Rahul Kumar', phone: '+919812345678', email: 'rahul@example.com', societyId: 'soc_1', societyName: 'ABC Residency', address: 'Tower A - Flat 104, ABC Residency', referralCode: 'RAHUL50', walletBalance: 100, status: 'Active', createdAt: '2026-08-05' },
  { id: 'usr_3', name: 'Priya Sharma', phone: '+919899988877', email: 'priya@example.com', societyId: 'soc_2', societyName: 'Green Meadows', address: 'Villa 12, Green Meadows', referralCode: 'PRIYA50', walletBalance: 0, status: 'Active', createdAt: '2026-08-10' },
];

export const bookingsData: Booking[] = [
  { id: 'BK10245', userId: 'usr_1', userName: 'Ashish Kumar', userPhone: '+919876543210', serviceId: 'srv_ac', serviceName: 'AC General Service', societyId: 'soc_1', societyName: 'ABC Residency', address: 'Tower B - Flat 402, ABC Residency', quantity: 2, unitLabel: 'AC Unit', baseUnitPrice: 799, appliedUnitPrice: 599, totalPrice: 1198, savingsAmount: 400, scheduledDate: '2026-08-29', timeWindow: '10:00 AM - 01:00 PM', status: 'SCHEDULED', assignedVendorId: 'vnd_1', assignedVendorName: 'CoolCare Services Pvt Ltd', createdAt: '2026-08-27' },
  { id: 'BK10244', userId: 'usr_2', userName: 'Rahul Kumar', userPhone: '+919812345678', serviceId: 'srv_ac', serviceName: 'AC General Service', societyId: 'soc_1', societyName: 'ABC Residency', address: 'Tower A - Flat 104, ABC Residency', quantity: 1, unitLabel: 'AC Unit', baseUnitPrice: 799, appliedUnitPrice: 599, totalPrice: 599, savingsAmount: 200, scheduledDate: '2026-08-29', timeWindow: '10:00 AM - 01:00 PM', status: 'ASSIGNED', assignedVendorId: 'vnd_1', assignedVendorName: 'CoolCare Services Pvt Ltd', createdAt: '2026-08-27' },
];

export const paymentsData: PaymentTransaction[] = [
  { id: 'TXN1001', bookingId: 'BK10245', userId: 'usr_1', userName: 'Ashish Kumar', amount: 1198, gatewayTxnId: 'pay_PZ8921827419', paymentMethod: 'UPI', status: 'SUCCESS', settlementStatus: 'PENDING', createdAt: '2026-08-27 10:15 AM' },
  { id: 'TXN1002', bookingId: 'BK10244', userId: 'usr_2', userName: 'Rahul Kumar', amount: 599, gatewayTxnId: 'pay_PZ8921827420', paymentMethod: 'Card', status: 'SUCCESS', settlementStatus: 'PENDING', createdAt: '2026-08-27 11:30 AM' },
];

export const vendorsData: Vendor[] = [
  { id: 'vnd_1', name: 'CoolCare Services Pvt Ltd', phone: '+919800011122', services: ['AC General Service'], capacityPerDay: 30, negotiatedRatePerUnit: 450, rating: 4.8, totalJobs: 184, status: 'Active' },
  { id: 'vnd_2', name: 'AquaFix Solutions', phone: '+919800033344', services: ['RO Water Purifier Service'], capacityPerDay: 25, negotiatedRatePerUnit: 420, rating: 4.7, totalJobs: 142, status: 'Active' },
  { id: 'vnd_3', name: 'CleanPro Services', phone: '+919800055566', services: ['Full Home Deep Cleaning'], capacityPerDay: 15, negotiatedRatePerUnit: 510, rating: 4.6, totalJobs: 126, status: 'Active' },
];

export const referralsData: ReferralRecord[] = [
  { id: 'REF1001', referrerUserId: 'usr_2', referrerName: 'Rahul Kumar', referredUserId: 'usr_1', referredName: 'Ashish Kumar', qualifyingBookingId: 'BK10245', rewardAmount: 50, status: 'QUALIFIED', createdAt: '2026-08-27' },
];

export const supportTicketsData: SupportTicket[] = [
  { id: 'TKT1001', bookingId: 'BK10245', userId: 'usr_1', userName: 'Ashish Kumar', userPhone: '+919876543210', category: 'Quality', description: 'Technician reached on time but water pressure jet was weak.', status: 'IN_PROGRESS', slaDeadline: 'In 18 mins', adminNotes: ['Called customer, offered free reinspection.'], createdAt: '2026-08-27 11:00 AM' },
];

export const auditLogsData: AuditLog[] = [
  { id: 'AL10245', timestamp: 'Today, 11:42 AM', adminName: 'Ashish Kumar', module: 'Pricing Rules', action: 'Tier Price Updated', beforeVal: '20–39 Units: ₹599', afterVal: '20–39 Units: ₹549', status: 'Success' },
];

export const adminUsersData: AdminUser[] = [
  { id: 'ADM1001', name: 'Ashish Kumar', email: 'ashish.admin@savetogether.in', role: 'Super Admin', requiresTwoFactor: true, status: 'Active' },
  { id: 'ADM1002', name: 'Rahul Kumar', email: 'rahul.support@savetogether.in', role: 'Support', requiresTwoFactor: true, status: 'Active' },
  { id: 'ADM1003', name: 'Priya Sharma', email: 'priya.finance@savetogether.in', role: 'Finance', requiresTwoFactor: true, status: 'Active' },
];

export const platformSettingsData: PlatformSettings = {
  appName: 'SaveTogether',
  tagline: 'Save More. Together.',
  supportEmail: 'support@savetogether.in',
  supportPhone: '+91 98765 43210',
  currency: 'INR (₹)',
  timezone: 'Asia/Kolkata',
  maintenanceMode: false,
  minBookingQty: 1,
  maxBookingQty: 10,
  cancellationWindowHours: 12,
  demandAggregationEnabled: true,
};
