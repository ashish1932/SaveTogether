export interface AdminAdjustmentDto {
  userId: string;
  type: 'ADMIN_CREDIT' | 'ADMIN_DEBIT';
  amount: number;
  reason: string;
}

export function validateAdminAdjustmentDto(body: any): { isValid: boolean; data?: AdminAdjustmentDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  if (!body.userId || typeof body.userId !== 'string') {
    return { isValid: false, error: 'userId is required' };
  }

  if (!body.reason || typeof body.reason !== 'string') {
    return { isValid: false, error: 'reason for adjustment is required' };
  }

  const amt = Number(body.amount);
  if (isNaN(amt) || amt <= 0) {
    return { isValid: false, error: 'amount must be a positive number' };
  }

  const type = body.type ? String(body.type).toUpperCase() as any : 'ADMIN_CREDIT';
  if (type !== 'ADMIN_CREDIT' && type !== 'ADMIN_DEBIT') {
    return { isValid: false, error: 'type must be ADMIN_CREDIT or ADMIN_DEBIT' };
  }

  return {
    isValid: true,
    data: {
      userId: body.userId.trim(),
      type,
      amount: amt,
      reason: body.reason.trim(),
    },
  };
}
