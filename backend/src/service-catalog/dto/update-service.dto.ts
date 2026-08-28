export interface UpdateServiceDto {
  categoryId?: string;
  name?: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  unitLabel?: string;
  baseCatalogPrice?: number;
  iconName?: string;
  included?: string[];
  excluded?: string[];
  status?: 'ACTIVE' | 'INACTIVE';
  sortOrder?: number;
}

export function validateUpdateServiceDto(body: any): { isValid: boolean; data?: UpdateServiceDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  const data: UpdateServiceDto = {};

  if (body.name !== undefined) {
    if (typeof body.name !== 'string' || body.name.trim().length < 2) {
      return { isValid: false, error: 'Service name must be at least 2 characters' };
    }
    data.name = body.name.trim();
  }

  const basePrice = body.baseCatalogPrice || body.basePrice;
  if (basePrice !== undefined) {
    if (isNaN(Number(basePrice)) || Number(basePrice) <= 0) {
      return { isValid: false, error: 'Base catalog price must be greater than zero' };
    }
    data.baseCatalogPrice = Number(basePrice);
  }

  if (body.categoryId !== undefined) data.categoryId = String(body.categoryId).trim();
  if (body.slug !== undefined) data.slug = String(body.slug).trim().toLowerCase();
  if (body.shortDescription !== undefined) data.shortDescription = String(body.shortDescription).trim();
  if (body.description !== undefined) data.description = String(body.description).trim();
  if (body.unitLabel !== undefined) data.unitLabel = String(body.unitLabel).trim();
  if (body.iconName !== undefined) data.iconName = String(body.iconName).trim();
  if (Array.isArray(body.included)) data.included = body.included.map(String);
  if (Array.isArray(body.excluded)) data.excluded = body.excluded.map(String);
  if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder);
  if (body.status !== undefined && ['ACTIVE', 'INACTIVE'].includes(body.status.toUpperCase())) {
    data.status = body.status.toUpperCase() as 'ACTIVE' | 'INACTIVE';
  }

  return { isValid: true, data };
}
