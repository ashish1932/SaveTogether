import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../models/booking.dart';
import '../widgets/common/status_badge.dart';
import '../widgets/buttons/primary_button.dart';
import '../widgets/buttons/secondary_button.dart';
import 'booking_tracking_screen.dart';
import 'reschedule_screen.dart';
import 'cancel_booking_screen.dart';
import 'service_completed_screen.dart';

class BookingDetailScreen extends StatelessWidget {
  final Booking booking;

  const BookingDetailScreen({
    super.key,
    required this.booking,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Booking Details', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
        actions: [
          IconButton(
            icon: const Icon(Icons.share_outlined, color: AppColors.deepNavy),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('✓ Booking details copied to clipboard')),
              );
            },
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header Service Graphic & Status Badge
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.deepNavy.withValues(alpha: 0.04),
                      blurRadius: 10,
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      width: 56,
                      height: 56,
                      decoration: BoxDecoration(
                        color: AppColors.primaryBlue.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.ac_unit_rounded, color: AppColors.primaryBlue, size: 30),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                booking.serviceName,
                                style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
                              ),
                              StatusBadge(status: booking.status),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text('${booking.quantity} ACs', style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary)),
                          const SizedBox(height: 2),
                          Row(
                            children: [
                              Text('Booking ID ', style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
                              Text(booking.bookingId, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Booking Schedule & Location Details Box
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.1)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('BOOKING INFORMATION', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5)),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Date', style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary)),
                        Text('Sunday, 25 May 2025', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Time', style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary)),
                        Text('9:00 AM – 12:00 PM', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
                      ],
                    ),
                    const Divider(height: 20),
                    Text('Address', style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
                    const SizedBox(height: 2),
                    Text(
                      'ABC Residency, Block A, Flat 402\nMain Road, Salem – 636001',
                      style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.deepNavy, height: 1.4),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Pricing Details Box
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.1)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('PRICING DETAILS', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5)),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Price per AC', style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary)),
                        Text('₹699', style: GoogleFonts.inter(fontSize: 13, color: AppColors.deepNavy)),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Quantity', style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary)),
                        Text('× ${booking.quantity}', style: GoogleFonts.inter(fontSize: 13, color: AppColors.deepNavy)),
                      ],
                    ),
                    const Divider(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Total Amount', style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                        Text('₹${booking.totalAmount.toInt()}', style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Payment Status Box
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.secondaryGreen.withValues(alpha: 0.3)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.payment_rounded, color: AppColors.primaryBlue, size: 20),
                        const SizedBox(width: 10),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Payment Method', style: GoogleFonts.inter(fontSize: 11, color: AppColors.textSecondary)),
                            Text('UPI (PhonePe)', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                          ],
                        ),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.secondaryGreen.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text('✓ Paid', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.secondaryGreen)),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Primary Action CTA: TRACK BOOKING
              PrimaryButton(
                text: 'TRACK BOOKING',
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => BookingTrackingScreen(booking: booking),
                    ),
                  );
                },
              ),
              const SizedBox(height: 10),
              SecondaryButton(
                text: '✓ VIEW COMPLETED SERVICE & RATE',
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => ServiceCompletedScreen(bookingId: booking.id),
                    ),
                  );
                },
              ),
              const SizedBox(height: 12),

              // Action buttons: RESCHEDULE / CANCEL BOOKING
              Row(
                children: [
                  Expanded(
                    child: SecondaryButton(
                      text: 'RESCHEDULE',
                      onPressed: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => RescheduleScreen(booking: booking),
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => CancelBookingScreen(booking: booking),
                          ),
                        );
                      },
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppColors.errorRed,
                        side: const BorderSide(color: AppColors.errorRed),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: Text('CANCEL', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
