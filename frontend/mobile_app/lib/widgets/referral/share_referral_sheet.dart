import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_colors.dart';

class ShareReferralSheet extends StatelessWidget {
  final String referralCode;

  const ShareReferralSheet({
    super.key,
    this.referralCode = 'ASHISH20',
  });

  static void show(BuildContext context, {String code = 'ASHISH20'}) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.pureWhite,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => ShareReferralSheet(referralCode: code),
    );
  }

  @override
  Widget build(BuildContext context) {
    final String shareMessage =
        'Hey! 👋 I’m using SaveTogether to get better prices on local services in our society. Join using my referral code $referralCode or link https://savetogether.in/ref/$referralCode and earn rewards when you complete your first booking!';

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Share & Earn', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                IconButton(
                  icon: const Icon(Icons.close_rounded, color: AppColors.textSecondary),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              'Invite your friends & neighbors to SaveTogether and earn ₹50 when they complete an eligible booking.',
              style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary, height: 1.4),
            ),
            const SizedBox(height: 16),

            // Referral Code Pill Box
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.softBlueWhite,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.15)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Your Referral Code: ', style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary)),
                  Text(
                    referralCode,
                    style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.primaryBlue),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            Text('OR SHARE VIA', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5)),
            const SizedBox(height: 12),

            // 43A WhatsApp Share
            _buildShareOption(
              context: context,
              icon: Icons.chat_rounded,
              color: const Color(0xFF25D366),
              title: 'WhatsApp',
              subtitle: 'Share directly to WhatsApp contacts or groups',
              onTap: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('📲 Opening WhatsApp with prefilled referral link...')),
                );
              },
            ),

            // 43B Copy Referral Link
            _buildShareOption(
              context: context,
              icon: Icons.link_rounded,
              color: AppColors.primaryBlue,
              title: 'Copy Referral Link',
              subtitle: 'https://savetogether.in/ref/$referralCode',
              onTap: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('✓ Referral link copied to clipboard!'),
                    backgroundColor: AppColors.secondaryGreen,
                  ),
                );
              },
            ),

            // 43C SMS Share
            _buildShareOption(
              context: context,
              icon: Icons.sms_rounded,
              color: Colors.orange,
              title: 'SMS',
              subtitle: 'Send SMS invite to contact numbers',
              onTap: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('💬 Opening Messages app with prefilled SMS...')),
                );
              },
            ),

            // 43D Native Share Sheet
            _buildShareOption(
              context: context,
              icon: Icons.share_rounded,
              color: AppColors.deepNavy,
              title: 'More Options',
              subtitle: 'Share via Telegram, Email, Instagram, etc.',
              onTap: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('📤 Opening native share sheet...')),
                );
              },
            ),
            const SizedBox(height: 12),

            Text(
              'Referral rewards are subject to SaveTogether referral Terms & Conditions.',
              style: GoogleFonts.inter(fontSize: 11, color: AppColors.textSecondary),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildShareOption({
    required BuildContext context,
    required IconData icon,
    required Color color,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppColors.pureWhite,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.12),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 20),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                  Text(subtitle, style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
                ],
              ),
            ),
            const Icon(Icons.chevron_right_rounded, color: AppColors.textSecondary, size: 20),
          ],
        ),
      ),
    );
  }
}
