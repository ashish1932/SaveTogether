import { societiesData } from '../data/mockDatabase';
import { Society } from '../types';

export class SocietiesRepository {
  public static async findAll(options: { search?: string; city?: string; pincode?: string; status?: string; page?: number; limit?: number; isAdmin?: boolean }) {
    let items = societiesData;

    // Step 11.13 Filter out inactive societies for normal customer requests
    if (!options.isAdmin) {
      items = items.filter((s) => s.status.toUpperCase() === 'ACTIVE' || s.status.toUpperCase() === 'ACTIVE');
    } else if (options.status) {
      items = items.filter((s) => s.status.toUpperCase() === options.status!.toUpperCase());
    }

    if (options.city) {
      items = items.filter((s) => s.city.toLowerCase() === options.city!.toLowerCase());
    }

    if (options.search) {
      const q = options.search.toLowerCase();
      items = items.filter((s) => s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q) || s.address.toLowerCase().includes(q));
    }

    const page = options.page || 1;
    const limit = options.limit || 20;
    const total = items.length;
    const paginated = items.slice((page - 1) * limit, page * limit);

    return {
      items: paginated,
      total,
      page,
      limit,
    };
  }

  public static async findById(id: string, isAdmin = false): Promise<Society | undefined> {
    const soc = societiesData.find((s) => s.id === id);
    if (!soc) return undefined;
    if (!isAdmin && soc.status.toUpperCase() !== 'ACTIVE') {
      return undefined;
    }
    return soc;
  }

  public static async findDuplicate(name: string, city: string, pincode: string): Promise<Society | undefined> {
    return societiesData.find(
      (s) => s.name.toLowerCase() === name.toLowerCase() && s.city.toLowerCase() === city.toLowerCase()
    );
  }

  public static async create(data: { name: string; address: string; city: string; state?: string; pincode: string; latitude?: number; longitude?: number; totalBlocks?: number; totalFlats?: number }): Promise<Society> {
    const newId = `soc_${Date.now()}`;
    const newSoc: Society = {
      id: newId,
      name: data.name,
      address: data.address,
      city: data.city,
      totalBlocks: data.totalBlocks || 4,
      totalFlats: data.totalFlats || 120,
      activeUsers: 0,
      registeredDemandCount: 0,
      status: 'Active',
    };
    societiesData.unshift(newSoc);
    return newSoc;
  }

  public static async update(id: string, updates: Record<string, any>): Promise<Society | undefined> {
    const soc = societiesData.find((s) => s.id === id);
    if (!soc) return undefined;

    if (updates.name) soc.name = updates.name;
    if (updates.address) soc.address = updates.address;
    if (updates.city) soc.city = updates.city;
    if (updates.status) soc.status = updates.status === 'ACTIVE' ? 'Active' : 'Pending';

    return soc;
  }

  public static async softDelete(id: string): Promise<boolean> {
    const soc = societiesData.find((s) => s.id === id);
    if (!soc) return false;
    soc.status = 'Pending'; // Deactivated / Inactive
    return true;
  }
}
