import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_colors.dart';

class PaymentSummaryCard extends StatelessWidget {
  final String serviceName;
  final int quantity;
  final String unitLabel;
  final double serviceAmount;
  final double platformFee;
  final double gstAmount;
  final double discountAmount;
  final double creditsUsed;

  const PaymentSummaryCard({
    super.key,
    required this.serviceName,
    required this.quantity,
    required this.unitLabel,
    required this.serviceAmount,
    this.platformFee = 0.0,
    this.gstAmount = 0.0,
    this.discountAmount = 0.0,
    this.creditsUsed = 0.0,
  });

  double get totalAmount => serviceAmount + platformFee + gstAmount - discountAmount - creditsUsed;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.pureWhite,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
        boxShadow: [
          BoxShadow(
            color: AppColors.deepNavy.withValues(alpha: 0.04),
            blurRadius: 10,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                serviceName,
                style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
              ),
              Text(
                '$quantity ${unitLabel}s',
                style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.primaryBlue),
              ),
            ],
          ),
          const Divider(height: 20),

          _buildRow('Service Amount', '₹${serviceAmount.toInt()}'),
          if (platformFee > 0) _buildRow('Platform Fee', '₹${platformFee.toInt()}'),
          if (gstAmount > 0) _buildRow('GST', '₹${gstAmount.toInt()}'),
          if (discountAmount > 0) _buildRow('Referral Discount', '-₹${discountAmount.toInt()}', isGreen: true),
          if (creditsUsed > 0) _buildRow('Credits Used', '-₹${creditsUsed.toInt()}', isGreen: true),

          const Divider(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'TOTAL',
                style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
              ),
              Text(
                '₹${totalAmount.toInt()}',
                style: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.bold, color: AppColors.primaryBlue),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRow(String label, String value, {bool isGreen = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary)),
          Text(
            value,
            style: GoogleFonts.inter(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: isGreen ? AppColors.secondaryGreen : AppColors.deepNavy,
            ),
          ),
        ],
      ),
    );
  }
}
