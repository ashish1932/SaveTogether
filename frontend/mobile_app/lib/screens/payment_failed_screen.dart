import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../widgets/buttons/primary_button.dart';
import '../widgets/buttons/secondary_button.dart';
import 'payment_screen.dart';
import '../models/service.dart';

class PaymentFailedScreen extends StatelessWidget {
  final Service service;
  final double amount;
  final String failureReason;

  const PaymentFailedScreen({
    super.key,
    required this.service,
    required this.amount,
    this.failureReason = 'Payment was declined or interrupted.',
  });

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
                  color: AppColors.errorRed.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.close_rounded, color: AppColors.errorRed, size: 72),
              ),
              const SizedBox(height: 24),

              Text(
                'Payment Failed',
                style: GoogleFonts.inter(
                  fontSize: 26,
                  fontWeight: FontWeight.bold,
                  color: AppColors.deepNavy,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'We couldn’t complete your payment.',
                style: GoogleFonts.inter(fontSize: 14, color: AppColors.textSecondary),
              ),
              const SizedBox(height: 28),

              // Reason & Amount Box
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.errorRed.withValues(alpha: 0.2)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Amount', style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary)),
                        Text('₹${amount.toInt()}', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                      ],
                    ),
                    const Divider(height: 20),
                    Text('Reason', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.errorRed)),
                    const SizedBox(height: 4),
                    Text(failureReason, style: GoogleFonts.inter(fontSize: 13, color: AppColors.deepNavy)),
                  ],
                ),
              ),
              const Spacer(),

              // Actions: RETRY PAYMENT, CHANGE PAYMENT METHOD, BACK TO BOOKING
              PrimaryButton(
                text: 'RETRY PAYMENT',
                onPressed: () {
                  Navigator.of(context).pushReplacement(
                    MaterialPageRoute(
                      builder: (_) => PaymentScreen(service: service, quantity: 2, totalAmount: amount),
                    ),
                  );
                },
              ),
              const SizedBox(height: 12),

              SecondaryButton(
                text: 'CHANGE PAYMENT METHOD',
                onPressed: () {
                  Navigator.of(context).pushReplacement(
                    MaterialPageRoute(
                      builder: (_) => PaymentScreen(service: service, quantity: 2, totalAmount: amount),
                    ),
                  );
                },
              ),
              const SizedBox(height: 12),

              TextButton(
                onPressed: () => Navigator.of(context).pop(),
                child: Text('BACK TO BOOKING', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
