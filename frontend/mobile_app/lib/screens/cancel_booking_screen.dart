import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../models/booking.dart';
import '../widgets/buttons/primary_button.dart';
import '../widgets/buttons/secondary_button.dart';
import 'refund_status_screen.dart';

class CancelBookingScreen extends StatefulWidget {
  final Booking booking;

  const CancelBookingScreen({
    super.key,
    required this.booking,
  });

  @override
  State<CancelBookingScreen> createState() => _CancelBookingScreenState();
}

class _CancelBookingScreenState extends State<CancelBookingScreen> {
  String _selectedReason = 'Changed my plans';
  final TextEditingController _commentController = TextEditingController();

  final List<String> _reasons = [
    'Changed my plans',
    'Found another service',
    'Price is too high',
    'Timing doesn\'t work',
    'Booked by mistake',
    'Other (Please specify)',
  ];

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  void _showCancellationConfirmationModal(BuildContext context) {
    showDialog(
      context: context,
      builder: (_) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        backgroundColor: AppColors.pureWhite,
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.errorRed.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.warning_amber_rounded, color: AppColors.errorRed, size: 36),
              ),
              const SizedBox(height: 16),
              Text('Cancel this booking?', style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
              const SizedBox(height: 8),
              Text('Please review the refund details.', style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary)),
              const SizedBox(height: 20),

              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.softBlueWhite,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Booking ID', style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
                        Text(widget.booking.bookingId, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Service', style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
                        Text(widget.booking.serviceName, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                      ],
                    ),
                    const Divider(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Refund Amount', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                        Text('₹${widget.booking.totalAmount.toInt()}', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.secondaryGreen)),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              Column(
                children: [
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.pop(context); // Close modal
                        Navigator.of(context).pushReplacement(
                          MaterialPageRoute(
                            builder: (_) => RefundStatusScreen(booking: widget.booking),
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.errorRed,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: Text('CONFIRM CANCELLATION', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold)),
                    ),
                  ),
                  const SizedBox(height: 10),
                  SecondaryButton(
                    text: 'KEEP BOOKING',
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Cancel Booking', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Booking Summary Box
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: AppColors.primaryBlue.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.ac_unit_rounded, color: AppColors.primaryBlue, size: 24),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(widget.booking.serviceName, style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                          Text('Booking ID ${widget.booking.bookingId}', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              Text('Why are you cancelling?', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
              const SizedBox(height: 12),

              ..._reasons.map((reason) {
                final isSelected = _selectedReason == reason;
                return RadioListTile<String>(
                  title: Text(reason, style: GoogleFonts.inter(fontSize: 14, color: AppColors.deepNavy)),
                  value: reason,
                  groupValue: _selectedReason,
                  activeColor: AppColors.primaryBlue,
                  contentPadding: EdgeInsets.zero,
                  onChanged: (val) {
                    if (val != null) setState(() => _selectedReason = val);
                  },
                );
              }),
              const SizedBox(height: 16),

              Text('Additional comments (optional)', style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary)),
              const SizedBox(height: 6),
              TextField(
                controller: _commentController,
                maxLines: 3,
                style: const TextStyle(color: AppColors.deepNavy),
                decoration: const InputDecoration(
                  hintText: 'Type your comments here...',
                ),
              ),
              const SizedBox(height: 24),

              // Eligible Refund Summary Box
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.secondaryGreen.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.secondaryGreen, width: 1),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Eligible refund amount', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
                    Text('₹${widget.booking.totalAmount.toInt()}', style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.secondaryGreen)),
                  ],
                ),
              ),
              const SizedBox(height: 28),

              // CONTINUE TO CANCEL Button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => _showCancellationConfirmationModal(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.errorRed,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: Text('CONTINUE TO CANCEL', style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
