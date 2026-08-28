import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_colors.dart';

enum DemandCampaignState { normal, almostUnlocked, tierUnlocked, campaignClosed }

class DemandProgressBar extends StatelessWidget {
  final int currentQty;
  final int targetQty;
  final String unitLabel;
  final DemandCampaignState state;

  const DemandProgressBar({
    super.key,
    required this.currentQty,
    required this.targetQty,
    required this.unitLabel,
    this.state = DemandCampaignState.normal,
  });

  @override
  Widget build(BuildContext context) {
    final double progress = (targetQty > 0 ? (currentQty / targetQty) : 1.0).clamp(0.0, 1.0);
    final int qtyNeeded = (targetQty - currentQty).clamp(0, 9999);

    Color barColor = AppColors.secondaryGreen;
    if (state == DemandCampaignState.almostUnlocked) barColor = AppColors.warningAmber;
    if (state == DemandCampaignState.tierUnlocked) barColor = AppColors.secondaryGreen;
    if (state == DemandCampaignState.campaignClosed) barColor = AppColors.textSecondary;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              '$currentQty / $targetQty ${unitLabel}s',
              style: GoogleFonts.inter(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: AppColors.deepNavy,
              ),
            ),
            if (state == DemandCampaignState.campaignClosed)
              Text(
                'Campaign Closed',
                style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textSecondary),
              )
            else if (qtyNeeded > 0)
              Text(
                '$qtyNeeded more needed',
                style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: barColor),
              )
            else
              Text(
                'Tier Unlocked! 🎉',
                style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.secondaryGreen),
              ),
          ],
        ),
        const SizedBox(height: 8),
        ClipRRect(
          borderRadius: BorderRadius.circular(6),
          child: LinearProgressIndicator(
            value: progress,
            minHeight: 8,
            backgroundColor: AppColors.softBlueWhite,
            valueColor: AlwaysStoppedAnimation<Color>(barColor),
          ),
        ),
      ],
    );
  }
}
