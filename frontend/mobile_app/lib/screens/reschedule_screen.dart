import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../models/booking.dart';
import '../widgets/buttons/primary_button.dart';
import '../widgets/buttons/secondary_button.dart';

class RescheduleScreen extends StatefulWidget {
  final Booking booking;

  const RescheduleScreen({
    super.key,
    required this.booking,
  });

  @override
  State<RescheduleScreen> createState() => _RescheduleScreenState();
}

class _RescheduleScreenState extends State<RescheduleScreen> {
  int _selectedDay = 1; // 1 June 2025
  String _selectedSlot = '12:00 PM – 3:00 PM';

  void _showConfirmationModal(BuildContext context) {
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
                  color: AppColors.primaryBlue.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.calendar_month_rounded, color: AppColors.primaryBlue, size: 36),
              ),
              const SizedBox(height: 16),
              Text('Confirm Reschedule?', style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
              const SizedBox(height: 8),
              Text('Please confirm your new appointment.', style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary)),
              const SizedBox(height: 20),

              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.softBlueWhite,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('New Date', style: GoogleFonts.inter(fontSize: 11, color: AppColors.textSecondary)),
                    Text('Sunday, $_selectedDay June 2025', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                    const SizedBox(height: 8),
                    Text('New Time', style: GoogleFonts.inter(fontSize: 11, color: AppColors.textSecondary)),
                    Text(_selectedSlot, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              Row(
                children: [
                  Expanded(
                    child: SecondaryButton(
                      text: 'CANCEL',
                      onPressed: () => Navigator.pop(context),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: PrimaryButton(
                      text: 'CONFIRM',
                      onPressed: () {
                        Navigator.pop(context); // Close modal
                        Navigator.pop(context); // Back to details
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('✓ Booking rescheduled successfully.'),
                            backgroundColor: AppColors.secondaryGreen,
                          ),
                        );
                      },
                    ),
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
        title: Text('Reschedule Booking', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Current Appointment Info Box
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('CURRENT APPOINTMENT', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        const Icon(Icons.calendar_today_rounded, size: 16, color: AppColors.primaryBlue),
                        const SizedBox(width: 6),
                        Text('Sunday, 25 May 2025', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                        const SizedBox(width: 12),
                        const Icon(Icons.access_time_rounded, size: 16, color: AppColors.primaryBlue),
                        const SizedBox(width: 6),
                        Text('9 AM – 12 PM', style: GoogleFonts.inter(fontSize: 13, color: AppColors.deepNavy)),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              Text('SELECT NEW DATE', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
              const SizedBox(height: 12),

              // Calendar Grid (June 2025)
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.1)),
                ),
                child: Column(
                  children: [
                    Text('June 2025', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                    const SizedBox(height: 12),
                    GridView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 7, mainAxisSpacing: 8, crossAxisSpacing: 6),
                      itemCount: 14,
                      itemBuilder: (context, index) {
                        final day = index + 1;
                        final isSelected = _selectedDay == day;

                        return GestureDetector(
                          onTap: () => setState(() => _selectedDay = day),
                          child: Container(
                            decoration: BoxDecoration(
                              color: isSelected ? AppColors.primaryBlue : AppColors.softBlueWhite,
                              shape: BoxShape.circle,
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              '$day',
                              style: GoogleFonts.inter(fontSize: 13, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal, color: isSelected ? Colors.white : AppColors.deepNavy),
                            ),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              Text('SELECT NEW TIME', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
              const SizedBox(height: 12),

              ...['9:00 AM – 12:00 PM', '12:00 PM – 3:00 PM', '3:00 PM – 6:00 PM'].map((slot) {
                final isSelected = _selectedSlot == slot;
                return RadioListTile<String>(
                  title: Text(slot, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
                  value: slot,
                  groupValue: _selectedSlot,
                  activeColor: AppColors.primaryBlue,
                  tileColor: isSelected ? AppColors.primaryBlue.withValues(alpha: 0.08) : AppColors.pureWhite,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12), side: BorderSide(color: isSelected ? AppColors.primaryBlue : AppColors.primaryBlue.withValues(alpha: 0.1))),
                  onChanged: (val) {
                    if (val != null) setState(() => _selectedSlot = val);
                  },
                );
              }),
              const SizedBox(height: 28),

              PrimaryButton(
                text: 'CONFIRM RESCHEDULE',
                onPressed: () => _showConfirmationModal(context),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
