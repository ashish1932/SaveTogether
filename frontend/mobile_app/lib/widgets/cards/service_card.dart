import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_colors.dart';
import '../buttons/primary_button.dart';

class ServiceCard extends StatelessWidget {
  final String serviceName;
  final double currentPrice;
  final String unitLabel;
  final int aggregatedQty;
  final double nextPrice;
  final int requiredQtyForNextPrice;
  final double progress;
  final VoidCallback onBookNow;

  const ServiceCard({
    super.key,
    required this.serviceName,
    required this.currentPrice,
    required this.unitLabel,
    required this.aggregatedQty,
    required this.nextPrice,
    required this.requiredQtyForNextPrice,
    required this.progress,
    required this.onBookNow,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.pureWhite,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
        boxShadow: [
          BoxShadow(
            color: AppColors.deepNavy.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Service Title (H3 18px SemiBold)
          Text(
            serviceName,
            style: GoogleFonts.inter(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: AppColors.deepNavy,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            '$aggregatedQty ${unitLabel}s booked in society',
            style: GoogleFonts.inter(
              fontSize: 12,
              fontWeight: FontWeight.w400,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 12),

          // Current Price (H2 22px Bold Navy)
          Text(
            '₹${currentPrice.toInt()} / $unitLabel',
            style: GoogleFonts.inter(
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: AppColors.deepNavy,
            ),
          ),
          const SizedBox(height: 4),

          // Next Price & Progress Bar
          Row(
            children: [
              Text(
                'Next price: ',
                style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary),
              ),
              Text(
                '₹${nextPrice.toInt()} / $unitLabel',
                style: GoogleFonts.inter(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: AppColors.secondaryGreen,
                ),
              ),
            ],
          ),
          Text(
            '$requiredQtyForNextPrice more bookings needed',
            style: GoogleFonts.inter(
              fontSize: 12,
              fontWeight: FontWeight.w400,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: LinearProgressIndicator(
              value: progress.clamp(0.0, 1.0),
              minHeight: 6,
              backgroundColor: AppColors.softBlueWhite,
              valueColor: const AlwaysStoppedAnimation<Color>(AppColors.secondaryGreen),
            ),
          ),
          const SizedBox(height: 16),

          // Book Now CTA Button (Primary 15px SemiBold Height 48px)
          PrimaryButton(
            text: 'Book Now',
            onPressed: onBookNow,
          ),
        ],
      ),
    );
  }
}
