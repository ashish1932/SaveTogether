import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../widgets/buttons/primary_button.dart';
import '../widgets/buttons/secondary_button.dart';
import 'rate_service_screen.dart';
import 'main_navigation_screen.dart';

class ServiceCompletedScreen extends StatelessWidget {
  final String bookingId;

  const ServiceCompletedScreen({
    super.key,
    this.bookingId = '#BK10245',
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            children: [
              const Spacer(),

              // Service Completed Icon Graphic
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: AppColors.secondaryGreen.withValues(alpha: 0.12),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.check_circle_rounded, color: AppColors.secondaryGreen, size: 64),
              ),
              const SizedBox(height: 20),

              Text(
                'SERVICE COMPLETED!',
                style: GoogleFonts.inter(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: AppColors.secondaryGreen,
                  letterSpacing: 1,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'Your service has been completed successfully.',
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(fontSize: 14, color: AppColors.textSecondary),
              ),
              const SizedBox(height: 28),

              // Booking Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
                ),
                child: Column(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppColors.primaryBlue.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.ac_unit_rounded, color: AppColors.primaryBlue, size: 36),
                    ),
                    const SizedBox(height: 12),
                    Text('AC Servicing', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                    Text('2 ACs • Power Jet Wash', style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary)),
                    const SizedBox(height: 10),
                    Text('Booking ID $bookingId', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
                    const Divider(height: 24),

                    Text('How was your experience?', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(5, (index) {
                        return IconButton(
                          icon: const Icon(Icons.star_outline_rounded, color: AppColors.warningAmber, size: 28),
                          onPressed: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(builder: (_) => RateServiceScreen(bookingId: bookingId)),
                            );
                          },
                        );
                      }),
                    ),
                  ],
                ),
              ),
              const Spacer(),

              PrimaryButton(
                text: 'RATE SERVICE',
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => RateServiceScreen(bookingId: bookingId)),
                  );
                },
              ),
              const SizedBox(height: 12),
              SecondaryButton(
                text: 'DONE',
                onPressed: () {
                  Navigator.of(context).pushAndRemoveUntil(
                    MaterialPageRoute(builder: (_) => const MainNavigationScreen()),
                    (route) => false,
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
