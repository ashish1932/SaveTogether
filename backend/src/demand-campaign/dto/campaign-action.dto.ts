export interface CampaignActionDto {
  reason?: string;
  targetDate?: string;
}

export function validateCampaignActionDto(body: any): { isValid: boolean; data?: CampaignActionDto; error?: string } {
  if (body && typeof body === 'object') {
    return {
      isValid: true,
      data: {
        reason: body.reason ? String(body.reason).trim() : 'Operational action',
        targetDate: body.targetDate ? String(body.targetDate).trim() : undefined,
      },
    };
  }

  return { isValid: true, data: { reason: 'Operational action' } };
}
