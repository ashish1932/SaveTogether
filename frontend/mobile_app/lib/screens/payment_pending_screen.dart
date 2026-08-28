import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../widgets/buttons/primary_button.dart';
import '../widgets/buttons/secondary_button.dart';
import 'main_navigation_screen.dart';

class PaymentPendingScreen extends StatefulWidget {
  final double amount;
  final String transactionId;

  const PaymentPendingScreen({
    super.key,
    required this.amount,
    this.transactionId = '#TX982341',
  });

  @override
  State<PaymentPendingScreen> createState() => _PaymentPendingScreenState();
}

class _PaymentPendingScreenState extends State<PaymentPendingScreen> {
  bool _isCheckingStatus = false;
  String _statusMessage = 'We\'re waiting for confirmation from your payment provider.';

  void _handleCheckStatus() async {
    setState(() => _isCheckingStatus = true);
    await Future.delayed(const Duration(milliseconds: 1000));

    if (mounted) {
      setState(() {
        _isCheckingStatus = false;
        _statusMessage = '✓ Payment verified! Redirecting to confirmed booking...';
      });

      await Future.delayed(const Duration(milliseconds: 800));

      if (mounted) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const MainNavigationScreen()),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            children: [
              const Spacer(),

              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: AppColors.warningAmber.withValues(alpha: 0.12),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.access_time_filled_rounded, color: AppColors.warningAmber, size: 72),
              ),
              const SizedBox(height: 24),

              Text(
                'Payment Processing...',
                style: GoogleFonts.inter(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: AppColors.deepNavy,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                _statusMessage,
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(fontSize: 14, color: AppColors.textSecondary, height: 1.4),
              ),
              const SizedBox(height: 28),

              // Transaction Info Box
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Transaction ID', style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary)),
                        Text(widget.transactionId, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Amount', style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary)),
                        Text('₹${widget.amount.toInt()}', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                      ],
                    ),
                  ],
                ),
              ),
              const Spacer(),

              // Actions: CHECK STATUS & GO TO HOME
              PrimaryButton(
                text: _isCheckingStatus ? 'CHECKING STATUS...' : 'CHECK STATUS',
                state: _isCheckingStatus ? ButtonState.loading : ButtonState.defaultState,
                onPressed: _handleCheckStatus,
              ),
              const SizedBox(height: 12),

              SecondaryButton(
                text: 'GO TO HOME',
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
}
