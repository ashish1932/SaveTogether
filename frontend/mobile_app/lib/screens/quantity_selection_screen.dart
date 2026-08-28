import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../core/constants/app_colors.dart';
import '../models/service.dart';
import '../providers/booking_provider.dart';
import '../widgets/booking/step_progress_indicator.dart';
import '../widgets/buttons/primary_button.dart';
import 'bulk_pricing_demand_screen.dart';

class QuantitySelectionScreen extends StatefulWidget {
  final Service service;

  const QuantitySelectionScreen({
    super.key,
    required this.service,
  });

  @override
  State<QuantitySelectionScreen> createState() => _QuantitySelectionScreenState();
}

class _QuantitySelectionScreenState extends State<QuantitySelectionScreen> {
  int _quantity = 2;

  @override
  Widget build(BuildContext context) {
    final bookingProvider = Provider.of<BookingProvider>(context);
    final double unitPrice = 699.0;
    final double totalAmount = _quantity * unitPrice;

    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Quantity Selection', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Step 2 of 7
            const StepProgressIndicator(currentStep: 2),

            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  children: [
                    const SizedBox(height: 16),
                    Text(
                      'How many ACs?',
                      style: GoogleFonts.inter(
                        fontSize: 26,
                        fontWeight: FontWeight.w700, // H1 Bold
                        color: AppColors.deepNavy,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Select how many ACs you want to service',
                      style: GoogleFonts.inter(fontSize: 14, color: AppColors.textSecondary),
                    ),
                    const SizedBox(height: 36),

                    // Large Quantity Selector Controls [-] 2 [+]
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        GestureDetector(
                          onTap: _quantity > 1 ? () => setState(() => _quantity--) : null,
                          child: Container(
                            width: 54,
                            height: 54,
                            decoration: BoxDecoration(
                              color: _quantity > 1 ? AppColors.softBlueWhite : Colors.grey.shade100,
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(
                                color: _quantity > 1 ? AppColors.primaryBlue : Colors.grey.shade300,
                                width: 1.5,
                              ),
                            ),
                            child: Center(
                              child: Text(
                                '−',
                                style: GoogleFonts.inter(
                                  fontSize: 28,
                                  fontWeight: FontWeight.bold,
                                  color: _quantity > 1 ? AppColors.primaryBlue : Colors.grey,
                                ),
                              ),
                            ),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 36),
                          child: Text(
                            '$_quantity',
                            style: GoogleFonts.inter(
                              fontSize: 36,
                              fontWeight: FontWeight.w700,
                              color: AppColors.deepNavy,
                            ),
                          ),
                        ),
                        GestureDetector(
                          onTap: () => setState(() => _quantity++),
                          child: Container(
                            width: 54,
                            height: 54,
                            decoration: BoxDecoration(
                              color: AppColors.primaryBlue,
                              borderRadius: BorderRadius.circular(14),
                            ),
                            child: const Center(
                              child: Text(
                                '+',
                                style: TextStyle(
                                  fontSize: 28,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 36),

                    // Unit Price Card
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.pureWhite,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
                      ),
                      child: Column(
                        children: [
                          Text(
                            '₹${unitPrice.toInt()} / AC',
                            style: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.bold, color: AppColors.primaryBlue),
                          ),
                          const SizedBox(height: 2),
                          Text('Current price', style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Total Amount Breakdown
                    Text('Total Amount', style: GoogleFonts.inter(fontSize: 14, color: AppColors.textSecondary)),
                    const SizedBox(height: 4),
                    Text(
                      '₹${totalAmount.toInt()}',
                      style: GoogleFonts.inter(fontSize: 32, fontWeight: FontWeight.w700, color: AppColors.deepNavy),
                    ),
                    Text(
                      '(₹${unitPrice.toInt()} × $_quantity ACs)',
                      style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary),
                    ),
                    const Spacer(),

                    // Information Card
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: AppColors.primaryBlue.withValues(alpha: 0.08),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.info_outline_rounded, color: AppColors.primaryBlue, size: 20),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              'Price may go down further when more people book in your area.',
                              style: GoogleFonts.inter(fontSize: 13, color: AppColors.primaryBlue, height: 1.3),
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
                  bookingProvider.updateQuantity(_quantity);
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => BulkPricingDemandScreen(service: widget.service, quantity: _quantity),
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
