export interface LocalVendorRecord {
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
  createdAt: string;
}

export interface LocalVendorServiceRecord {
  id: string;
  vendorId: string;
  serviceId: string;
  serviceName: string;
  active: boolean;
}

export interface LocalVendorPricingRecord {
  id: string;
  vendorId: string;
  serviceId: string;
  price: number;
  minQuantity: number;
  maxQuantity: number | null;
  active: boolean;
}

export interface LocalVendorPriceHistoryRecord {
  id: string;
  vendorId: string;
  serviceId: string;
  oldPrice: number | null;
  newPrice: number;
  reason: string;
  changedBy: string;
  createdAt: string;
}

const mockVendorsStore: LocalVendorRecord[] = [
  {
    id: 'vnd_001',
    vendorCode: 'VEN-00001',
    businessName: 'CoolCare Services',
    contactName: 'Rajesh Kumar',
    phone: '+919876543210',
    email: 'coolcare@vendor.local',
    address: '12 Mount Road',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pinCode: '600001',
    status: 'ACTIVE',
    notes: 'Premium AC service provider',
    createdAt: '2026-08-01',
  },
  {
    id: 'vnd_002',
    vendorCode: 'VEN-00002',
    businessName: 'Sparkle Home Cleaners',
    contactName: 'Priya Sharma',
    phone: '+919876543211',
    email: 'sparkle@vendor.local',
    address: '45 Anna Salai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pinCode: '600002',
    status: 'ACTIVE',
    notes: 'Specializes in deep cleaning & pest control',
    createdAt: '2026-08-01',
  },
];

const mockVendorServicesStore: LocalVendorServiceRecord[] = [
  { id: 'vs_1', vendorId: 'vnd_001', serviceId: 'srv_ac', serviceName: 'AC General Service', active: true },
  { id: 'vs_2', vendorId: 'vnd_002', serviceId: 'srv_cleaning', serviceName: 'Full Home Deep Cleaning', active: true },
];

const mockVendorPricingStore: LocalVendorPricingRecord[] = [
  { id: 'vp_1', vendorId: 'vnd_001', serviceId: 'srv_ac', price: 580, minQuantity: 1, maxQuantity: null, active: true },
  { id: 'vp_2', vendorId: 'vnd_002', serviceId: 'srv_cleaning', price: 750, minQuantity: 1, maxQuantity: null, active: true },
];

const mockPriceHistoryStore: LocalVendorPriceHistoryRecord[] = [];

export class VendorsRepository {
  public static async createVendor(data: {
    businessName: string;
    contactName: string;
    phone: string;
    email?: string;
    address?: string;
    city: string;
    state?: string;
    pinCode?: string;
    notes?: string;
  }): Promise<LocalVendorRecord> {
    const id = `vnd_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const vendorCode = `VEN-${Math.floor(10000 + Math.random() * 90000)}`;

    const vendor: LocalVendorRecord = {
      id,
      vendorCode,
      businessName: data.businessName,
      contactName: data.contactName,
      phone: data.phone,
      email: data.email || null,
      address: data.address || null,
      city: data.city,
      state: data.state || 'Tamil Nadu',
      pinCode: data.pinCode || '600001',
      status: 'ACTIVE',
      notes: data.notes || null,
      createdAt: new Date().toISOString().split('T')[0],
    };

    mockVendorsStore.push(vendor);
    return vendor;
  }

  public static async findById(id: string): Promise<LocalVendorRecord | undefined> {
    return mockVendorsStore.find((v) => v.id === id || v.vendorCode === id);
  }

  public static async findAll(filters?: { search?: string; status?: string; city?: string }): Promise<LocalVendorRecord[]> {
    let items = mockVendorsStore;
    if (filters?.status) items = items.filter((v) => v.status === filters.status);
    if (filters?.city) items = items.filter((v) => v.city.toLowerCase().includes(filters.city!.toLowerCase()));
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (v) =>
          v.businessName.toLowerCase().includes(q) ||
          v.contactName.toLowerCase().includes(q) ||
          v.vendorCode.toLowerCase().includes(q)
      );
    }
    return items;
  }

  public static async updateVendor(id: string, data: Partial<LocalVendorRecord>): Promise<LocalVendorRecord | undefined> {
    const vendor = await this.findById(id);
    if (!vendor) return undefined;

    Object.assign(vendor, data);
    return vendor;
  }

  public static async getVendorServices(vendorId: string): Promise<LocalVendorServiceRecord[]> {
    return mockVendorServicesStore.filter((vs) => vs.vendorId === vendorId);
  }

  public static async addVendorService(vendorId: string, serviceId: string, serviceName: string): Promise<LocalVendorServiceRecord> {
    const existing = mockVendorServicesStore.find((vs) => vs.vendorId === vendorId && vs.serviceId === serviceId);
    if (existing) {
      existing.active = true;
      return existing;
    }

    const rec: LocalVendorServiceRecord = {
      id: `vs_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      vendorId,
      serviceId,
      serviceName,
      active: true,
    };
    mockVendorServicesStore.push(rec);
    return rec;
  }

  public static async getVendorPricing(vendorId: string): Promise<LocalVendorPricingRecord[]> {
    return mockVendorPricingStore.filter((vp) => vp.vendorId === vendorId);
  }

  /**
   * Step 22.12: Atomic updates to vendor pricing with Price History logging
   */
  public static async setVendorPricing(
    vendorId: string,
    serviceId: string,
    price: number,
    minQuantity = 1,
    maxQuantity: number | null = null,
    reason = 'Rate update',
    adminUserId = 'SYSTEM'
  ): Promise<LocalVendorPricingRecord> {
    let pricing = mockVendorPricingStore.find((vp) => vp.vendorId === vendorId && vp.serviceId === serviceId);
    const oldPrice = pricing ? pricing.price : null;

    if (!pricing) {
      pricing = {
        id: `vp_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        vendorId,
        serviceId,
        price,
        minQuantity,
        maxQuantity,
        active: true,
      };
      mockVendorPricingStore.push(pricing);
    } else {
      pricing.price = price;
      pricing.minQuantity = minQuantity;
      pricing.maxQuantity = maxQuantity;
    }

    // Save Price History (Step 22.12 & 22.13)
    mockPriceHistoryStore.push({
      id: `vph_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      vendorId,
      serviceId,
      oldPrice,
      newPrice: price,
      reason,
      changedBy: adminUserId,
      createdAt: new Date().toISOString(),
    });

    return pricing;
  }

  public static async getPriceHistory(vendorId: string): Promise<LocalVendorPriceHistoryRecord[]> {
    return mockPriceHistoryStore.filter((vph) => vph.vendorId === vendorId);
  }
}
