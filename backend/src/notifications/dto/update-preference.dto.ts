export interface UpdateNotificationPreferenceDto {
  pushEnabled?: boolean;
  bookingUpdates?: boolean;
  paymentUpdates?: boolean;
  rewardUpdates?: boolean;
  promotionalUpdates?: boolean;
}

export function validateUpdatePreferenceDto(body: any): { isValid: boolean; data?: UpdateNotificationPreferenceDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  const data: UpdateNotificationPreferenceDto = {};

  if (typeof body.pushEnabled === 'boolean') data.pushEnabled = body.pushEnabled;
  if (typeof body.bookingUpdates === 'boolean') data.bookingUpdates = body.bookingUpdates;
  if (typeof body.paymentUpdates === 'boolean') data.paymentUpdates = body.paymentUpdates;
  if (typeof body.rewardUpdates === 'boolean') data.rewardUpdates = body.rewardUpdates;
  if (typeof body.promotionalUpdates === 'boolean') data.promotionalUpdates = body.promotionalUpdates;

  return { isValid: true, data };
}
