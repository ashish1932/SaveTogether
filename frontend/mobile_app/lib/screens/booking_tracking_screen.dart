import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../models/booking.dart';
import '../widgets/booking/booking_timeline.dart';

class BookingTrackingScreen extends StatelessWidget {
  final Booking booking;

  const BookingTrackingScreen({
    super.key,
    required this.booking,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Track Booking', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.deepNavy.withValues(alpha: 0.04),
                      blurRadius: 8,
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppColors.primaryBlue.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.ac_unit_rounded, color: AppColors.primaryBlue, size: 28),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(booking.serviceName, style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                          const SizedBox(height: 2),
                          Text('Booking ID ${booking.bookingId}', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              Text(
                'SERVICE STATUS TIMELINE',
                style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.textSecondary, letterSpacing: 0.5),
              ),
              const SizedBox(height: 16),

              // Reusable Booking Timeline
              BookingTimeline(
                steps: [
                  TimelineStep(title: '✓ Booking Placed (Sun, 18 May)', isDone: true),
                  TimelineStep(title: '✓ Demand Aggregating (Local community)', isDone: true),
                  TimelineStep(title: '✓ Admin Processing (Arrangements)', isDone: true),
                  TimelineStep(title: '✓ Vendor Assigned (Service Provider)', isDone: true),
                  TimelineStep(title: 'Service Scheduled (Sun, 25 May, 9 AM – 12 PM)', isDone: false, isCurrent: true),
                  TimelineStep(title: 'Service Completed', isDone: false),
                ],
              ),
              const SizedBox(height: 24),

              // Notification hint banner
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.primaryBlue.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.notifications_active_rounded, color: AppColors.primaryBlue, size: 20),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'We will notify you at each important step of your service.',
                        style: GoogleFonts.inter(fontSize: 12, color: AppColors.primaryBlue, height: 1.3),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
