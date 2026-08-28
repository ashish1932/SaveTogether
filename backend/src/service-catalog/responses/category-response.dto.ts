export interface CategoryResponseDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  sortOrder: number;
  status: string;
}

export function toCategoryResponseDto(cat: any): CategoryResponseDto {
  const name = cat.name || 'Category';
  return {
    id: cat.id,
    name,
    slug: cat.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: cat.description || '',
    iconName: cat.iconName || 'build',
    sortOrder: cat.sortOrder || 0,
    status: (cat.status || 'ACTIVE').toUpperCase(),
  };
}
