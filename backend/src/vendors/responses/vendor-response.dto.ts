export interface VendorResponseDto {
  id: string;
  vendorCode: string;
  businessName: string;
  contactName: string;
  phone: string;
  email: string | null;
  address: string | null;
  city: string;
  state: string;
  pinCode: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BLOCKED';
  notes: string | null;
  services: {
    serviceId: string;
    serviceName: string;
    active: boolean;
  }[];
  pricing: {
    serviceId: string;
    price: number;
    minQuantity: number;
    maxQuantity: number | null;
  }[];
  capacity: {
    maxQuantityPerDay: number;
  };
  performance: {
    rating: number;
    totalJobs: number;
    completedJobs: number;
    onTimePercentage: number;
  };
  createdAt: string;
}
