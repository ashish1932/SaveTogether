import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../core/constants/app_colors.dart';
import '../models/service.dart';
import '../providers/booking_provider.dart';
import '../widgets/buttons/primary_button.dart';
import 'payment_processing_screen.dart';
import 'booking_success_screen.dart';

class PaymentScreen extends StatefulWidget {
  final Service service;
  final int quantity;
  final double totalAmount;

  const PaymentScreen({
    super.key,
    required this.service,
    required this.quantity,
    required this.totalAmount,
  });

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  String _selectedMethod = 'UPI'; // 'UPI', 'CARD', 'NETBANKING', 'WALLET'
  double _walletBalance = 250.0;
  bool _useWalletCredits = false;

  void _handlePay() {
    final double finalPayableAmount = _useWalletCredits
        ? (widget.totalAmount - _walletBalance).clamp(0.0, 99999.0)
        : widget.totalAmount;

    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => PaymentProcessingScreen(
          bookingTitle: '${widget.service.name} (${widget.quantity} ACs)',
          amount: finalPayableAmount,
          onCompleteSuccess: () {
            final bookingProvider = Provider.of<BookingProvider>(context, listen: false);
            final newBooking = bookingProvider.createBooking();

            Navigator.of(context).pushReplacement(
              MaterialPageRoute(
                builder: (_) => BookingSuccessScreen(booking: newBooking),
              ),
            );
          },
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final double finalPayable = _useWalletCredits
        ? (widget.totalAmount - _walletBalance).clamp(0.0, 99999.0)
        : widget.totalAmount;

    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Payment', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Summary Box
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
                              Text(widget.service.name, style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                              Text('${widget.quantity} ACs', style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary)),
                            ],
                          ),
                          Text(
                            '₹${widget.totalAmount.toInt()}',
                            style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.primaryBlue),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),

                    Text(
                      'PAYMENT METHOD',
                      style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.textSecondary, letterSpacing: 0.5),
                    ),
                    const SizedBox(height: 12),

                    // 28A. UPI (Google Pay, PhonePe, Paytm, BHIM)
                    _buildMethodCard('UPI', 'UPI', 'Google Pay • PhonePe • Paytm • BHIM', Icons.account_balance_wallet_rounded),

                    // 28B. Card Payment (Visa, Mastercard, RuPay)
                    _buildMethodCard('CARD', 'Credit / Debit Card', 'Visa • Mastercard • RuPay', Icons.credit_card_rounded),

                    // 28C. Net Banking
                    _buildMethodCard('NETBANKING', 'Net Banking', 'SBI • HDFC • ICICI • Axis • All Indian Banks', Icons.account_balance_rounded),

                    // 28D. Wallet / Credits Option
                    _buildWalletOptionCard(),
                    const SizedBox(height: 20),

                    // 28.5 Payment Breakdown
                    Container(
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
                              Text('Service Amount', style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary)),
                              Text('₹${widget.totalAmount.toInt()}', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
                            ],
                          ),
                          if (_useWalletCredits) ...[
                            const SizedBox(height: 6),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text('Wallet Credits Used', style: GoogleFonts.inter(fontSize: 13, color: AppColors.secondaryGreen)),
                                Text('- ₹${_walletBalance.toInt()}', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.secondaryGreen)),
                              ],
                            ),
                          ],
                          const Divider(height: 20),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('TOTAL PAYABLE', style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                              Text('₹${finalPayable.toInt()}', style: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Security Indicator
                    Row(
                      children: [
                        const Icon(Icons.lock_rounded, color: AppColors.primaryBlue, size: 16),
                        const SizedBox(width: 6),
                        Text('100% Secure Payment Processed', style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            // PAY CTA Button
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: PrimaryButton(
                text: 'PAY ₹${finalPayable.toInt()}',
                onPressed: _handlePay,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMethodCard(String id, String title, String subtitle, IconData icon) {
    final isSelected = _selectedMethod == id;

    return GestureDetector(
      onTap: () => setState(() => _selectedMethod = id),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primaryBlue.withValues(alpha: 0.08) : AppColors.pureWhite,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? AppColors.primaryBlue : AppColors.primaryBlue.withValues(alpha: 0.12),
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Icon(icon, color: AppColors.primaryBlue, size: 22),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                  Text(subtitle, style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
                ],
              ),
            ),
            Radio<String>(
              value: id,
              groupValue: _selectedMethod,
              activeColor: AppColors.primaryBlue,
              onChanged: (val) {
                if (val != null) setState(() => _selectedMethod = val);
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildWalletOptionCard() {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.pureWhite,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.secondaryGreen.withValues(alpha: 0.3)),
      ),
      child: Row(
        children: [
          const Icon(Icons.account_balance_wallet_rounded, color: AppColors.secondaryGreen, size: 22),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Use Wallet / Credits', style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                Text('Available Balance: ₹${_walletBalance.toInt()}', style: GoogleFonts.inter(fontSize: 12, color: AppColors.secondaryGreen, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
          Switch(
            value: _useWalletCredits,
            activeColor: AppColors.secondaryGreen,
            onChanged: (val) => setState(() => _useWalletCredits = val),
          ),
        ],
      ),
    );
  }
}
