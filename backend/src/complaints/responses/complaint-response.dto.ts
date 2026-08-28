import { ComplaintCategory, ComplaintPriority } from '../dto/create-complaint.dto';
import { ComplaintMessageVisibility } from '../dto/add-message.dto';

export type ComplaintStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REOPENED' | 'CANCELLED';
export type ComplaintMessageSenderType = 'USER' | 'ADMIN' | 'SYSTEM';

export interface ComplaintMessageResponseDto {
  id: string;
  senderType: ComplaintMessageSenderType;
  senderId: string | null;
  senderName: string;
  message: string;
  visibility: ComplaintMessageVisibility;
  createdAt: string;
}

export interface ComplaintResponseDto {
  id: string;
  complaintNumber: string;
  userId: string;
  userName: string;
  bookingId: string | null;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  subject: string;
  description: string;
  status: ComplaintStatus;
  assignedTo: string | null;
  assignedAdminName: string | null;
  resolution: string | null;
  resolvedAt: string | null;
  messages: ComplaintMessageResponseDto[];
  createdAt: string;
  updatedAt: string;
}
