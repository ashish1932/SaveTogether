import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../models/referral.dart';

class ReferralDetailScreen extends StatelessWidget {
  final ReferralItem referral;

  const ReferralDetailScreen({
    super.key,
    required this.referral,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Referral Details', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            children: [
              // Friend Profile Avatar
              CircleAvatar(
                radius: 36,
                backgroundColor: AppColors.primaryBlue.withValues(alpha: 0.12),
                child: Text(
                  referral.friendName.substring(0, 1),
                  style: GoogleFonts.inter(fontSize: 28, fontWeight: FontWeight.bold, color: AppColors.primaryBlue),
                ),
              ),
              const SizedBox(height: 12),

              Text(
                referral.friendName,
                style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
              ),
              Text(
                referral.friendPhone,
                style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary),
              ),
              const SizedBox(height: 24),

              // Detail Card Box
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
                ),
                child: Column(
                  children: [
                    _buildDetailRow('Referral Status', referral.status.replaceAll('_', ' '), isBadge: true),
                    const Divider(height: 24),
                    _buildDetailRow('Joined Date', referral.dateText),
                    const Divider(height: 24),
                    _buildDetailRow('Qualifying Service', referral.qualifyingService ?? 'AC Servicing (2 ACs)'),
                    const Divider(height: 24),
                    _buildDetailRow('Reward Amount', '₹${referral.rewardAmount.toInt()}', isHighlight: true),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value, {bool isBadge = false, bool isHighlight = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary)),
        if (isBadge)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: AppColors.secondaryGreen.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(value, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.secondaryGreen)),
          )
        else
          Text(
            value,
            style: GoogleFonts.inter(
              fontSize: isHighlight ? 18 : 14,
              fontWeight: FontWeight.bold,
              color: isHighlight ? AppColors.secondaryGreen : AppColors.deepNavy,
            ),
          ),
      ],
    );
  }
}
