export interface ServiceResponseDto {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  unitLabel: string;
  baseCatalogPrice: number;
  iconName: string;
  included: string[];
  excluded: string[];
  status: string;
  sortOrder: number;
}

export function toServiceResponseDto(srv: any): ServiceResponseDto {
  const name = srv.name || 'Service';
  return {
    id: srv.id,
    categoryId: srv.categoryId || 'cat_home',
    categoryName: srv.categoryName || 'Appliance Repair',
    name,
    slug: srv.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    shortDescription: srv.description || srv.shortDescription || 'Professional service',
    description: srv.description || 'Deep jet wash cleaning & pressure check',
    unitLabel: srv.unitLabel || 'Unit',
    baseCatalogPrice: Number(srv.baseCatalogPrice || 799),
    iconName: srv.iconName || 'ac_unit',
    included: srv.included || ['Deep jet foam wash', 'Gas pressure & electrical check', '30 days warranty'],
    excluded: srv.excluded || ['Gas charging (charged separately)', 'Spare parts replacement'],
    status: srv.isActive === false ? 'INACTIVE' : (srv.status || 'ACTIVE').toUpperCase(),
    sortOrder: srv.sortOrder || 0,
  };
}
