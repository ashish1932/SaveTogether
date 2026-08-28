import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_colors.dart';

class TimelineStep {
  final String title;
  final bool isDone;
  final bool isCurrent;

  TimelineStep({
    required this.title,
    required this.isDone,
    this.isCurrent = false,
  });
}

class BookingTimeline extends StatelessWidget {
  final List<TimelineStep> steps;

  const BookingTimeline({
    super.key,
    required this.steps,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: List.generate(steps.length, (index) {
        final step = steps[index];
        final isLast = index == steps.length - 1;

        return Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Column(
              children: [
                Container(
                  width: 24,
                  height: 24,
                  decoration: BoxDecoration(
                    color: step.isDone
                        ? AppColors.secondaryGreen
                        : step.isCurrent
                            ? AppColors.primaryBlue
                            : Colors.grey.shade200,
                    shape: BoxShape.circle,
                  ),
                  child: Center(
                    child: step.isDone
                        ? const Icon(Icons.check_rounded, color: Colors.white, size: 14)
                        : step.isCurrent
                            ? Container(width: 8, height: 8, decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle))
                            : null,
                  ),
                ),
                if (!isLast)
                  Container(
                    width: 2,
                    height: 32,
                    color: step.isDone ? AppColors.secondaryGreen : Colors.grey.shade300,
                  ),
              ],
            ),
            const SizedBox(width: 12),
            Padding(
              padding: const EdgeInsets.only(top: 2),
              child: Text(
                step.title,
                style: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: step.isDone || step.isCurrent ? FontWeight.w600 : FontWeight.w400,
                  color: step.isDone || step.isCurrent ? AppColors.deepNavy : AppColors.textSecondary,
                ),
              ),
            ),
          ],
        );
      }),
    );
  }
}
