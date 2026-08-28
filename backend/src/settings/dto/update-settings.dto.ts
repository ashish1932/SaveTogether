export type SettingCategory = 'GENERAL' | 'BUSINESS' | 'PRICING' | 'PAYMENT' | 'REFUND' | 'REFERRAL' | 'NOTIFICATION';

export interface UpdateSettingsDto {
  category: SettingCategory;
  configuration: Record<string, any>;
  effectiveFrom?: string;
  reason?: string;
}

export function validateUpdateSettingsDto(body: any): { isValid: boolean; data?: UpdateSettingsDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  const validCategories: SettingCategory[] = ['GENERAL', 'BUSINESS', 'PRICING', 'PAYMENT', 'REFUND', 'REFERRAL', 'NOTIFICATION'];
  const category = body.category ? String(body.category).toUpperCase() as any : undefined;

  if (!category || !validCategories.includes(category)) {
    return { isValid: false, error: `category must be one of: ${validCategories.join(', ')}` };
  }

  if (!body.configuration || typeof body.configuration !== 'object') {
    return { isValid: false, error: 'configuration object is required' };
  }

  return {
    isValid: true,
    data: {
      category,
      configuration: body.configuration,
      effectiveFrom: body.effectiveFrom ? String(body.effectiveFrom).trim() : new Date().toISOString(),
      reason: body.reason ? String(body.reason).trim() : undefined,
    },
  };
}
