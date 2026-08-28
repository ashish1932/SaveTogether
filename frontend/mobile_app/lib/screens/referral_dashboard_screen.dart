import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../widgets/buttons/primary_button.dart';
import '../widgets/referral/share_referral_sheet.dart';
import 'rewards_wallet_screen.dart';
import 'referral_history_screen.dart';
import 'referral_rules_screen.dart';

class ReferralDashboardScreen extends StatelessWidget {
  const ReferralDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const String referralCode = 'ASHISH20';

    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Refer & Earn', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
        actions: [
          IconButton(
            icon: const Icon(Icons.help_outline_rounded, color: AppColors.deepNavy),
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const ReferralRulesScreen()),
              );
            },
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header Invite Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.15)),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.deepNavy.withValues(alpha: 0.05),
                      blurRadius: 10,
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.secondaryGreen.withValues(alpha: 0.12),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.card_giftcard_rounded, color: AppColors.secondaryGreen, size: 44),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      '🎁 INVITE & EARN',
                      style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Share SaveTogether with your friends and neighbors to unlock rewards.',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary, height: 1.4),
                    ),
                    const SizedBox(height: 20),

                    // Referral Code Box with Copy action
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(
                        color: AppColors.softBlueWhite,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.2)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('YOUR REFERRAL CODE', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
                              Text(referralCode, style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.primaryBlue, letterSpacing: 1)),
                            ],
                          ),
                          OutlinedButton.icon(
                            onPressed: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('✓ Referral code ASHISH20 copied!'),
                                  backgroundColor: AppColors.secondaryGreen,
                                ),
                              );
                            },
                            style: OutlinedButton.styleFrom(
                              foregroundColor: AppColors.primaryBlue,
                              side: const BorderSide(color: AppColors.primaryBlue),
                            ),
                            icon: const Icon(Icons.copy_rounded, size: 16),
                            label: const Text('COPY'),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Reward Incentive Badge
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: AppColors.secondaryGreen.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        '₹50 PER SUCCESSFUL REFERRAL',
                        style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.secondaryGreen),
                      ),
                    ),
                    const SizedBox(height: 20),

                    // SHARE NOW CTA Button
                    PrimaryButton(
                      text: 'SHARE NOW',
                      onPressed: () {
                        ShareReferralSheet.show(context, code: referralCode);
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Referral Stats Grid (12 Invited, 8 Successful, 4 Pending)
              Row(
                children: [
                  Expanded(child: _buildStatBox('12', 'Invited', AppColors.deepNavy)),
                  const SizedBox(width: 10),
                  Expanded(child: _buildStatBox('8', 'Successful', AppColors.secondaryGreen)),
                  const SizedBox(width: 10),
                  Expanded(child: _buildStatBox('4', 'Pending', AppColors.warningAmber)),
                ],
              ),
              const SizedBox(height: 20),

              // Total Rewards Earned Card
              GestureDetector(
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => const RewardsWalletScreen()),
                  );
                },
                child: Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: AppColors.pureWhite,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: AppColors.secondaryGreen.withValues(alpha: 0.3)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('TOTAL REWARDS EARNED', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5)),
                          const SizedBox(height: 4),
                          Text('₹400', style: GoogleFonts.inter(fontSize: 26, fontWeight: FontWeight.bold, color: AppColors.secondaryGreen)),
                        ],
                      ),
                      Row(
                        children: [
                          Text('VIEW WALLET', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
                          const Icon(Icons.chevron_right_rounded, color: AppColors.primaryBlue),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 28),

              // Recent Referral Activity Section
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('REFERRAL ACTIVITY', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5)),
                  GestureDetector(
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => const ReferralHistoryScreen()),
                      );
                    },
                    child: Text('View All', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              _buildActivityItem('Rahul completed a booking', '₹50 earned', 'Today, 5:24 PM', isEarned: true),
              _buildActivityItem('Priya registered on SaveTogether', 'Booking pending', 'Yesterday, 7:10 PM', isEarned: false),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatBox(String count, String label, Color color) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.pureWhite,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.1)),
      ),
      child: Column(
        children: [
          Text(count, style: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.bold, color: color)),
          const SizedBox(height: 2),
          Text(label, style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
        ],
      ),
    );
  }

  Widget _buildActivityItem(String title, String statusText, String time, {required bool isEarned}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.pureWhite,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.1)),
      ),
      child: Row(
        children: [
          Icon(
            isEarned ? Icons.check_circle_rounded : Icons.hourglass_top_rounded,
            color: isEarned ? AppColors.secondaryGreen : AppColors.warningAmber,
            size: 20,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                Text(statusText, style: GoogleFonts.inter(fontSize: 12, color: isEarned ? AppColors.secondaryGreen : AppColors.warningAmber, fontWeight: FontWeight.w600)),
              ],
            ),
          ),
          Text(time, style: GoogleFonts.inter(fontSize: 11, color: AppColors.textSecondary)),
        ],
      ),
    );
  }
}
