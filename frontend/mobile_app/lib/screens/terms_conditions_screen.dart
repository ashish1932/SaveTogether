import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';

class TermsConditionsScreen extends StatelessWidget {
  const TermsConditionsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Terms & Conditions', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(20.0),
          children: [
            _buildSection('1. Introduction', 'These terms govern your use of the SaveTogether application and services. By accessing or using SaveTogether, you agree to these terms.'),
            _buildSection('2. Service Eligibility', 'You must be at least 18 years old and reside in a supported residential society or locality to use SaveTogether services.'),
            _buildSection('3. Pricing & Community Aggregation', 'Bulk pricing tiers depend on locality demand aggregation. Pricing tiers unlock dynamically as community demand thresholds are achieved.'),
            _buildSection('4. Payments & Refunds', 'All payments are processed through secure Indian payment gateways. Refunds for eligible cancellations follow our standard refund policy.'),
            _buildSection('5. User Conduct', 'Users agree to provide accurate service locations and cooperate with assigned service technicians during service fulfillment.'),
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
