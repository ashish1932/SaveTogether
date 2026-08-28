import { servicesData } from '../data/mockDatabase';
import { Service } from '../types';

export interface LocalCategoryRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  sortOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
  deletedAt?: string;
}

const mockCategoriesStore: LocalCategoryRecord[] = [
  { id: 'cat_home', name: 'Appliance Repair', slug: 'appliance-repair', description: 'AC, RO & Appliance Servicing', iconName: 'build', sortOrder: 1, status: 'ACTIVE' },
  { id: 'cat_pest', name: 'Pest Control', slug: 'pest-control', description: 'Cockroach, Termite & Bedbug Treatments', iconName: 'bug_report', sortOrder: 2, status: 'ACTIVE' },
  { id: 'cat_vehicle', name: 'Vehicle Cleaning', slug: 'vehicle-cleaning', description: 'Car Wash & Polish Services', iconName: 'directions_car', sortOrder: 3, status: 'ACTIVE' },
  { id: 'cat_cleaning', name: 'Home Deep Cleaning', slug: 'home-cleaning', description: 'Full Home & Kitchen Deep Scrub', iconName: 'cleaning_services', sortOrder: 4, status: 'ACTIVE' },
];

export class ServiceCatalogRepository {
  // ==========================================
  // CATEGORY REPOSITORY
  // ==========================================

  public static async findAllCategories(isAdmin = false): Promise<LocalCategoryRecord[]> {
    if (!isAdmin) {
      return mockCategoriesStore.filter((c) => c.status === 'ACTIVE' && !c.deletedAt).sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return mockCategoriesStore.filter((c) => !c.deletedAt).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public static async findCategoryById(id: string, isAdmin = false): Promise<LocalCategoryRecord | undefined> {
    const cat = mockCategoriesStore.find((c) => c.id === id && !c.deletedAt);
    if (!cat) return undefined;
    if (!isAdmin && cat.status !== 'ACTIVE') return undefined;
    return cat;
  }

  public static async findCategoryBySlug(slug: string): Promise<LocalCategoryRecord | undefined> {
    return mockCategoriesStore.find((c) => c.slug === slug.toLowerCase() && !c.deletedAt);
  }

  public static async createCategory(data: { name: string; slug: string; description?: string; iconName?: string; sortOrder?: number }): Promise<LocalCategoryRecord> {
    const newCat: LocalCategoryRecord = {
      id: `cat_${Date.now()}`,
      name: data.name,
      slug: data.slug,
      description: data.description || '',
      iconName: data.iconName || 'build',
      sortOrder: data.sortOrder || mockCategoriesStore.length + 1,
      status: 'ACTIVE',
    };
    mockCategoriesStore.push(newCat);
    return newCat;
  }

  public static async updateCategory(id: string, updates: Record<string, any>): Promise<LocalCategoryRecord | undefined> {
    const cat = await this.findCategoryById(id, true);
    if (!cat) return undefined;

    if (updates.name) cat.name = updates.name;
    if (updates.slug) cat.slug = updates.slug;
    if (updates.description !== undefined) cat.description = updates.description;
    if (updates.iconName) cat.iconName = updates.iconName;
    if (updates.sortOrder !== undefined) cat.sortOrder = updates.sortOrder;
    if (updates.status) cat.status = updates.status;

    return cat;
  }

  // ==========================================
  // SERVICE REPOSITORY
  // ==========================================

  public static async findAllServices(options: { categoryId?: string; search?: string; isAdmin?: boolean; page?: number; limit?: number }) {
    let items = servicesData;

    if (!options.isAdmin) {
      items = items.filter((s) => s.isActive !== false);
    }

    if (options.categoryId) {
      items = items.filter((s) => s.categoryId === options.categoryId);
    }

    if (options.search) {
      const q = options.search.toLowerCase();
      items = items.filter((s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
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

  public static async findServiceById(id: string, isAdmin = false): Promise<Service | undefined> {
    const srv = servicesData.find((s) => s.id === id);
    if (!srv) return undefined;
    if (!isAdmin && srv.isActive === false) return undefined;
    return srv;
  }

  public static async findServiceBySlug(slug: string): Promise<Service | undefined> {
    return servicesData.find((s) => (s as any).slug === slug.toLowerCase());
  }

  public static async createService(data: { categoryId: string; name: string; slug: string; shortDescription?: string; description?: string; unitLabel?: string; baseCatalogPrice: number; iconName?: string; included?: string[]; excluded?: string[]; sortOrder?: number }): Promise<Service> {
    const cat = await this.findCategoryById(data.categoryId, true);
    const newService: Service = {
      id: `srv_${Date.now()}`,
      categoryId: data.categoryId,
      categoryName: cat ? cat.name : 'Appliance Repair',
      name: data.name,
      description: data.description || data.shortDescription || 'Professional service',
      unitLabel: data.unitLabel || 'Unit',
      baseCatalogPrice: data.baseCatalogPrice,
      iconName: data.iconName || 'build',
      isActive: true,
    };

    (newService as any).slug = data.slug;
    (newService as any).included = data.included;
    (newService as any).excluded = data.excluded;

    servicesData.unshift(newService);
    return newService;
  }

  public static async updateService(id: string, updates: Record<string, any>): Promise<Service | undefined> {
    const srv = await this.findServiceById(id, true);
    if (!srv) return undefined;

    if (updates.name) srv.name = updates.name;
    if (updates.description) srv.description = updates.description;
    if (updates.unitLabel) srv.unitLabel = updates.unitLabel;
    if (updates.baseCatalogPrice !== undefined) srv.baseCatalogPrice = updates.baseCatalogPrice;
    if (updates.iconName) srv.iconName = updates.iconName;
    if (updates.status) srv.isActive = updates.status === 'ACTIVE';

    if (updates.slug) (srv as any).slug = updates.slug;
    if (updates.included) (srv as any).included = updates.included;
    if (updates.excluded) (srv as any).excluded = updates.excluded;

    return srv;
  }

  public static async softDeleteService(id: string): Promise<boolean> {
    const srv = await this.findServiceById(id, true);
    if (!srv) return false;
    srv.isActive = false; // Step 13.26 Soft delete / Deactivate
    return true;
  }
}
