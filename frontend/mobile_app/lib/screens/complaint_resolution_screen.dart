import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../models/complaint.dart';
import '../widgets/buttons/primary_button.dart';

class ComplaintResolutionScreen extends StatelessWidget {
  final ComplaintItem complaint;

  const ComplaintResolutionScreen({
    super.key,
    required this.complaint,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Complaint Resolution', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            children: [
              const SizedBox(height: 8),

              // Resolved Icon Graphic
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: AppColors.secondaryGreen.withValues(alpha: 0.12),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.check_circle_rounded, color: AppColors.secondaryGreen, size: 64),
              ),
              const SizedBox(height: 20),

              Text(
                'RESOLVED',
                style: GoogleFonts.inter(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: AppColors.secondaryGreen,
                  letterSpacing: 1,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'Your complaint ${complaint.complaintId} has been successfully resolved.',
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(fontSize: 14, color: AppColors.textSecondary),
              ),
              const SizedBox(height: 28),

              // Resolution Details Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.secondaryGreen.withValues(alpha: 0.3)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Resolution Summary', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5)),
                    const SizedBox(height: 8),
                    Text(
                      complaint.resolutionSummary ?? 'We verified the payment issue with our partner bank and processed a full refund of ₹1,398 to your original UPI account.',
                      style: GoogleFonts.inter(fontSize: 14, color: AppColors.deepNavy, height: 1.4),
                    ),
                    const Divider(height: 24),

                    Text('REFUND DETAILS', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5)),
                    const SizedBox(height: 10),
                    _buildRow('Refund Amount', '₹1,398', isHighlight: true),
                    const SizedBox(height: 6),
                    _buildRow('Refund ID', '#RF982341'),
                    const SizedBox(height: 6),
                    _buildRow('Payment Method', 'UPI (PhonePe)'),
                    const SizedBox(height: 6),
                    _buildRow('Status', 'Completed', isBadge: true),
                  ],
                ),
              ),
              const SizedBox(height: 32),

              PrimaryButton(
                text: '⭐ RATE YOUR EXPERIENCE',
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('⭐ Thank you for rating our support team!')),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRow(String label, String val, {bool isBadge = false, bool isHighlight = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary)),
        if (isBadge)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(
              color: AppColors.secondaryGreen.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(6),
            ),
            child: Text(val, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.secondaryGreen)),
          )
        else
          Text(
            val,
            style: GoogleFonts.inter(
              fontSize: isHighlight ? 16 : 13,
              fontWeight: FontWeight.bold,
              color: isHighlight ? AppColors.secondaryGreen : AppColors.deepNavy,
            ),
          ),
      ],
    );
  }
}
