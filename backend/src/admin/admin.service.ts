import { AuditRepository, AuditLogRecord } from './audit/audit.repository';
import { AdminDashboardResponseDto } from './responses/admin-dashboard.dto';
import { BookingsRepository } from '../bookings/bookings.repository';
import { UsersRepository } from '../users/users.repository';
import { SocietiesRepository } from '../societies/societies.repository';
import { VendorsRepository } from '../vendors/vendors.repository';
import { ComplaintsRepository } from '../complaints/complaints.repository';
import { ReviewsRepository } from '../reviews/reviews.repository';

export class AdminService {
  /**
   * Computes Executive Dashboard Analytics Summary (Step 33.1)
   */
  public static async getDashboardMetrics(): Promise<AdminDashboardResponseDto> {
    const bookings = await BookingsRepository.findAll();
    const users = await UsersRepository.findAll();
    const societiesResult = await SocietiesRepository.findAll({});
    const vendors = await VendorsRepository.findAll();
    const complaints = await ComplaintsRepository.findAll();
    const reviews = await ReviewsRepository.findAll();
    const logs = await AuditRepository.findAll();

    const totalRevenue = bookings.reduce((sum, b) => sum + ((b as any).totalPrice || (b as any).totalAmount || 0), 0);
    const totalSavings = bookings.reduce((sum, b) => sum + ((b as any).savingsAmount || 200), 0);
    const completedCount = bookings.filter((b) => b.status === 'COMPLETED').length;
    const openComplaintsCount = complaints.filter((c) => c.status === 'OPEN' || c.status === 'IN_PROGRESS').length;

    return {
      metrics: {
        totalBookings: bookings.length,
        completedBookings: completedCount,
        grossRevenue: totalRevenue,
        customerSavings: totalSavings,
        totalUsers: users.length,
        activeSocieties: societiesResult.items.length,
        totalVendors: vendors.length,
        openComplaints: openComplaintsCount,
        publishedReviews: reviews.filter((r) => r.status === 'PUBLISHED').length,
      },
      recentAuditLogs: logs.slice(-10).map((l) => ({
        id: l.id,
        adminName: l.adminName,
        action: l.action,
        targetEntity: l.targetEntity,
        targetId: l.targetId,
        createdAt: l.createdAt,
      })),
    };
  }

  public static async listAuditLogs(): Promise<AuditLogRecord[]> {
    return AuditRepository.findAll();
  }
}
