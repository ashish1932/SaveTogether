import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';

class ReferralRulesScreen extends StatelessWidget {
  const ReferralRulesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('How Referrals Work', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'HOW IT WORKS',
                style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5),
              ),
              const SizedBox(height: 16),

              _buildStepCard('1', 'Share Your Link', 'Invite your friends & neighbors using your referral link or code ASHISH20.', Icons.share_rounded, AppColors.primaryBlue),
              _buildStepCard('2', 'They Join SaveTogether', 'They sign up on SaveTogether using your referral link or code.', Icons.person_add_rounded, AppColors.secondaryGreen),
              _buildStepCard('3', 'They Complete Booking', 'They complete an eligible service booking in your society.', Icons.check_circle_rounded, AppColors.warningAmber),
              _buildStepCard('4', 'You Earn Rewards', 'You earn ₹50 when their booking is successfully completed.', Icons.card_giftcard_rounded, AppColors.primaryBlue, isLast: true),

              const SizedBox(height: 28),

              Text('TERMS & CONDITIONS', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5)),
              const SizedBox(height: 12),

              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildRuleBullet('Referral rewards are credited once the referred user completes an eligible service.'),
                    _buildRuleBullet('Minimum booking amount to qualify for referral reward is ₹500.'),
                    _buildRuleBullet('Self-referrals or duplicate accounts are strictly ineligible.'),
                    _buildRuleBullet('Rewards can be redeemed towards future service bookings on SaveTogether.'),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStepCard(String num, String title, String description, IconData icon, Color color, {bool isLast = false}) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.12),
                shape: BoxShape.circle,
                border: Border.all(color: color, width: 1.5),
              ),
              child: Center(
                child: Text(num, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: color)),
              ),
            ),
            if (!isLast)
              Container(
                width: 2,
                height: 48,
                color: color.withValues(alpha: 0.3),
              ),
          ],
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
              const SizedBox(height: 4),
              Text(description, style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary, height: 1.4)),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildRuleBullet(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('• ', style: TextStyle(color: AppColors.primaryBlue, fontWeight: FontWeight.bold)),
          Expanded(
            child: Text(text, style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary, height: 1.4)),
          ),
        ],
      ),
    );
  }
}
