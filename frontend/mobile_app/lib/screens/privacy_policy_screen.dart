import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';

class PrivacyPolicyScreen extends StatelessWidget {
  const PrivacyPolicyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Privacy Policy', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(20.0),
          children: [
            _buildSection('1. Information Collection', 'We collect information you provide directly, such as your name, mobile number, address, and society location to deliver services.'),
            _buildSection('2. How We Use Information', 'Your information is used to process bookings, aggregate demand for community discounts, and communicate service updates.'),
            _buildSection('3. Data Sharing', 'We do not sell your personal data to third parties. Data is shared only with verified service providers assigned to fulfill your booking.'),
            _buildSection('4. Data Security', 'We use industry-standard encryption and security measures to protect your sensitive information and transactions.'),
            _buildSection('5. Your Rights', 'You have full control to view, update, or request deletion of your personal data stored with SaveTogether at any time.'),
          ],
        ),
      ),
    );
  }

  Widget _buildSection(String title, String content) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.pureWhite,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
          const SizedBox(height: 8),
          Text(content, style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary, height: 1.5)),
        ],
      ),
    );
  }
}
