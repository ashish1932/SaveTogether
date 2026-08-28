import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_colors.dart';
import '../../models/pricing_tier.dart';

class PricingLadder extends StatelessWidget {
  final List<PricingTier> tiers;
  final int currentActiveTierLevel;

  const PricingLadder({
    super.key,
    required this.tiers,
    required this.currentActiveTierLevel,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
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
        children: tiers.map((tier) {
          final isCurrentTarget = tier.tierLevel == currentActiveTierLevel;

          return Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: isCurrentTarget ? AppColors.secondaryGreen.withValues(alpha: 0.12) : Colors.transparent,
              border: Border(
                bottom: BorderSide(color: AppColors.primaryBlue.withValues(alpha: 0.06)),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Text(
                      '${tier.minQty}–${tier.maxQty == 999 ? '60+' : tier.maxQty}',
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        fontWeight: isCurrentTarget ? FontWeight.bold : FontWeight.normal,
                        color: isCurrentTarget ? AppColors.deepNavy : AppColors.textSecondary,
                      ),
                    ),
                    if (isCurrentTarget) ...[
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.secondaryGreen,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          '✓ CURRENT TARGET',
                          style: GoogleFonts.inter(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
                Text(
                  '₹${tier.unitPrice.toInt()}',
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: isCurrentTarget ? AppColors.secondaryGreen : AppColors.deepNavy,
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }
}
