import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../models/notification_item.dart';
import '../models/booking.dart';
import '../widgets/buttons/primary_button.dart';
import 'booking_detail_screen.dart';
import 'booking_tracking_screen.dart';
import 'refund_status_screen.dart';

class NotificationDetailScreen extends StatelessWidget {
  final NotificationItem notification;

  const NotificationDetailScreen({
    super.key,
    required this.notification,
  });

  @override
  Widget build(BuildContext context) {
    final mockBooking = Booking(
      id: notification.relatedBookingId ?? '#BK10245',
      serviceId: 'srv_ac_01',
      serviceName: 'AC Servicing',
      quantity: 2,
      unitLabel: 'AC',
      societyName: 'ABC Residency',
      address: 'Block A, Flat 402',
      serviceDate: DateTime(2025, 5, 25),
      timeWindow: '9:00 AM – 12:00 PM',
      estimatedUnitPrice: 699,
      totalPrice: 1398,
      status: 'Scheduled',
      createdAt: DateTime.now(),
    );

    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Notification Details', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Icon Header Graphic
              Center(
                child: Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: _getNotificationColor(notification.type).withValues(alpha: 0.12),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(_getNotificationIcon(notification.type), size: 48, color: _getNotificationColor(notification.type)),
                ),
              ),
              const SizedBox(height: 20),

              // Title
              Center(
                child: Text(
                  notification.title,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.inter(
                    fontSize: 22,
                    fontWeight: FontWeight.w700,
                    color: AppColors.deepNavy,
                  ),
                ),
              ),
              const SizedBox(height: 4),

              Center(
                child: Text(
                  'Today • 5:24 PM',
                  style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary),
                ),
              ),
              const SizedBox(height: 20),

              // Highlight Banner for Price Drop (41B)
              if (notification.type == 'PRICE_DROP') ...[
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.secondaryGreen.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.secondaryGreen, width: 1),
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text('₹699', style: GoogleFonts.inter(fontSize: 18, color: AppColors.textSecondary, decoration: TextDecoration.lineThrough)),
                          const SizedBox(width: 12),
                          const Icon(Icons.arrow_forward_rounded, color: AppColors.secondaryGreen, size: 20),
                          const SizedBox(width: 12),
                          Text('₹599 / AC', style: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.bold, color: AppColors.secondaryGreen)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text('You saved ₹200 on each AC.', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.secondaryGreen)),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
              ],

              // Main Message Box
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
                ),
                child: Text(
                  notification.message,
                  style: GoogleFonts.inter(fontSize: 14, color: AppColors.deepNavy, height: 1.5),
                ),
              ),
              const SizedBox(height: 24),

              // Related Booking Card Context
              if (notification.relatedBookingId != null) ...[
                Text('RELATED BOOKING', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5)),
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.pureWhite,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: AppColors.primaryBlue.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.ac_unit_rounded, color: AppColors.primaryBlue, size: 24),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(mockBooking.serviceName, style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                            Text('Booking ID ${mockBooking.bookingId}', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 28),
              ],

              // Action CTA Button (Deep linking into related screen)
              PrimaryButton(
                text: _getActionText(notification.type),
                onPressed: () {
                  if (notification.type == 'VENDOR_ASSIGNED') {
                    Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => BookingTrackingScreen(booking: mockBooking)),
                    );
                  } else if (notification.type == 'REFUND') {
                    Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => RefundStatusScreen(booking: mockBooking)),
                    );
                  } else {
                    Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => BookingDetailScreen(booking: mockBooking)),
                    );
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  IconData _getNotificationIcon(String type) {
    switch (type) {
      case 'DEMAND':
        return Icons.local_fire_department_rounded;
      case 'PRICE_DROP':
        return Icons.arrow_downward_rounded;
      case 'SERVICE_SCHEDULED':
        return Icons.calendar_month_rounded;
      case 'VENDOR_ASSIGNED':
        return Icons.person_rounded;
      case 'PAYMENT':
        return Icons.check_circle_rounded;
      case 'REFUND':
        return Icons.currency_rupee_rounded;
      default:
        return Icons.notifications_rounded;
    }
  }

  Color _getNotificationColor(String type) {
    switch (type) {
      case 'DEMAND':
        return AppColors.warningAmber;
      case 'PRICE_DROP':
      case 'PAYMENT':
      case 'REFUND':
        return AppColors.secondaryGreen;
      case 'SERVICE_SCHEDULED':
      case 'VENDOR_ASSIGNED':
      default:
        return AppColors.primaryBlue;
    }
  }

  String _getActionText(String type) {
    switch (type) {
      case 'VENDOR_ASSIGNED':
        return 'TRACK BOOKING';
      case 'REFUND':
        return 'VIEW REFUND STATUS';
      default:
        return 'VIEW BOOKING';
    }
  }
}
