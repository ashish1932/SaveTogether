import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../core/constants/app_colors.dart';
import '../models/service.dart';
import '../providers/booking_provider.dart';
import 'order_summary_screen.dart';

class ServiceDetailScreen extends StatelessWidget {
  final Service service;

  const ServiceDetailScreen({super.key, required this.service});

  @override
  Widget build(BuildContext context) {
    final bookingProvider = Provider.of<BookingProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text(
          service.name,
          style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Banner Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppColors.primaryBlue.withValues(alpha: 0.1),
                    AppColors.pureWhite,
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.deepNavy.withValues(alpha: 0.05),
                    blurRadius: 10,
                  ),
                ],
                border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.2)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.verified_rounded, color: AppColors.primaryBlue, size: 20),
                      const SizedBox(width: 8),
                      Text(
                        'Verified Local Vendor Fulfillment',
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.primaryBlue,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    service.description,
                    style: GoogleFonts.inter(fontSize: 14, color: AppColors.deepNavy, height: 1.4),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Quantity Selection Section
            Text(
              'Select Quantity (${service.unitLabel}s)',
              style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.pureWhite,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.deepNavy.withValues(alpha: 0.05),
                    blurRadius: 8,
                  ),
                ],
                border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.1)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Number of ${service.unitLabel}s',
                        style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.deepNavy),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Unit Price: ₹${bookingProvider.currentUnitPrice.toInt()} / ${service.unitLabel}',
                        style: GoogleFonts.inter(fontSize: 13, color: AppColors.secondaryGreen, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      IconButton(
                        onPressed: () => bookingProvider.updateQuantity(bookingProvider.selectedQuantity - 1),
                        icon: const Icon(Icons.remove_circle_outline, color: AppColors.primaryBlue, size: 28),
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        child: Text(
                          '${bookingProvider.selectedQuantity}',
                          style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
                        ),
                      ),
                      IconButton(
                        onPressed: () => bookingProvider.updateQuantity(bookingProvider.selectedQuantity + 1),
                        icon: const Icon(Icons.add_circle_outline, color: AppColors.primaryBlue, size: 28),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Aggregated Pricing Tiers Table
            Text(
              'Society Volume Pricing Tiers',
              style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
            ),
            const SizedBox(height: 8),
            Text(
              'Prices apply automatically as aggregate society bookings hit tier targets.',
              style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary),
            ),
            const SizedBox(height: 12),
            Container(
              decoration: BoxDecoration(
                color: AppColors.pureWhite,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.deepNavy.withValues(alpha: 0.05),
                    blurRadius: 8,
                  ),
                ],
                border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.1)),
              ),
              child: Column(
                children: service.pricingTiers.map((tier) {
                  final isCurrentActiveTier = bookingProvider.currentTier?.tierLevel == tier.tierLevel;

                  return Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    decoration: BoxDecoration(
                      color: isCurrentActiveTier ? AppColors.secondaryGreen.withValues(alpha: 0.12) : Colors.transparent,
                      border: Border(
                        bottom: BorderSide(color: AppColors.primaryBlue.withValues(alpha: 0.06)),
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(6),
                              decoration: BoxDecoration(
                                color: isCurrentActiveTier ? AppColors.secondaryGreen : AppColors.softBlueWhite,
                                shape: BoxShape.circle,
                              ),
                              child: Text(
                                'T${tier.tierLevel}',
                                style: GoogleFonts.inter(
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                  color: isCurrentActiveTier ? Colors.white : AppColors.deepNavy,
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Text(
                              '${tier.minQty} - ${tier.maxQty == 999 ? '60+' : tier.maxQty} units',
                              style: GoogleFonts.inter(
                                fontSize: 14,
                                color: isCurrentActiveTier ? AppColors.deepNavy : AppColors.textSecondary,
                                fontWeight: isCurrentActiveTier ? FontWeight.bold : FontWeight.normal,
                              ),
                            ),
                          ],
                        ),
                        Text(
                          '₹${tier.unitPrice.toInt()} / unit',
                          style: GoogleFonts.outfit(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: isCurrentActiveTier ? AppColors.secondaryGreen : AppColors.deepNavy,
                          ),
                        ),
                      ],
                    ),
                  );
                }).toList(),
              ),
            ),
            const SizedBox(height: 24),

            // Service Checklist
            Text(
              'What is Included',
              style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
            ),
            const SizedBox(height: 12),
            ...service.included.map(
              (item) => Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Row(
                  children: [
                    const Icon(Icons.check_circle_rounded, color: AppColors.secondaryGreen, size: 18),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        item,
                        style: GoogleFonts.inter(fontSize: 13, color: AppColors.deepNavy),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 80),
          ],
        ),
      ),
      bottomSheet: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.pureWhite,
          boxShadow: [
            BoxShadow(
              color: AppColors.deepNavy.withValues(alpha: 0.08),
              blurRadius: 16,
              offset: const Offset(0, -4),
            ),
          ],
          border: Border(top: BorderSide(color: AppColors.primaryBlue.withValues(alpha: 0.1))),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Estimated Total',
                  style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary),
                ),
                Text(
                  '₹${bookingProvider.totalPrice.toInt()}',
                  style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.bold, color: AppColors.primaryBlue),
                ),
              ],
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => const OrderSummaryScreen()),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryBlue,
                foregroundColor: Colors.white,
              ),
              child: const Text('Continue to Book'),
            ),
          ],
        ),
      ),
    );
  }
}
