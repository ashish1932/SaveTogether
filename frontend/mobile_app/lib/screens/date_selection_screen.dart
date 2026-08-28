import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../models/service.dart';
import '../widgets/booking/step_progress_indicator.dart';
import '../widgets/buttons/primary_button.dart';
import 'time_slot_selection_screen.dart';

class DateSelectionScreen extends StatefulWidget {
  final Service service;
  final int quantity;

  const DateSelectionScreen({
    super.key,
    required this.service,
    required this.quantity,
  });

  @override
  State<DateSelectionScreen> createState() => _DateSelectionScreenState();
}

class _DateSelectionScreenState extends State<DateSelectionScreen> {
  int _selectedDay = 25; // 25 May 2025

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Select Service Date', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Step 4 of 7
            const StepProgressIndicator(currentStep: 4),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  children: [
                    Text(
                      'Select Service Date',
                      style: GoogleFonts.inter(
                        fontSize: 26,
                        fontWeight: FontWeight.w700, // H1 Bold
                        color: AppColors.deepNavy,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Choose a convenient date',
                      style: GoogleFonts.inter(fontSize: 14, color: AppColors.textSecondary),
                    ),
                    const SizedBox(height: 24),

                    // Clean Monthly Calendar (May 2025)
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: AppColors.pureWhite,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.deepNavy.withValues(alpha: 0.04),
                            blurRadius: 10,
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Icon(Icons.chevron_left_rounded, color: AppColors.deepNavy),
                              Text(
                                'May 2025',
                                style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
                              ),
                              const Icon(Icons.chevron_right_rounded, color: AppColors.deepNavy),
                            ],
                          ),
                          const SizedBox(height: 20),

                          // Days of Week Header
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceAround,
                            children: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) {
                              return SizedBox(
                                width: 36,
                                child: Text(
                                  day,
                                  textAlign: TextAlign.center,
                                  style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary),
                                ),
                              );
                            }).toList(),
                          ),
                          const SizedBox(height: 16),

                          // Calendar Date Grid
                          GridView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 7,
                              mainAxisSpacing: 10,
                              crossAxisSpacing: 6,
                            ),
                            itemCount: 31,
                            itemBuilder: (context, index) {
                              final dayNum = index + 1;
                              final isSelected = dayNum == _selectedDay;
                              final isAvailable = dayNum >= 20 && dayNum <= 30;

                              return GestureDetector(
                                onTap: isAvailable ? () => setState(() => _selectedDay = dayNum) : null,
                                child: Container(
                                  decoration: BoxDecoration(
                                    color: isSelected
                                        ? AppColors.primaryBlue
                                        : isAvailable
                                            ? AppColors.softBlueWhite
                                            : Colors.grey.shade100,
                                    shape: BoxShape.circle,
                                  ),
                                  alignment: Alignment.center,
                                  child: Text(
                                    '$dayNum',
                                    style: GoogleFonts.inter(
                                      fontSize: 14,
                                      fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                                      color: isSelected
                                          ? Colors.white
                                          : isAvailable
                                              ? AppColors.deepNavy
                                              : Colors.grey.shade400,
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Legend: Available / Selected / Unavailable
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        _buildLegendItem('Available', AppColors.softBlueWhite, Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.3))),
                        const SizedBox(width: 16),
                        _buildLegendItem('Selected', AppColors.primaryBlue, null),
                        const SizedBox(width: 16),
                        _buildLegendItem('Unavailable', Colors.grey.shade200, null),
                      ],
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
                  final DateTime selectedDate = DateTime(2025, 5, _selectedDay);
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => TimeSlotSelectionScreen(
                        service: widget.service,
                        quantity: widget.quantity,
                        selectedDate: selectedDate,
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

  Widget _buildLegendItem(String label, Color color, Border? border) {
    return Row(
      children: [
        Container(
          width: 12,
          height: 12,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
            border: border,
          ),
        ),
        const SizedBox(width: 6),
        Text(label, style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
      ],
    );
  }
}
