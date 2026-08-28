import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_colors.dart';
import '../../models/society.dart';

class SocietyDetailsCard extends StatelessWidget {
  final Society society;

  const SocietyDetailsCard({
    super.key,
    required this.society,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.pureWhite,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.15)),
        boxShadow: [
          BoxShadow(
            color: AppColors.deepNavy.withValues(alpha: 0.05),
            blurRadius: 12,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Society Graphic Header
          Container(
            height: 120,
            width: double.infinity,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  AppColors.primaryBlue.withValues(alpha: 0.12),
                  AppColors.secondaryGreen.withValues(alpha: 0.12),
                ],
              ),
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Center(
              child: Icon(Icons.apartment_rounded, size: 64, color: AppColors.primaryBlue),
            ),
          ),
          const SizedBox(height: 20),

          // Society Name (H2 22px Bold Navy)
          Text(
            society.name,
            style: GoogleFonts.inter(
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: AppColors.deepNavy,
            ),
          ),
          const SizedBox(height: 8),

          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Icon(Icons.location_on_rounded, color: AppColors.primaryBlue, size: 18),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  society.address,
                  style: GoogleFonts.inter(fontSize: 14, color: AppColors.deepNavy, height: 1.4),
                ),
              ),
            ],
          ),
          const Divider(height: 28),

          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('City', style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
                    const SizedBox(height: 2),
                    Text(society.city, style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
                  ],
                ),
              ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('PIN Code', style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
                    const SizedBox(height: 2),
                    Text(society.postalCode, style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
