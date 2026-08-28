import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';

class PaymentProcessingScreen extends StatefulWidget {
  final String bookingTitle;
  final double amount;
  final VoidCallback onCompleteSuccess;

  const PaymentProcessingScreen({
    super.key,
    required this.bookingTitle,
    required this.amount,
    required this.onCompleteSuccess,
  });

  @override
  State<PaymentProcessingScreen> createState() => _PaymentProcessingScreenState();
}

class _PaymentProcessingScreenState extends State<PaymentProcessingScreen> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat();

    _simulateGateway();
  }

  Future<void> _simulateGateway() async {
    await Future.delayed(const Duration(milliseconds: 2200));
    if (mounted) {
      widget.onCompleteSuccess();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false, // Disable back button during payment processing (Duplicate payment protection)
      child: Scaffold(
        backgroundColor: AppColors.softBlueWhite,
        body: SafeArea(
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(32.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Spacer(),

                  // Animated Payment Processing Indicator
                  RotationTransition(
                    turns: _controller,
                    child: Container(
                      padding: const EdgeInsets.all(28),
                      decoration: BoxDecoration(
                        color: AppColors.primaryBlue.withValues(alpha: 0.1),
                        shape: BoxShape.circle,
                        border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.3), width: 2),
                      ),
                      child: const Icon(Icons.sync_rounded, color: AppColors.primaryBlue, size: 64),
                    ),
                  ),
                  const SizedBox(height: 36),

                  Text(
                    'Processing Payment...',
                    style: GoogleFonts.inter(
                      fontSize: 24,
                      fontWeight: FontWeight.w700,
                      color: AppColors.deepNavy,
                    ),
                  ),
                  const SizedBox(height: 12),

                  Text(
                    'Please do not close the app or press back while we confirm your payment.',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      color: AppColors.textSecondary,
                      height: 1.5,
                    ),
                  ),
                  const Spacer(),

                  // Booking Amount Summary Box
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.pureWhite,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(widget.bookingTitle, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                            Text('2 ACs', style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
                          ],
                        ),
                        Text(
                          '₹${widget.amount.toInt()}',
                          style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.primaryBlue),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
