export interface ReportQueryDto {
  from?: string;
  to?: string;
  societyId?: string;
  serviceId?: string;
  vendorId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export function validateReportQueryDto(query: any): ReportQueryDto {
  const page = Math.max(1, parseInt(String(query?.page || '1'), 10));
  const limit = Math.min(100, Math.max(1, parseInt(String(query?.limit || '20'), 10)));

  return {
    from: query?.from ? String(query.from).trim() : undefined,
    to: query?.to ? String(query.to).trim() : undefined,
    societyId: query?.societyId ? String(query.societyId).trim() : undefined,
    serviceId: query?.serviceId ? String(query.serviceId).trim() : undefined,
    vendorId: query?.vendorId ? String(query.vendorId).trim() : undefined,
    status: query?.status ? String(query.status).trim().toUpperCase() : undefined,
    page,
    limit,
  };
}
