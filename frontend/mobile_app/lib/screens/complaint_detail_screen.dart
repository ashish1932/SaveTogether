import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../models/complaint.dart';
import '../widgets/buttons/primary_button.dart';
import '../widgets/buttons/secondary_button.dart';
import 'complaint_conversation_screen.dart';
import 'complaint_resolution_screen.dart';

class ComplaintDetailScreen extends StatelessWidget {
  final ComplaintItem complaint;

  const ComplaintDetailScreen({
    super.key,
    required this.complaint,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Complaint Details', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header Card
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Complaint ID', style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
                        Text(complaint.complaintId, style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
                        Text('Raised on ${complaint.raisedDate}', style: GoogleFonts.inter(fontSize: 11, color: AppColors.textSecondary)),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: complaint.status == 'RESOLVED'
                            ? AppColors.secondaryGreen.withValues(alpha: 0.12)
                            : AppColors.warningAmber.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        complaint.status,
                        style: GoogleFonts.inter(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: complaint.status == 'RESOLVED' ? AppColors.secondaryGreen : AppColors.warningAmber,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Category & Description Card
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.1)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('CATEGORY', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5)),
                    const SizedBox(height: 4),
                    Text(complaint.category, style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                    const Divider(height: 20),
                    Text('DESCRIPTION', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5)),
                    const SizedBox(height: 4),
                    Text(complaint.description, style: GoogleFonts.inter(fontSize: 13, color: AppColors.deepNavy, height: 1.4)),
                    const Divider(height: 20),
                    Text('LINKED BOOKING', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5)),
                    const SizedBox(height: 4),
                    Text('Booking ID ${complaint.bookingId}', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Attachments
              if (complaint.attachments.isNotEmpty) ...[
                Text('ATTACHMENTS', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5)),
                const SizedBox(height: 8),
                Row(
                  children: complaint.attachments.map((img) {
                    return Container(
                      margin: const EdgeInsets.only(right: 8),
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        color: AppColors.pureWhite,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.2)),
                      ),
                      child: const Icon(Icons.image_rounded, color: AppColors.primaryBlue, size: 28),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 20),
              ],

              // Actions: VIEW CONVERSATION & RESOLUTION
              PrimaryButton(
                text: 'VIEW CONVERSATION',
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => ComplaintConversationScreen(complaint: complaint),
                    ),
                  );
                },
              ),
              if (complaint.status == 'RESOLVED') ...[
                const SizedBox(height: 12),
                SecondaryButton(
                  text: 'VIEW RESOLUTION & REFUND',
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => ComplaintResolutionScreen(complaint: complaint),
                      ),
                    );
                  },
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
