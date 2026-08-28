import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_colors.dart';
import '../buttons/primary_button.dart';

class DemandOpportunityCard extends StatelessWidget {
  final String serviceName;
  final String imageUrl;
  final int aggregatedQty;
  final String unitLabel;
  final double currentPrice;
  final double nextPrice;
  final int totalTargetQty;
  final int qtyNeededForNextTier;
  final double savingsAmount;
  final VoidCallback onBookNow;

  const DemandOpportunityCard({
    super.key,
    required this.serviceName,
    this.imageUrl = 'assets/images/app_logo.jpg',
    required this.aggregatedQty,
    required this.unitLabel,
    required this.currentPrice,
    required this.nextPrice,
    required this.totalTargetQty,
    required this.qtyNeededForNextTier,
    required this.savingsAmount,
    required this.onBookNow,
  });

  @override
  Widget build(BuildContext context) {
    final double progress = (aggregatedQty / totalTargetQty).clamp(0.0, 1.0);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.pureWhite,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.15)),
        boxShadow: [
          BoxShadow(
            color: AppColors.deepNavy.withValues(alpha: 0.06),
            blurRadius: 14,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Demand Badge & Savings Pill Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.warningAmber.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.local_fire_department_rounded, color: AppColors.warningAmber, size: 16),
                    const SizedBox(width: 4),
                    Text(
                      '🔥 $aggregatedQty ${unitLabel}s booked nearby',
                      style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.warningAmber),
                    ),
                  ],
                ),
              ),
              if (savingsAmount > 0)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.secondaryGreen.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppColors.secondaryGreen, width: 1),
                  ),
                  child: Text(
                    '💚 SAVE ₹${savingsAmount.toInt()}',
                    style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.secondaryGreen),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 14),

          // Service Title (H3 18px SemiBold Navy)
          Text(
            serviceName,
            style: GoogleFonts.inter(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: AppColors.deepNavy,
            ),
          ),
          const SizedBox(height: 12),

          // Current Price vs Next Price Ladder Display
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Current price', style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
                    const SizedBox(height: 2),
                    Text(
                      '₹${currentPrice.toInt()} / $unitLabel',
                      style: GoogleFonts.inter(
                        fontSize: 22,
                        fontWeight: FontWeight.w700, // H2 Bold Navy
                        color: AppColors.deepNavy,
                      ),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Next price', style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
                    const SizedBox(height: 2),
                    Text(
                      '₹${nextPrice.toInt()} / $unitLabel',
                      style: GoogleFonts.inter(
                        fontSize: 20,
                        fontWeight: FontWeight.w700, // Bold Green
                        color: AppColors.secondaryGreen,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Progress Bar (18 / 20 ACs)
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '$aggregatedQty / $totalTargetQty ${unitLabel}s',
                style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
              ),
              Text(
                '$qtyNeededForNextTier more bookings needed',
                style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.secondaryGreen),
              ),
            ],
          ),
          const SizedBox(height: 6),
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: LinearProgressIndicator(
              value: progress,
              minHeight: 8,
              backgroundColor: AppColors.softBlueWhite,
              valueColor: const AlwaysStoppedAnimation<Color>(AppColors.secondaryGreen),
            ),
          ),
          const SizedBox(height: 18),

          // BOOK NOW CTA Button
          PrimaryButton(
            text: 'BOOK NOW →',
            onPressed: onBookNow,
          ),
        ],
      ),
    );
  }
}
