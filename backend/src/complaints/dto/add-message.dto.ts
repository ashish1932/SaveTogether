export type ComplaintMessageVisibility = 'CUSTOMER' | 'INTERNAL';

export interface AddComplaintMessageDto {
  message: string;
  visibility?: ComplaintMessageVisibility;
}

export function validateAddComplaintMessageDto(body: any): { isValid: boolean; data?: AddComplaintMessageDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  if (!body.message || typeof body.message !== 'string') {
    return { isValid: false, error: 'message is required' };
  }

  const visibility = body.visibility ? String(body.visibility).toUpperCase() as any : 'CUSTOMER';

  return {
    isValid: true,
    data: {
      message: body.message.trim(),
      visibility: visibility === 'INTERNAL' ? 'INTERNAL' : 'CUSTOMER',
    },
  };
}
