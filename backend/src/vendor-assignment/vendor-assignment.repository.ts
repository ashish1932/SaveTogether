import { VendorAssignmentStatus } from './responses/assignment-response.dto';

export interface LocalVendorAssignmentRecord {
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

export interface LocalVendorNegotiationRecord {
  id: string;
  vendorId: string;
  campaignId: string;
  quantity: number;
  initialRate: number;
  negotiatedRate: number;
  notes: string | null;
  status: 'OPEN' | 'ACCEPTED' | 'REJECTED';
  createdBy: string;
  createdAt: string;
}

const mockAssignmentsStore: LocalVendorAssignmentRecord[] = [];
const mockNegotiationsStore: LocalVendorNegotiationRecord[] = [];

export class VendorAssignmentRepository {
  public static async createAssignment(data: {
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
    assignedBy: string;
  }): Promise<LocalVendorAssignmentRecord> {
    const id = `vas_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const assignmentNumber = `VA-${Math.floor(10000 + Math.random() * 90000)}`;
    const totalVendorCost = Math.round(data.quantity * data.agreedUnitRate * 100) / 100;

    const assignment: LocalVendorAssignmentRecord = {
      id,
      assignmentNumber,
      vendorId: data.vendorId,
      vendorCode: data.vendorCode,
      businessName: data.businessName,
      campaignId: data.campaignId,
      societyId: data.societyId,
      societyName: data.societyName,
      serviceId: data.serviceId,
      serviceName: data.serviceName,
      quantity: data.quantity,
      serviceDate: data.serviceDate,
      timeSlotId: data.timeSlotId,
      agreedUnitRate: data.agreedUnitRate,
      totalVendorCost,
      status: 'RESERVED',
      assignedBy: data.assignedBy,
      confirmedAt: null,
      createdAt: new Date().toISOString(),
    };

    mockAssignmentsStore.push(assignment);
    return assignment;
  }

  public static async findById(id: string): Promise<LocalVendorAssignmentRecord | undefined> {
    return mockAssignmentsStore.find((a) => a.id === id || a.assignmentNumber === id);
  }

  public static async findByCampaignId(campaignId: string): Promise<LocalVendorAssignmentRecord | undefined> {
    return mockAssignmentsStore.find((a) => a.campaignId === campaignId && a.status !== 'CANCELLED' && a.status !== 'FAILED');
  }

  public static async findAll(): Promise<LocalVendorAssignmentRecord[]> {
    return mockAssignmentsStore;
  }

  public static async updateStatus(id: string, newStatus: VendorAssignmentStatus): Promise<LocalVendorAssignmentRecord | undefined> {
    const assignment = await this.findById(id);
    if (!assignment) return undefined;

    assignment.status = newStatus;
    if (newStatus === 'CONFIRMED') {
      assignment.confirmedAt = new Date().toISOString();
    }
    return assignment;
  }

  public static async createNegotiation(data: {
    vendorId: string;
    campaignId: string;
    quantity: number;
    initialRate: number;
    negotiatedRate: number;
    notes?: string;
    createdBy: string;
  }): Promise<LocalVendorNegotiationRecord> {
    const neg: LocalVendorNegotiationRecord = {
      id: `neg_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      vendorId: data.vendorId,
      campaignId: data.campaignId,
      quantity: data.quantity,
      initialRate: data.initialRate,
      negotiatedRate: data.negotiatedRate,
      notes: data.notes || null,
      status: 'ACCEPTED',
      createdBy: data.createdBy,
      createdAt: new Date().toISOString(),
    };

    mockNegotiationsStore.push(neg);
    return neg;
  }

  public static async findNegotiationsByCampaign(campaignId: string): Promise<LocalVendorNegotiationRecord[]> {
    return mockNegotiationsStore.filter((n) => n.campaignId === campaignId);
  }
}
