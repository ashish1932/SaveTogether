export interface VerifyPaymentDto {
  paymentId: string;
  providerOrderId: string;
  providerPaymentId: string;
  signature: string;
}

export function validateVerifyPaymentDto(body: any): { isValid: boolean; data?: VerifyPaymentDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  if (!body.paymentId || typeof body.paymentId !== 'string') {
    return { isValid: false, error: 'paymentId is required' };
  }
  if (!body.providerOrderId || typeof body.providerOrderId !== 'string') {
    return { isValid: false, error: 'providerOrderId is required' };
  }
  if (!body.providerPaymentId || typeof body.providerPaymentId !== 'string') {
    return { isValid: false, error: 'providerPaymentId is required' };
  }
  if (!body.signature || typeof body.signature !== 'string') {
    return { isValid: false, error: 'signature is required' };
  }

  return {
    isValid: true,
    data: {
      paymentId: body.paymentId.trim(),
      providerOrderId: body.providerOrderId.trim(),
      providerPaymentId: body.providerPaymentId.trim(),
      signature: body.signature.trim(),
    },
  };
}
