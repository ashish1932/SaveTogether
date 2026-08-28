export interface CreateCategoryDto {
  name: string;
  slug?: string;
  description?: string;
  iconName?: string;
  sortOrder?: number;
}

export function validateCreateCategoryDto(body: any): { isValid: boolean; data?: CreateCategoryDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
    return { isValid: false, error: 'Category name must be at least 2 characters' };
  }

  const nameClean = body.name.trim();
  const slug = body.slug ? String(body.slug).trim().toLowerCase() : nameClean.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return {
    isValid: true,
    data: {
      name: nameClean,
      slug,
      description: body.description ? String(body.description).trim() : '',
      iconName: body.iconName ? String(body.iconName).trim() : 'build',
      sortOrder: body.sortOrder ? Number(body.sortOrder) : 0,
    },
  };
}
