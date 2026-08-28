export class PaginationQueryDto {
  page?: number = 1;
  limit?: number = 20;
  status?: string;
  search?: string;
  societyId?: string;
  serviceId?: string;
}

export function parsePaginationQuery(query: any): PaginationQueryDto {
  const page = Math.max(1, parseInt(query.page as string, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit as string, 10) || 20));

  return {
    page,
    limit,
    status: query.status ? String(query.status) : undefined,
    search: query.search ? String(query.search) : undefined,
    societyId: query.societyId ? String(query.societyId) : undefined,
    serviceId: query.serviceId ? String(query.serviceId) : undefined,
  };
}
