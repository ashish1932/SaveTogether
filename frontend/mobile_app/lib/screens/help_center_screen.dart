import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import 'faq_screen.dart';
import 'raise_complaint_screen.dart';
import 'my_complaints_screen.dart';

class HelpCenterScreen extends StatelessWidget {
  const HelpCenterScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Help Center', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
        actions: [
          IconButton(
            icon: const Icon(Icons.history_rounded, color: AppColors.primaryBlue),
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const MyComplaintsScreen()),
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
              Text(
                'How can we help you today?',
                style: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
              ),
              const SizedBox(height: 14),

              // Search Help Input
              GestureDetector(
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => const FaqScreen()),
                  );
                },
                child: Container(
                  height: 48,
                  decoration: BoxDecoration(
                    color: AppColors.pureWhite,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.15)),
                  ),
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Row(
                    children: [
                      const Icon(Icons.search_rounded, color: AppColors.textSecondary, size: 20),
                      const SizedBox(width: 10),
                      Text('Search help articles...', style: GoogleFonts.inter(fontSize: 14, color: AppColors.textSecondary)),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),

              Text('HELP CATEGORIES', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5)),
              const SizedBox(height: 12),

              Container(
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
                ),
                child: Column(
                  children: [
                    _buildCategoryItem(context, 'Booking', 'Booking, reschedule, cancel, status', Icons.calendar_month_rounded, AppColors.primaryBlue),
                    const Divider(height: 1),
                    _buildCategoryItem(context, 'Payment', 'Payments, failures, refunds', Icons.payment_rounded, AppColors.secondaryGreen),
                    const Divider(height: 1),
                    _buildCategoryItem(context, 'Services', 'Service process, vendor, timing', Icons.build_rounded, AppColors.warningAmber),
                    const Divider(height: 1),
                    _buildCategoryItem(context, 'Refunds', 'Refund status and issues', Icons.currency_rupee_rounded, AppColors.secondaryGreen),
                    const Divider(height: 1),
                    _buildCategoryItem(context, 'Referral & Rewards', 'Referral, rewards, wallet', Icons.card_giftcard_rounded, AppColors.primaryBlue),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Still Need Help Banner Card
              GestureDetector(
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => const RaiseComplaintScreen()),
                  );
                },
                child: Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: AppColors.primaryBlue.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.2)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AppColors.primaryBlue,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.headset_mic_rounded, color: Colors.white, size: 24),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Still need help?', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                            const SizedBox(height: 2),
                            Text('Raise a complaint and our support team will assist you.', style: GoogleFonts.inter(fontSize: 12, color: AppColors.deepNavy)),
                          ],
                        ),
                      ),
                      const Icon(Icons.chevron_right_rounded, color: AppColors.primaryBlue, size: 24),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCategoryItem(BuildContext context, String title, String subtitle, IconData icon, Color color) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(color: color.withValues(alpha: 0.12), shape: BoxShape.circle),
        child: Icon(icon, color: color, size: 20),
      ),
      title: Text(title, style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
      subtitle: Text(subtitle, style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
      trailing: const Icon(Icons.chevron_right_rounded, color: AppColors.textSecondary, size: 20),
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (_) => FaqScreen(initialCategory: title),
          ),
        );
      },
    );
  }
}
