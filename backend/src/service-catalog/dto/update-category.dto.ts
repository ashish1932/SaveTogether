export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
  description?: string;
  iconName?: string;
  sortOrder?: number;
  status?: 'ACTIVE' | 'INACTIVE';
}

export function validateUpdateCategoryDto(body: any): { isValid: boolean; data?: UpdateCategoryDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  const data: UpdateCategoryDto = {};

  if (body.name !== undefined) {
    if (typeof body.name !== 'string' || body.name.trim().length < 2) {
      return { isValid: false, error: 'Category name must be at least 2 characters' };
    }
    data.name = body.name.trim();
  }

  if (body.slug !== undefined) data.slug = String(body.slug).trim().toLowerCase();
  if (body.description !== undefined) data.description = String(body.description).trim();
  if (body.iconName !== undefined) data.iconName = String(body.iconName).trim();
  if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder);
  if (body.status !== undefined && ['ACTIVE', 'INACTIVE'].includes(body.status.toUpperCase())) {
    data.status = body.status.toUpperCase() as 'ACTIVE' | 'INACTIVE';
  }

  return { isValid: true, data };
}
