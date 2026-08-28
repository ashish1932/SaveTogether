export interface CreateServiceDto {
  categoryId: string;
  name: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  unitLabel?: string;
  baseCatalogPrice: number;
  iconName?: string;
  included?: string[];
  excluded?: string[];
  sortOrder?: number;
}

export function validateCreateServiceDto(body: any): { isValid: boolean; data?: CreateServiceDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  if (!body.categoryId || typeof body.categoryId !== 'string') {
    return { isValid: false, error: 'categoryId is required' };
  }

  if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
    return { isValid: false, error: 'Service name must be at least 2 characters' };
  }

  const basePrice = body.baseCatalogPrice || body.basePrice;
  if (basePrice === undefined || isNaN(Number(basePrice)) || Number(basePrice) <= 0) {
    return { isValid: false, error: 'Base catalog price must be greater than zero' };
  }

  const nameClean = body.name.trim();
  const slug = body.slug ? String(body.slug).trim().toLowerCase() : nameClean.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return {
    isValid: true,
    data: {
      categoryId: body.categoryId.trim(),
      name: nameClean,
      slug,
      shortDescription: body.shortDescription ? String(body.shortDescription).trim() : body.description ? String(body.description).trim() : '',
      description: body.description ? String(body.description).trim() : '',
      unitLabel: body.unitLabel ? String(body.unitLabel).trim() : 'Unit',
      baseCatalogPrice: Number(basePrice),
      iconName: body.iconName ? String(body.iconName).trim() : 'build',
      included: Array.isArray(body.included) ? body.included.map(String) : ['Standard Inspection', 'Expert Service Technician'],
      excluded: Array.isArray(body.excluded) ? body.excluded.map(String) : ['Spare parts replacement', 'Unscheduled emergency visits'],
      sortOrder: body.sortOrder ? Number(body.sortOrder) : 0,
    },
  };
}
