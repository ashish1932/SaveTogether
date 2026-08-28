export type ComplaintCategory = 'BOOKING' | 'PAYMENT' | 'SERVICE' | 'REFUND' | 'REFERRAL' | 'VENDOR' | 'ACCOUNT' | 'OTHER';
export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface CreateComplaintDto {
  category: ComplaintCategory;
  subject: string;
  description: string;
  bookingId?: string;
  priority?: ComplaintPriority;
}

export function validateCreateComplaintDto(body: any): { isValid: boolean; data?: CreateComplaintDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  if (!body.subject || typeof body.subject !== 'string') {
    return { isValid: false, error: 'subject is required' };
  }

  if (!body.description || typeof body.description !== 'string') {
    return { isValid: false, error: 'description is required' };
  }

  const validCategories: ComplaintCategory[] = ['BOOKING', 'PAYMENT', 'SERVICE', 'REFUND', 'REFERRAL', 'VENDOR', 'ACCOUNT', 'OTHER'];
  const category = body.category ? String(body.category).toUpperCase() as any : 'SERVICE';
  if (!validCategories.includes(category)) {
    return { isValid: false, error: `category must be one of: ${validCategories.join(', ')}` };
  }

  const validPriorities: ComplaintPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  const priority = body.priority ? String(body.priority).toUpperCase() as any : 'MEDIUM';

  return {
    isValid: true,
    data: {
      category,
      subject: body.subject.trim(),
      description: body.description.trim(),
      bookingId: body.bookingId ? String(body.bookingId).trim() : undefined,
      priority: validPriorities.includes(priority) ? priority : 'MEDIUM',
    },
  };
}
