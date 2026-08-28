export interface LocalAddressRecord {
  id: string;
  userId: string;
  societyId: string;
  societyName: string;
  houseNo: string;
  blockNo: string;
  street?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
  deletedAt?: string;
  createdAt: string;
}

const mockAddressesStore: LocalAddressRecord[] = [
  {
    id: 'addr_1',
    userId: 'usr_1',
    societyId: 'soc_1',
    societyName: 'ABC Residency',
    houseNo: '402',
    blockNo: 'Block A',
    street: 'Sector 54 Main Road',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600001',
    landmark: 'Near Main Security Gate',
    isDefault: true,
    createdAt: '2026-08-28',
  },
  {
    id: 'addr_2',
    userId: 'usr_1',
    societyId: 'soc_2',
    societyName: 'Green Meadows',
    houseNo: '104',
    blockNo: 'Tower B',
    street: 'Park Avenue',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600002',
    landmark: 'Opposite Community Club',
    isDefault: false,
    createdAt: '2026-08-28',
  },
];

export class AddressesRepository {
  /**
   * Step 12.5 & 12.32: Finds all non-deleted addresses owned strictly by userId
   */
  public static async findManyByUserId(userId: string): Promise<LocalAddressRecord[]> {
    return mockAddressesStore.filter((a) => a.userId === userId && !a.deletedAt);
  }

  /**
   * Scoped query: WHERE id = addressId AND userId = userId AND deletedAt IS NULL
   */
  public static async findByIdAndUserId(addressId: string, userId: string): Promise<LocalAddressRecord | undefined> {
    return mockAddressesStore.find((a) => a.id === addressId && a.userId === userId && !a.deletedAt);
  }

  /**
   * Creates address for userId
   */
  public static async create(userId: string, data: { societyId: string; societyName: string; flatNumber: string; building: string; street?: string; landmark?: string; city: string; state: string; pincode: string; isDefault: boolean }): Promise<LocalAddressRecord> {
    const userAddresses = await this.findManyByUserId(userId);
    const isFirst = userAddresses.length === 0;
    const isDefault = isFirst || data.isDefault;

    if (isDefault) {
      userAddresses.forEach((a) => (a.isDefault = false));
    }

    const newAddr: LocalAddressRecord = {
      id: `addr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      userId,
      societyId: data.societyId,
      societyName: data.societyName,
      houseNo: data.flatNumber,
      blockNo: data.building,
      street: data.street || '',
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      landmark: data.landmark || '',
      isDefault,
      createdAt: new Date().toISOString().split('T')[0],
    };

    mockAddressesStore.unshift(newAddr);
    return newAddr;
  }

  /**
   * Updates address owned by userId
   */
  public static async updateByIdAndUserId(addressId: string, userId: string, updates: Record<string, any>): Promise<LocalAddressRecord | undefined> {
    const addr = await this.findByIdAndUserId(addressId, userId);
    if (!addr) return undefined;

    if (updates.flatNumber) addr.houseNo = updates.flatNumber;
    if (updates.building) addr.blockNo = updates.building;
    if (updates.street !== undefined) addr.street = updates.street;
    if (updates.landmark !== undefined) addr.landmark = updates.landmark;
    if (updates.societyId) addr.societyId = updates.societyId;

    return addr;
  }

  /**
   * Sets default address in a single transactional step (Step 12.20 & 12.21)
   */
  public static async setDefaultAddress(addressId: string, userId: string): Promise<LocalAddressRecord | undefined> {
    const target = await this.findByIdAndUserId(addressId, userId);
    if (!target) return undefined;

    const userAddresses = await this.findManyByUserId(userId);
    userAddresses.forEach((a) => {
      a.isDefault = a.id === addressId;
    });

    return target;
  }

  /**
   * Soft deletes address owned by userId (Step 12.25 & 12.27)
   */
  public static async softDeleteByIdAndUserId(addressId: string, userId: string): Promise<boolean> {
    const addr = await this.findByIdAndUserId(addressId, userId);
    if (!addr) return false;

    const wasDefault = addr.isDefault;
    addr.deletedAt = new Date().toISOString();
    addr.isDefault = false;

    // Step 12.27: Auto promote next active address to default
    if (wasDefault) {
      const remaining = await this.findManyByUserId(userId);
      if (remaining.length > 0) {
        remaining[0].isDefault = true;
      }
    }

    return true;
  }
}
