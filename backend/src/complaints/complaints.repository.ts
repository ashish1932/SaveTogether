import { ComplaintStatus, ComplaintMessageSenderType } from './responses/complaint-response.dto';
import { ComplaintCategory, ComplaintPriority } from './dto/create-complaint.dto';
import { ComplaintMessageVisibility } from './dto/add-message.dto';

export interface LocalComplaintMessageRecord {
  id: string;
  complaintId: string;
  senderType: ComplaintMessageSenderType;
  senderId: string | null;
  senderName: string;
  message: string;
  visibility: ComplaintMessageVisibility;
  createdAt: string;
}

export interface LocalComplaintRecord {
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
  createdAt: string;
  updatedAt: string;
}

const mockComplaintsStore: LocalComplaintRecord[] = [
  {
    id: 'cmp_1001',
    complaintNumber: 'C1023',
    userId: 'usr_1',
    userName: 'Ashish Kumar',
    bookingId: 'BK10245',
    category: 'SERVICE',
    priority: 'HIGH',
    subject: 'AC cooling issue post-service',
    description: 'The technician completed general service but cooling is not optimal.',
    status: 'IN_PROGRESS',
    assignedTo: 'ADM1001',
    assignedAdminName: 'Ashish Admin',
    resolution: null,
    resolvedAt: null,
    createdAt: '2026-08-27T12:00:00Z',
    updatedAt: '2026-08-27T12:30:00Z',
  },
];

const mockComplaintMessagesStore: LocalComplaintMessageRecord[] = [
  {
    id: 'msg_1001',
    complaintId: 'cmp_1001',
    senderType: 'USER',
    senderId: 'usr_1',
    senderName: 'Ashish Kumar',
    message: 'The technician completed general service but cooling is not optimal.',
    visibility: 'CUSTOMER',
    createdAt: '2026-08-27T12:00:00Z',
  },
  {
    id: 'msg_1002',
    complaintId: 'cmp_1001',
    senderType: 'ADMIN',
    senderId: 'ADM1001',
    senderName: 'Ashish Admin',
    message: 'We have assigned a senior supervisor for a complimentary revisit.',
    visibility: 'CUSTOMER',
    createdAt: '2026-08-27T12:30:00Z',
  },
  {
    id: 'msg_1003',
    complaintId: 'cmp_1001',
    senderType: 'ADMIN',
    senderId: 'ADM1001',
    senderName: 'Ashish Admin',
    message: 'Vendor acknowledged technician missed gas pressure test.',
    visibility: 'INTERNAL', // Step 30.34 & 30.35: Internal Admin Note
    createdAt: '2026-08-27T12:31:00Z',
  },
];

export class ComplaintsRepository {
  public static async createComplaint(data: {
    userId: string;
    userName: string;
    category: ComplaintCategory;
    subject: string;
    description: string;
    bookingId?: string;
    priority?: ComplaintPriority;
  }): Promise<LocalComplaintRecord> {
    const id = `cmp_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const complaintNumber = `C${Math.floor(1000 + Math.random() * 9000)}`;

    const record: LocalComplaintRecord = {
      id,
      complaintNumber,
      userId: data.userId,
      userName: data.userName,
      bookingId: data.bookingId || null,
      category: data.category,
      priority: data.priority || 'MEDIUM',
      subject: data.subject,
      description: data.description,
      status: 'OPEN',
      assignedTo: null,
      assignedAdminName: null,
      resolution: null,
      resolvedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockComplaintsStore.push(record);

    // Initial customer message insertion
    await this.addMessage({
      complaintId: id,
      senderType: 'USER',
      senderId: data.userId,
      senderName: data.userName,
      message: data.description,
      visibility: 'CUSTOMER',
    });

    return record;
  }

  public static async findById(id: string): Promise<LocalComplaintRecord | undefined> {
    return mockComplaintsStore.find((c) => c.id === id || c.complaintNumber === id);
  }

  public static async findByUserId(userId: string): Promise<LocalComplaintRecord[]> {
    return mockComplaintsStore.filter((c) => c.userId === userId);
  }

  public static async findAll(): Promise<LocalComplaintRecord[]> {
    return mockComplaintsStore;
  }

  public static async addMessage(data: {
    complaintId: string;
    senderType: ComplaintMessageSenderType;
    senderId: string | null;
    senderName: string;
    message: string;
    visibility: ComplaintMessageVisibility;
  }): Promise<LocalComplaintMessageRecord> {
    const msg: LocalComplaintMessageRecord = {
      id: `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      complaintId: data.complaintId,
      senderType: data.senderType,
      senderId: data.senderId,
      senderName: data.senderName,
      message: data.message,
      visibility: data.visibility,
      createdAt: new Date().toISOString(),
    };

    mockComplaintMessagesStore.push(msg);
    return msg;
  }

  public static async findMessagesByComplaintId(complaintId: string): Promise<LocalComplaintMessageRecord[]> {
    return mockComplaintMessagesStore.filter((m) => m.complaintId === complaintId);
  }

  public static async updateComplaint(
    id: string,
    updates: Partial<LocalComplaintRecord>,
  ): Promise<LocalComplaintRecord | undefined> {
    const complaint = await this.findById(id);
    if (!complaint) return undefined;

    Object.assign(complaint, updates, { updatedAt: new Date().toISOString() });
    return complaint;
  }
}
