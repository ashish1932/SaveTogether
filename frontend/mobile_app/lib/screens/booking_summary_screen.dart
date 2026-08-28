import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../models/service.dart';
import '../models/address.dart';
import '../widgets/booking/step_progress_indicator.dart';
import '../widgets/buttons/primary_button.dart';
import 'payment_screen.dart';

class BookingSummaryScreen extends StatelessWidget {
  final Service service;
  final int quantity;
  final DateTime selectedDate;
  final String selectedTimeSlot;
  final Address selectedAddress;
  final String societyName;

  const BookingSummaryScreen({
    super.key,
    required this.service,
    required this.quantity,
    required this.selectedDate,
    required this.selectedTimeSlot,
    required this.selectedAddress,
    required this.societyName,
  });

  @override
  Widget build(BuildContext context) {
    const double unitPrice = 699.0;
    final double totalAmount = quantity * unitPrice;

    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Review Your Booking', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Step 7 of 7
            const StepProgressIndicator(currentStep: 7),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Review Your Booking',
                      style: GoogleFonts.inter(
                        fontSize: 26,
                        fontWeight: FontWeight.w700, // H1 Bold
                        color: AppColors.deepNavy,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Please review your details before payment',
                      style: GoogleFonts.inter(fontSize: 14, color: AppColors.textSecondary),
                    ),
                    const SizedBox(height: 24),

                    // Service Overview Thumbnail Card
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
                            width: 60,
                            height: 60,
                            decoration: BoxDecoration(
                              color: AppColors.primaryBlue.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(Icons.ac_unit_rounded, color: AppColors.primaryBlue, size: 32),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  service.name,
                                  style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Quantity: $quantity ACs',
                                  style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Schedule & Location Details Card
                    Container(
                      padding: const EdgeInsets.all(18),
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
                      child: Column(
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.calendar_month_rounded, color: AppColors.primaryBlue, size: 20),
                              const SizedBox(width: 12),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('Date', style: GoogleFonts.inter(fontSize: 11, color: AppColors.textSecondary)),
                                  Text('Sunday, 25 May 2025', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
                                ],
                              ),
                            ],
                          ),
                          const Divider(height: 24),
                          Row(
                            children: [
                              const Icon(Icons.access_time_filled_rounded, color: AppColors.primaryBlue, size: 20),
                              const SizedBox(width: 12),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('Time Slot', style: GoogleFonts.inter(fontSize: 11, color: AppColors.textSecondary)),
                                  Text(selectedTimeSlot, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
                                ],
                              ),
                            ],
                          ),
                          const Divider(height: 24),
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Icon(Icons.location_on_rounded, color: AppColors.primaryBlue, size: 20),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('Address', style: GoogleFonts.inter(fontSize: 11, color: AppColors.textSecondary)),
                                    Text(
                                      '$societyName, ${selectedAddress.buildingBlock}, ${selectedAddress.flatNo}\n${selectedAddress.streetArea}, ${selectedAddress.city} – ${selectedAddress.postalCode}',
                                      style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.deepNavy, height: 1.4),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Price Breakdown Card
                    Container(
                      padding: const EdgeInsets.all(18),
                      decoration: BoxDecoration(
                        color: AppColors.pureWhite,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
                      ),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Price per AC', style: GoogleFonts.inter(fontSize: 14, color: AppColors.textSecondary)),
                              Text('₹${unitPrice.toInt()}', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Quantity', style: GoogleFonts.inter(fontSize: 14, color: AppColors.textSecondary)),
                              Text('× $quantity', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
                            ],
                          ),
                          const Divider(height: 20),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Total Amount', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                              Text('₹${totalAmount.toInt()}', style: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Green Potential Savings Info Banner
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: AppColors.secondaryGreen.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.secondaryGreen, width: 1),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.verified_outlined, color: AppColors.secondaryGreen, size: 18),
                              const SizedBox(width: 8),
                              Text(
                                'Potential savings once we reach 20 ACs',
                                style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.secondaryGreen),
                              ),
                            ],
                          ),
                          Text(
                            '₹200',
                            style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.secondaryGreen),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Primary Button CTA: CONFIRM & PROCEED TO PAY
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: PrimaryButton(
                text: 'CONFIRM & PROCEED TO PAY',
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => PaymentScreen(
                        service: service,
                        quantity: quantity,
                        totalAmount: totalAmount,
                      ),
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
