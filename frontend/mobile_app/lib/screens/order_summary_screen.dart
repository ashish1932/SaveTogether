import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../core/constants/app_colors.dart';
import '../providers/booking_provider.dart';
import '../providers/auth_provider.dart';
import 'booking_success_screen.dart';

class OrderSummaryScreen extends StatefulWidget {
  const OrderSummaryScreen({super.key});

  @override
  State<OrderSummaryScreen> createState() => _OrderSummaryScreenState();
}

class _OrderSummaryScreenState extends State<OrderSummaryScreen> {
  final DateTime _selectedDate = DateTime.now().add(const Duration(days: 2));
  String _selectedSlot = '10:00 AM - 01:00 PM';
  bool _isProcessing = false;

  final List<String> _timeSlots = [
    '09:00 AM - 12:00 PM',
    '10:00 AM - 01:00 PM',
    '02:00 PM - 05:00 PM',
    '04:00 PM - 07:00 PM',
  ];

  @override
  Widget build(BuildContext context) {
    final bookingProvider = Provider.of<BookingProvider>(context);
    final authProvider = Provider.of<AuthProvider>(context);
    final service = bookingProvider.selectedService;

    if (service == null) return const SizedBox();

    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Booking Review & Payment', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Order Summary Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.pureWhite,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.deepNavy.withValues(alpha: 0.05),
                    blurRadius: 10,
                  ),
                ],
                border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.1)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    service.name,
                    style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Quantity', style: GoogleFonts.inter(color: AppColors.textSecondary)),
                      Text('${bookingProvider.selectedQuantity} ${service.unitLabel}s', style: GoogleFonts.inter(fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Unit Price (Estimated)', style: GoogleFonts.inter(color: AppColors.textSecondary)),
                      Text('₹${bookingProvider.currentUnitPrice.toInt()} / unit', style: GoogleFonts.inter(fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
                    ],
                  ),
                  const Divider(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Subtotal', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                      Text('₹${bookingProvider.totalPrice.toInt()}', style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Select Schedule Date & Slot
            Text('Select Preferred Date & Slot', style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.pureWhite,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.deepNavy.withValues(alpha: 0.05),
                    blurRadius: 8,
                  ),
                ],
                border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.1)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.calendar_month_rounded, color: AppColors.primaryBlue),
                      const SizedBox(width: 10),
                      Text(
                        '${_selectedDate.day}/${_selectedDate.month}/${_selectedDate.year}',
                        style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: _timeSlots.map((slot) {
                      final isSelected = _selectedSlot == slot;
                      return ChoiceChip(
                        label: Text(slot),
                        selected: isSelected,
                        selectedColor: AppColors.primaryBlue,
                        backgroundColor: AppColors.softBlueWhite,
                        labelStyle: GoogleFonts.inter(
                          color: isSelected ? Colors.white : AppColors.textSecondary,
                          fontSize: 12,
                        ),
                        onSelected: (selected) {
                          if (selected) setState(() => _selectedSlot = slot);
                        },
                      );
                    }).toList(),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Service Location
            Text('Service Location', style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.pureWhite,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.deepNavy.withValues(alpha: 0.05),
                    blurRadius: 8,
                  ),
                ],
                border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.1)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.home_work_rounded, color: AppColors.primaryBlue),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(authProvider.userProfile?.selectedSociety?.name ?? 'ABC Residency', style: GoogleFonts.inter(fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                        Text(authProvider.userProfile?.flatNo ?? 'Tower B - Flat 402', style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Pay & Confirm CTA Button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isProcessing
                    ? null
                    : () async {
                        setState(() => _isProcessing = true);
                        await Future.delayed(const Duration(seconds: 1));
                        bookingProvider.setDateTime(_selectedDate, _selectedSlot);
                        final newBooking = bookingProvider.createBooking();
                        if (mounted) {
                          Navigator.of(context).pushReplacement(
                            MaterialPageRoute(
                              builder: (_) => BookingSuccessScreen(booking: newBooking),
                            ),
                          );
                        }
                      },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryBlue,
                  foregroundColor: Colors.white,
                ),
                child: _isProcessing
                    ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : Text('Pay ₹${bookingProvider.totalPrice.toInt()} & Confirm Booking'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
