import { ComplaintsRepository, LocalComplaintRecord, LocalComplaintMessageRecord } from './complaints.repository';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { AddComplaintMessageDto } from './dto/add-message.dto';
import { ResolveComplaintDto } from './dto/resolve-complaint.dto';
import { ComplaintResponseDto, ComplaintMessageResponseDto, ComplaintStatus } from './responses/complaint-response.dto';
import { UsersRepository } from '../users/users.repository';
import { BookingsRepository } from '../bookings/bookings.repository';
import { NotificationsService } from '../notifications/notifications.service';
import { ErrorCode } from '../common/types/error-codes.enum';

export class ComplaintsService {
  /**
   * Creates a new customer support complaint case (Step 30.12 - 30.14)
   */
  public static async createComplaint(userId: string, dto: CreateComplaintDto): Promise<ComplaintResponseDto> {
    const user = await UsersRepository.findById(userId);

    // Step 30.14: Booking ownership verification
    if (dto.bookingId) {
      const booking = await BookingsRepository.findById(dto.bookingId);
      if (!booking || booking.userId !== userId) {
        throw {
          statusCode: 400,
          code: ErrorCode.VALIDATION_ERROR,
          message: 'Booking not found or not accessible to user',
        };
      }
    }

    const complaint = await ComplaintsRepository.createComplaint({
      userId,
      userName: user?.name || 'Resident',
      category: dto.category,
      subject: dto.subject,
      description: dto.description,
      bookingId: dto.bookingId,
      priority: dto.priority,
    });

    // Notify support team via notification engine
    await NotificationsService.dispatchNotificationEvent({
      userId,
      type: 'COMPLAINT_UPDATED',
      referenceType: 'Complaint',
      referenceId: complaint.complaintNumber,
      customTitle: 'Support Complaint Raised',
      customMessage: `Your complaint #${complaint.complaintNumber} has been logged. Our support team is investigating.`,
    });

    return this.getComplaintDetails(complaint.id, userId, false);
  }

  /**
   * Returns resident complaints list (Step 30.15)
   */
  public static async getUserComplaints(userId: string, filterStatus?: string): Promise<ComplaintResponseDto[]> {
    const list = await ComplaintsRepository.findByUserId(userId);
    const filtered = filterStatus ? list.filter((c) => c.status === filterStatus.toUpperCase()) : list;

    const results: ComplaintResponseDto[] = [];
    for (const c of filtered) {
      results.push(await this.getComplaintDetails(c.id, userId, false));
    }
    return results;
  }

  /**
   * Returns complaint details thread with Internal Note security protection (Step 30.16, 30.34 & 30.37)
   */
  public static async getComplaintDetails(id: string, userId?: string, isAdmin = false): Promise<ComplaintResponseDto> {
    const complaint = await ComplaintsRepository.findById(id);
    if (!complaint) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'Complaint case not found',
      };
    }

    // Step 30.37: Ownership protection for non-admin residents
    if (!isAdmin && userId && complaint.userId !== userId) {
      throw {
        statusCode: 403,
        code: ErrorCode.AUTH_UNAUTHORIZED,
        message: 'You are not authorized to view this complaint case',
      };
    }

    const allMessages = await ComplaintsRepository.findMessagesByComplaintId(complaint.id);

    // Step 30.34 & 30.35: Filter out INTERNAL notes for customer responses!
    const visibleMessages = isAdmin ? allMessages : allMessages.filter((m) => m.visibility === 'CUSTOMER');

    return {
      id: complaint.id,
      complaintNumber: complaint.complaintNumber,
      userId: complaint.userId,
      userName: complaint.userName,
      bookingId: complaint.bookingId,
      category: complaint.category,
      priority: complaint.priority,
      subject: complaint.subject,
      description: complaint.description,
      status: complaint.status,
      assignedTo: complaint.assignedTo,
      assignedAdminName: complaint.assignedAdminName,
      resolution: complaint.resolution,
      resolvedAt: complaint.resolvedAt,
      messages: visibleMessages.map(this.toMessageDto),
      createdAt: complaint.createdAt,
      updatedAt: complaint.updatedAt,
    };
  }

  /**
   * Appends customer message to complaint thread (Step 30.17 & 30.18)
   */
  public static async addCustomerMessage(id: string, userId: string, dto: AddComplaintMessageDto): Promise<ComplaintResponseDto> {
    const complaint = await ComplaintsRepository.findById(id);
    if (!complaint || complaint.userId !== userId) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'Complaint case not found',
      };
    }

    if (complaint.status === 'CLOSED') {
      throw {
        statusCode: 400,
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Cannot send message to a closed complaint case. Please reopen the ticket if required.',
      };
    }

    const user = await UsersRepository.findById(userId);

    await ComplaintsRepository.addMessage({
      complaintId: complaint.id,
      senderType: 'USER',
      senderId: userId,
      senderName: user?.name || 'Resident',
      message: dto.message,
      visibility: 'CUSTOMER',
    });

    if (complaint.status === 'RESOLVED') {
      await ComplaintsRepository.updateComplaint(complaint.id, { status: 'IN_PROGRESS' });
    }

    return this.getComplaintDetails(complaint.id, userId, false);
  }

  /**
   * Appends admin reply or internal note (Step 30.34 & 30.35)
   */
  public static async addAdminMessage(id: string, adminUserId: string, adminName: string, dto: AddComplaintMessageDto): Promise<ComplaintResponseDto> {
    const complaint = await ComplaintsRepository.findById(id);
    if (!complaint) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'Complaint case not found',
      };
    }

    await ComplaintsRepository.addMessage({
      complaintId: complaint.id,
      senderType: 'ADMIN',
      senderId: adminUserId,
      senderName: adminName,
      message: dto.message,
      visibility: dto.visibility || 'CUSTOMER',
    });

    // If customer visible reply, notify resident
    if (dto.visibility !== 'INTERNAL') {
      await NotificationsService.dispatchNotificationEvent({
        userId: complaint.userId,
        type: 'COMPLAINT_UPDATED',
        referenceType: 'Complaint',
        referenceId: complaint.complaintNumber,
        customTitle: 'Complaint Update',
        customMessage: `New support message on complaint #${complaint.complaintNumber}: "${dto.message}"`,
      });
    }

    return this.getComplaintDetails(complaint.id, undefined, true);
  }

  /**
   * Assigns complaint to Admin support agent (Step 30.21)
   */
  public static async assignAdmin(id: string, adminUserId: string, adminName: string): Promise<ComplaintResponseDto> {
    const complaint = await ComplaintsRepository.findById(id);
    if (!complaint) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'Complaint case not found',
      };
    }

    await ComplaintsRepository.updateComplaint(complaint.id, {
      assignedTo: adminUserId,
      assignedAdminName: adminName,
      status: 'IN_PROGRESS',
    });

    return this.getComplaintDetails(complaint.id, undefined, true);
  }

  /**
   * Resolves complaint with resolution summary (Step 30.25 & 30.26)
   */
  public static async resolveComplaint(id: string, adminUserId: string, adminName: string, dto: ResolveComplaintDto): Promise<ComplaintResponseDto> {
    const complaint = await ComplaintsRepository.findById(id);
    if (!complaint) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'Complaint case not found',
      };
    }

    await ComplaintsRepository.updateComplaint(complaint.id, {
      status: 'RESOLVED',
      resolution: dto.resolution,
      resolvedAt: new Date().toISOString(),
    });

    await ComplaintsRepository.addMessage({
      complaintId: complaint.id,
      senderType: 'SYSTEM',
      senderId: adminUserId,
      senderName: adminName,
      message: `Complaint resolved. Resolution: ${dto.resolution}`,
      visibility: 'CUSTOMER',
    });

    await NotificationsService.dispatchNotificationEvent({
      userId: complaint.userId,
      type: 'COMPLAINT_UPDATED',
      referenceType: 'Complaint',
      referenceId: complaint.complaintNumber,
      customTitle: 'Complaint Resolved',
      customMessage: `Your complaint #${complaint.complaintNumber} has been resolved: ${dto.resolution}`,
    });

    return this.getComplaintDetails(complaint.id, undefined, true);
  }

  /**
   * Reopens a resolved complaint (Step 30.18)
   */
  public static async reopenComplaint(id: string, userId: string): Promise<ComplaintResponseDto> {
    const complaint = await ComplaintsRepository.findById(id);
    if (!complaint || complaint.userId !== userId) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'Complaint case not found',
      };
    }

    if (complaint.status !== 'RESOLVED') {
      throw {
        statusCode: 400,
        code: ErrorCode.VALIDATION_ERROR,
        message: `Only RESOLVED complaints can be reopened. Current status: '${complaint.status}'`,
      };
    }

    await ComplaintsRepository.updateComplaint(complaint.id, {
      status: 'REOPENED',
    });

    await ComplaintsRepository.addMessage({
      complaintId: complaint.id,
      senderType: 'USER',
      senderId: userId,
      senderName: complaint.userName,
      message: 'Customer reopened the complaint case.',
      visibility: 'CUSTOMER',
    });

    return this.getComplaintDetails(complaint.id, userId, false);
  }

  public static async listAdminComplaints(filterStatus?: string): Promise<ComplaintResponseDto[]> {
    const list = await ComplaintsRepository.findAll();
    const filtered = filterStatus ? list.filter((c) => c.status === filterStatus.toUpperCase()) : list;

    const results: ComplaintResponseDto[] = [];
    for (const c of filtered) {
      results.push(await this.getComplaintDetails(c.id, undefined, true));
    }
    return results;
  }

  private static toMessageDto(m: LocalComplaintMessageRecord): ComplaintMessageResponseDto {
    return {
      id: m.id,
      senderType: m.senderType,
      senderId: m.senderId,
      senderName: m.senderName,
      message: m.message,
      visibility: m.visibility,
      createdAt: m.createdAt,
    };
  }
}
