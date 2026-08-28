import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../models/referral.dart';

class RewardDetailScreen extends StatelessWidget {
  final RewardTransactionItem transaction;

  const RewardDetailScreen({
    super.key,
    required this.transaction,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Reward Details', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: AppColors.secondaryGreen.withValues(alpha: 0.12),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.card_giftcard_rounded, color: AppColors.secondaryGreen, size: 56),
              ),
              const SizedBox(height: 16),

              Text(
                '${transaction.isCredit ? '+' : '-'} ₹${transaction.amount.toInt()}',
                style: GoogleFonts.inter(fontSize: 32, fontWeight: FontWeight.bold, color: transaction.isCredit ? AppColors.secondaryGreen : AppColors.deepNavy),
              ),
              Text(transaction.title, style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
              const SizedBox(height: 24),

              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
                ),
                child: Column(
                  children: [
                    _buildRow('Status', transaction.status, isBadge: true),
                    const Divider(height: 24),
                    _buildRow('Referral Contact', transaction.subtitle),
                    const Divider(height: 24),
                    _buildRow('Earned Date', transaction.dateText),
                    const Divider(height: 24),
                    _buildRow('Referral Code', 'ASHISH20'),
                    const Divider(height: 24),
                    _buildRow('Related Booking', '#BK10245'),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRow(String label, String val, {bool isBadge = false}) {
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
            child: Text(val, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.secondaryGreen)),
          )
        else
          Text(val, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
      ],
    );
  }
}
