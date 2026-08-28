import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../models/service.dart';
import '../widgets/booking/step_progress_indicator.dart';
import '../widgets/buttons/primary_button.dart';
import 'date_selection_screen.dart';

class BulkPricingDemandScreen extends StatelessWidget {
  final Service service;
  final int quantity;

  const BulkPricingDemandScreen({
    super.key,
    required this.service,
    required this.quantity,
  });

  @override
  Widget build(BuildContext context) {
    const int currentBooked = 18;
    const int targetQty = 20;
    const int qtyNeeded = targetQty - currentBooked;
    const double progress = currentBooked / targetQty;

    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Community Demand', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Step 3 of 7
            const StepProgressIndicator(currentStep: 3),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  children: [
                    const SizedBox(height: 8),
                    Text(
                      'COMMUNITY DEMAND',
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textSecondary,
                        letterSpacing: 0.5,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '18 ACs',
                      style: GoogleFonts.inter(
                        fontSize: 32,
                        fontWeight: FontWeight.w700,
                        color: AppColors.deepNavy,
                      ),
                    ),
                    Text(
                      'booked in your area',
                      style: GoogleFonts.inter(fontSize: 14, color: AppColors.textSecondary),
                    ),
                    const SizedBox(height: 28),

                    // Two Pricing Cards (Current Price ₹699 vs Next Price ₹599)
                    Row(
                      children: [
                        Expanded(
                          child: Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: AppColors.pureWhite,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.15)),
                            ),
                            child: Column(
                              children: [
                                Text('Current Price', style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
                                const SizedBox(height: 4),
                                Text(
                                  '₹699 / AC',
                                  style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.primaryBlue),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: AppColors.secondaryGreen.withValues(alpha: 0.08),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: AppColors.secondaryGreen, width: 1),
                            ),
                            child: Column(
                              children: [
                                Text('Next Price', style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
                                const SizedBox(height: 4),
                                Text(
                                  '₹599 / AC',
                                  style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.secondaryGreen),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // Required & More Needed Info Cards
                    Row(
                      children: [
                        Expanded(
                          child: Container(
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: AppColors.pureWhite,
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.1)),
                            ),
                            child: Column(
                              children: [
                                Text(
                                  '$targetQty ACs',
                                  style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'Required to unlock next price',
                                  textAlign: TextAlign.center,
                                  style: GoogleFonts.inter(fontSize: 11, color: AppColors.textSecondary),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Container(
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: AppColors.pureWhite,
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(color: AppColors.warningAmber.withValues(alpha: 0.3)),
                            ),
                            child: Column(
                              children: [
                                Text(
                                  '$qtyNeeded ACs',
                                  style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.warningAmber),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'more needed',
                                  textAlign: TextAlign.center,
                                  style: GoogleFonts.inter(fontSize: 11, color: AppColors.warningAmber, fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),

                    // Progress Bar Display
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          '$currentBooked / $targetQty ACs',
                          style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(6),
                      child: const LinearProgressIndicator(
                        value: progress,
                        minHeight: 8,
                        backgroundColor: AppColors.softBlueWhite,
                        valueColor: AlwaysStoppedAnimation<Color>(AppColors.secondaryGreen),
                      ),
                    ),
                    const SizedBox(height: 28),

                    // Green Savings Banner Card
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.secondaryGreen.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.secondaryGreen, width: 1),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.info_outline_rounded, color: AppColors.secondaryGreen, size: 22),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              'You could save ₹200 / AC once we reach $targetQty ACs',
                              style: GoogleFonts.inter(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: AppColors.secondaryGreen,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Primary Button CTA: CONTINUE
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: PrimaryButton(
                text: 'CONTINUE',
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => DateSelectionScreen(service: service, quantity: quantity),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
