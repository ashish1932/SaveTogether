export interface UpdateUserProfileDto {
  name?: string;
  email?: string;
}

export function validateUpdateUserProfileDto(body: any): { isValid: boolean; data?: UpdateUserProfileDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  // Step 10.11 & 10.40 Security Rule: Strictly reject forbidden fields
  const forbiddenFields = ['id', 'mobile', 'phone', 'status', 'referralCode', 'passwordHash', 'walletBalance', 'rewardsBalance', 'isAdmin'];
  for (const field of forbiddenFields) {
    if (field in body) {
      return {
        isValid: false,
        error: `Field '${field}' is protected and cannot be modified through profile update.`,
      };
    }
  }

  const data: UpdateUserProfileDto = {};

  if (body.name !== undefined) {
    if (typeof body.name !== 'string' || body.name.trim().length < 2 || body.name.trim().length > 100) {
      return { isValid: false, error: 'Name must be between 2 and 100 characters' };
    }
    data.name = body.name.trim();
  }

  if (body.email !== undefined) {
    if (typeof body.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
      return { isValid: false, error: 'Invalid email address format' };
    }
    data.email = body.email.trim().toLowerCase();
  }

  return { isValid: true, data };
}
