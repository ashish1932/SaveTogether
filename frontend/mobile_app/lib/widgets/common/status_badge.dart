import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_colors.dart';

class StatusBadge extends StatelessWidget {
  final String status;

  const StatusBadge({
    super.key,
    required this.status,
  });

  @override
  Widget build(BuildContext context) {
    Color bgColor = AppColors.primaryBlue.withValues(alpha: 0.12);
    Color textColor = AppColors.primaryBlue;

    final upperStatus = status.toUpperCase();

    if (upperStatus.contains('COMPLETED')) {
      bgColor = AppColors.secondaryGreen.withValues(alpha: 0.12);
      textColor = AppColors.secondaryGreen;
    } else if (upperStatus.contains('PENDING')) {
      bgColor = AppColors.warningAmber.withValues(alpha: 0.12);
      textColor = AppColors.warningAmber;
    } else if (upperStatus.contains('CANCELLED') || upperStatus.contains('FAILED')) {
      bgColor = AppColors.errorRed.withValues(alpha: 0.12);
      textColor = AppColors.errorRed;
    } else if (upperStatus.contains('REFUND')) {
      bgColor = Colors.purple.withValues(alpha: 0.12);
      textColor = Colors.purple;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        '[$upperStatus]',
        style: GoogleFonts.inter(
          fontSize: 11,
          fontWeight: FontWeight.bold,
          color: textColor,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}
