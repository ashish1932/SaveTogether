export type VendorAssignmentStatus =
  | 'DRAFT'
  | 'NEGOTIATING'
  | 'RESERVED'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED';

export interface VendorAssignmentResponseDto {
  id: string;
  assignmentNumber: string;
  vendorId: string;
  vendorCode: string;
  businessName: string;
  campaignId: string;
  societyId: string;
  societyName: string;
  serviceId: string;
  serviceName: string;
  quantity: number;
  serviceDate: string;
  timeSlotId: string;
  agreedUnitRate: number;
  totalVendorCost: number;
  status: VendorAssignmentStatus;
  assignedBy: string;
  confirmedAt: string | null;
  createdAt: string;
}
