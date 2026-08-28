export type ReviewStatus = 'PUBLISHED' | 'HIDDEN' | 'FLAGGED' | 'REMOVED';

export interface UpdateReviewStatusDto {
  status: ReviewStatus;
  reason?: string;
}

export function validateUpdateReviewStatusDto(body: any): { isValid: boolean; data?: UpdateReviewStatusDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  const validStatuses: ReviewStatus[] = ['PUBLISHED', 'HIDDEN', 'FLAGGED', 'REMOVED'];
  const status = body.status ? String(body.status).toUpperCase() as any : undefined;

  if (!status || !validStatuses.includes(status)) {
    return { isValid: false, error: `status must be one of: ${validStatuses.join(', ')}` };
  }

  return {
    isValid: true,
    data: {
      status,
      reason: body.reason ? String(body.reason).trim() : undefined,
    },
  };
}
