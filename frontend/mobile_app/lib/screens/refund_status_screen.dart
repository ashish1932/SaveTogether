import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../models/booking.dart';
import '../widgets/buttons/primary_button.dart';
import '../widgets/buttons/secondary_button.dart';
import 'main_navigation_screen.dart';

class RefundStatusScreen extends StatefulWidget {
  final Booking booking;

  const RefundStatusScreen({
    super.key,
    required this.booking,
  });

  @override
  State<RefundStatusScreen> createState() => _RefundStatusScreenState();
}

class _RefundStatusScreenState extends State<RefundStatusScreen> {
  bool _isCompleted = false;

  void _handleCheckStatus() async {
    await Future.delayed(const Duration(milliseconds: 600));
    setState(() => _isCompleted = true);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Refund Status', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 8),

              // Refund Icon Graphic
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.secondaryGreen.withValues(alpha: 0.12),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.currency_rupee_rounded, color: AppColors.secondaryGreen, size: 48),
              ),
              const SizedBox(height: 16),

              Text(
                '₹${widget.booking.totalAmount.toInt()}',
                style: GoogleFonts.inter(
                  fontSize: 32,
                  fontWeight: FontWeight.w700,
                  color: AppColors.secondaryGreen,
                ),
              ),
              Text('Refund Amount', style: GoogleFonts.inter(fontSize: 14, color: AppColors.textSecondary)),
              const SizedBox(height: 4),
              Text('Booking ID ${widget.booking.bookingId}', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
              const SizedBox(height: 32),

              // Timeline
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
                ),
                child: Column(
                  children: [
                    _buildTimelineStep(
                      title: 'Refund Requested',
                      subtitle: 'Your refund request has been received.',
                      isDone: true,
                      isLast: false,
                    ),
                    _buildTimelineStep(
                      title: 'Processing',
                      subtitle: 'Refund is being processed with payment gateway.',
                      isDone: true,
                      isLast: false,
                    ),
                    _buildTimelineStep(
                      title: 'Refund Completed',
                      subtitle: _isCompleted ? '₹${widget.booking.totalAmount.toInt()} has been credited to your UPI account.' : 'Will be credited within 2-3 business days.',
                      isDone: _isCompleted,
                      isLast: true,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Refund Details Box
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.1)),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Refund ID', style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary)),
                        Text('#RF982341', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Refund Method', style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary)),
                        Text('UPI (PhonePe)', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),

              // Actions: CHECK REFUND STATUS & GO TO MY BOOKINGS
              PrimaryButton(
                text: 'CHECK REFUND STATUS',
                onPressed: _handleCheckStatus,
              ),
              const SizedBox(height: 12),

              SecondaryButton(
                text: 'GO TO MY BOOKINGS',
                onPressed: () {
                  Navigator.of(context).pushReplacement(
                    MaterialPageRoute(builder: (_) => const MainNavigationScreen()),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTimelineStep({
    required String title,
    required String subtitle,
    required bool isDone,
    required bool isLast,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          children: [
            Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                color: isDone ? AppColors.secondaryGreen : Colors.grey.shade200,
                shape: BoxShape.circle,
              ),
              child: Icon(
                isDone ? Icons.check_rounded : Icons.radio_button_unchecked_rounded,
                color: isDone ? Colors.white : Colors.grey,
                size: 14,
              ),
            ),
            if (!isLast)
              Container(
                width: 2,
                height: 36,
                color: isDone ? AppColors.secondaryGreen : Colors.grey.shade300,
              ),
          ],
        ),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
              const SizedBox(height: 2),
              Text(subtitle, style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ],
    );
  }
}
