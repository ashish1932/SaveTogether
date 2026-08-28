import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../core/constants/app_colors.dart';
import '../models/service.dart';
import '../providers/booking_provider.dart';
import '../widgets/booking/step_progress_indicator.dart';
import '../widgets/buttons/primary_button.dart';
import 'quantity_selection_screen.dart';

class ServiceDetailsScreen extends StatelessWidget {
  final Service service;

  const ServiceDetailsScreen({
    super.key,
    required this.service,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text(service.name, style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
        actions: [
          IconButton(
            icon: const Icon(Icons.favorite_border_rounded, color: AppColors.errorRed),
            onPressed: () {},
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Progress Step 1 of 7
            const StepProgressIndicator(currentStep: 1),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // AC Service Professional Image Banner
                    Container(
                      height: 170,
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: AppColors.pureWhite,
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.deepNavy.withValues(alpha: 0.06),
                            blurRadius: 12,
                          ),
                        ],
                        border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(20),
                        child: Image.asset(
                          'assets/images/splash_branding.png',
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) {
                            return Center(
                              child: Icon(Icons.ac_unit_rounded, size: 72, color: AppColors.primaryBlue.withValues(alpha: 0.6)),
                            );
                          },
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Service Name & Popular Badge
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          service.name,
                          style: GoogleFonts.inter(
                            fontSize: 22,
                            fontWeight: FontWeight.w700, // H2 Bold Navy
                            color: AppColors.deepNavy,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.secondaryGreen.withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: AppColors.secondaryGreen, width: 1),
                          ),
                          child: Text(
                            'Popular',
                            style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.secondaryGreen),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),

                    Text(
                      'Professional AC service by experienced technicians. Improve cooling and increase AC life.',
                      style: GoogleFonts.inter(fontSize: 14, color: AppColors.textSecondary, height: 1.4),
                    ),
                    const SizedBox(height: 20),

                    // Pricing Banner (Base Price ₹799 vs Current Bulk Price ₹699)
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.pureWhite,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.15)),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.deepNavy.withValues(alpha: 0.04),
                            blurRadius: 8,
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('Base Price', style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
                                    const SizedBox(height: 2),
                                    Text(
                                      '₹${service.basePrice.toInt()} / AC',
                                      style: GoogleFonts.inter(
                                        fontSize: 15,
                                        color: AppColors.textSecondary,
                                        decoration: TextDecoration.lineThrough,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('Current Bulk Price', style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
                                    const SizedBox(height: 2),
                                    Text(
                                      '₹699 / AC',
                                      style: GoogleFonts.inter(
                                        fontSize: 22,
                                        fontWeight: FontWeight.bold,
                                        color: AppColors.primaryBlue,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.secondaryGreen.withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              'You save ₹100 / AC',
                              style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.secondaryGreen),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // What's Included Section
                    Row(
                      children: [
                        Text(
                          'What\'s Included',
                          style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
                        ),
                        const SizedBox(width: 6),
                        const Icon(Icons.check_circle_rounded, color: AppColors.secondaryGreen, size: 18),
                      ],
                    ),
                    const SizedBox(height: 10),
                    ...const [
                      'AC filter cleaning',
                      'Indoor unit steam cleaning',
                      'Cooling performance check',
                      'Drain line cleaning',
                      'General AC inspection',
                    ].map((item) => Padding(
                          padding: const EdgeInsets.only(bottom: 6.0),
                          child: Row(
                            children: [
                              const Icon(Icons.check_rounded, color: AppColors.secondaryGreen, size: 16),
                              const SizedBox(width: 8),
                              Text(item, style: GoogleFonts.inter(fontSize: 13, color: AppColors.deepNavy)),
                            ],
                          ),
                        )),
                    const SizedBox(height: 20),

                    // What's Excluded Section
                    Row(
                      children: [
                        Text(
                          'What\'s Excluded',
                          style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
                        ),
                        const SizedBox(width: 6),
                        const Icon(Icons.cancel_rounded, color: AppColors.errorRed, size: 18),
                      ],
                    ),
                    const SizedBox(height: 10),
                    ...const [
                      'Gas refilling (extra)',
                      'Parts replacement (extra)',
                      'Major repair / PCB work',
                    ].map((item) => Padding(
                          padding: const EdgeInsets.only(bottom: 6.0),
                          child: Row(
                            children: [
                              const Icon(Icons.close_rounded, color: AppColors.errorRed, size: 16),
                              const SizedBox(width: 8),
                              Text(item, style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary)),
                            ],
                          ),
                        )),
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
                  Provider.of<BookingProvider>(context, listen: false).startBooking(service);
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => QuantitySelectionScreen(service: service),
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
