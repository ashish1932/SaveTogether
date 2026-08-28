import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';

class AboutAppScreen extends StatelessWidget {
  const AboutAppScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('About SaveTogether', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            children: [
              const Spacer(),

              // Logo Graphic Banner
              Container(
                width: 90,
                height: 90,
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(22),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.deepNavy.withValues(alpha: 0.08),
                      blurRadius: 16,
                    ),
                  ],
                  border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(22),
                  child: Image.asset(
                    'assets/images/app_logo.jpg',
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => const Center(
                      child: Icon(Icons.handshake_rounded, color: AppColors.primaryBlue, size: 48),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20),

              Text(
                'SaveTogether',
                style: GoogleFonts.inter(fontSize: 24, fontWeight: FontWeight.w700, color: AppColors.deepNavy),
              ),
              const SizedBox(height: 4),
              Text(
                'More Bookings. Better Prices.',
                style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.secondaryGreen),
              ),
              const SizedBox(height: 6),
              Text(
                'Version 1.0.0 (Build 100)',
                style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary),
              ),
              const Spacer(),

              // Options Card List
              Container(
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
                ),
                child: Column(
                  children: [
                    ListTile(
                      leading: const Icon(Icons.info_outline_rounded, color: AppColors.primaryBlue),
                      title: Text('About Us', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
                      trailing: const Icon(Icons.chevron_right_rounded, color: AppColors.textSecondary),
                      onTap: () {},
                    ),
                    const Divider(height: 1),
                    ListTile(
                      leading: const Icon(Icons.headset_mic_outlined, color: AppColors.primaryBlue),
                      title: Text('Contact Customer Support', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
                      trailing: const Icon(Icons.chevron_right_rounded, color: AppColors.textSecondary),
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('📞 Support helpline: 1800-123-7283')));
                      },
                    ),
                    const Divider(height: 1),
                    ListTile(
                      leading: const Icon(Icons.star_outline_rounded, color: AppColors.warningAmber),
                      title: Text('Rate App on Play Store', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
                      trailing: const Icon(Icons.chevron_right_rounded, color: AppColors.textSecondary),
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('⭐ Thank you for rating SaveTogether!')));
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              Text(
                '© 2026 SaveTogether Technologies Pvt. Ltd. All rights reserved.',
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(fontSize: 11, color: AppColors.textSecondary),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
