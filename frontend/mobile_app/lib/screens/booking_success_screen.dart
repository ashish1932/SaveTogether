import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../models/booking.dart';
import '../widgets/buttons/primary_button.dart';
import '../widgets/buttons/secondary_button.dart';
import 'booking_detail_screen.dart';
import 'main_navigation_screen.dart';

class BookingSuccessScreen extends StatelessWidget {
  final Booking booking;

  const BookingSuccessScreen({
    super.key,
    required this.booking,
  });

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      child: Scaffold(
        backgroundColor: AppColors.softBlueWhite,
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(28.0),
            child: Column(
              children: [
                const Spacer(),

                // Animated Checkmark Circle Graphic
                Container(
                  padding: const EdgeInsets.all(28),
                  decoration: BoxDecoration(
                    color: AppColors.secondaryGreen.withValues(alpha: 0.12),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.check_circle_rounded, color: AppColors.secondaryGreen, size: 84),
                ),
                const SizedBox(height: 28),

                Text(
                  'BOOKING CONFIRMED!',
                  style: GoogleFonts.inter(
                    fontSize: 24,
                    fontWeight: FontWeight.w700, // Bold Navy
                    color: AppColors.deepNavy,
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(height: 8),

                Text(
                  'Your service has been booked successfully.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.inter(fontSize: 14, color: AppColors.textSecondary),
                ),
                const SizedBox(height: 28),

                // Booking Info Summary Box
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: AppColors.pureWhite,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.deepNavy.withValues(alpha: 0.05),
                        blurRadius: 12,
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      Row(
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
                                Text(
                                  booking.serviceName,
                                  style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'Quantity: ${booking.quantity} ACs',
                                  style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const Divider(height: 24),
                      Text('Booking ID', style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
                      const SizedBox(height: 2),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            booking.bookingId,
                            style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.primaryBlue),
                          ),
                          const SizedBox(width: 6),
                          const Icon(Icons.copy_rounded, size: 16, color: AppColors.primaryBlue),
                        ],
                      ),
                    ],
                  ),
                ),
                const Spacer(),

                // Primary CTA: VIEW BOOKING
                PrimaryButton(
                  text: 'VIEW BOOKING',
                  onPressed: () {
                    Navigator.of(context).pushReplacement(
                      MaterialPageRoute(
                        builder: (_) => BookingDetailScreen(booking: booking),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 12),

                // Secondary CTA: GO TO HOME
                SecondaryButton(
                  text: 'GO TO HOME',
                  onPressed: () {
                    Navigator.of(context).pushReplacement(
                      MaterialPageRoute(builder: (_) => const MainNavigationScreen()),
                    );
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
