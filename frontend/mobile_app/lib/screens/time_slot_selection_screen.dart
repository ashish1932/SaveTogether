import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../models/service.dart';
import '../widgets/booking/step_progress_indicator.dart';
import '../widgets/buttons/primary_button.dart';
import 'address_selection_booking_screen.dart';

class TimeSlotSelectionScreen extends StatefulWidget {
  final Service service;
  final int quantity;
  final DateTime selectedDate;

  const TimeSlotSelectionScreen({
    super.key,
    required this.service,
    required this.quantity,
    required this.selectedDate,
  });

  @override
  State<TimeSlotSelectionScreen> createState() => _TimeSlotSelectionScreenState();
}

class _TimeSlotSelectionScreenState extends State<TimeSlotSelectionScreen> {
  String _selectedSlot = '9:00 AM – 12:00 PM';

  final List<Map<String, String>> _slots = const [
    {
      'title': 'Morning',
      'time': '9:00 AM – 12:00 PM',
      'icon': 'wb_sunny_rounded',
    },
    {
      'title': 'Afternoon',
      'time': '12:00 PM – 3:00 PM',
      'icon': 'wb_sunny_outlined',
    },
    {
      'title': 'Evening',
      'time': '3:00 PM – 6:00 PM',
      'icon': 'nights_stay_rounded',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Select Time Slot', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Step 5 of 7
            const StepProgressIndicator(currentStep: 5),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  children: [
                    Text(
                      'Select Time Slot',
                      style: GoogleFonts.inter(
                        fontSize: 26,
                        fontWeight: FontWeight.w700, // H1 Bold
                        color: AppColors.deepNavy,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Choose a time slot that works for you',
                      style: GoogleFonts.inter(fontSize: 14, color: AppColors.textSecondary),
                    ),
                    const SizedBox(height: 28),

                    // 3 Large Time Slot Selectable Cards
                    ..._slots.map((slot) {
                      final isSelected = _selectedSlot == slot['time'];

                      return GestureDetector(
                        onTap: () => setState(() => _selectedSlot = slot['time']!),
                        child: Container(
                          margin: const EdgeInsets.only(bottom: 16),
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            color: isSelected ? AppColors.primaryBlue.withValues(alpha: 0.08) : AppColors.pureWhite,
                            borderRadius: BorderRadius.circular(18),
                            border: Border.all(
                              color: isSelected ? AppColors.primaryBlue : AppColors.primaryBlue.withValues(alpha: 0.12),
                              width: isSelected ? 2 : 1,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.deepNavy.withValues(alpha: 0.04),
                                blurRadius: 10,
                              ),
                            ],
                          ),
                          child: Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: AppColors.primaryBlue.withValues(alpha: 0.1),
                                  shape: BoxShape.circle,
                                ),
                                child: Icon(
                                  slot['title'] == 'Morning'
                                      ? Icons.wb_sunny_rounded
                                      : slot['title'] == 'Afternoon'
                                          ? Icons.wb_sunny_outlined
                                          : Icons.nights_stay_rounded,
                                  color: AppColors.primaryBlue,
                                  size: 24,
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      slot['title']!,
                                      style: GoogleFonts.inter(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        color: AppColors.deepNavy,
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      slot['time']!,
                                      style: GoogleFonts.inter(fontSize: 14, color: AppColors.textSecondary),
                                    ),
                                  ],
                                ),
                              ),
                              Radio<String>(
                                value: slot['time']!,
                                groupValue: _selectedSlot,
                                activeColor: AppColors.primaryBlue,
                                onChanged: (val) {
                                  if (val != null) setState(() => _selectedSlot = val);
                                },
                              ),
                            ],
                          ),
                        ),
                      );
                    }),
                    const SizedBox(height: 16),

                    // Information Card
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: AppColors.primaryBlue.withValues(alpha: 0.08),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.info_outline_rounded, color: AppColors.primaryBlue, size: 20),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              'Timings are approximate and may vary slightly based on technician availability.',
                              style: GoogleFonts.inter(fontSize: 13, color: AppColors.primaryBlue, height: 1.3),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Primary Button CTA: CONTINUE
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: PrimaryButton(
                text: 'CONTINUE',
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => AddressSelectionBookingScreen(
                        service: widget.service,
                        quantity: widget.quantity,
                        selectedDate: widget.selectedDate,
                        selectedTimeSlot: _selectedSlot,
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
