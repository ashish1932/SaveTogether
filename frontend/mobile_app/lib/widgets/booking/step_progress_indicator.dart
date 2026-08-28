import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_colors.dart';

class StepProgressIndicator extends StatelessWidget {
  final int currentStep;
  final int totalSteps;

  const StepProgressIndicator({
    super.key,
    required this.currentStep,
    this.totalSteps = 7,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: List.generate(totalSteps, (index) {
          final stepNum = index + 1;
          final isCompleted = stepNum < currentStep;
          final isCurrent = stepNum == currentStep;

          return Expanded(
            child: Row(
              children: [
                Container(
                  width: 24,
                  height: 24,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: isCurrent
                        ? AppColors.primaryBlue
                        : isCompleted
                            ? AppColors.secondaryGreen
                            : AppColors.softBlueWhite,
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: isCurrent
                          ? AppColors.primaryBlue
                          : isCompleted
                              ? AppColors.secondaryGreen
                              : AppColors.primaryBlue.withValues(alpha: 0.2),
                      width: 1.5,
                    ),
                  ),
                  child: isCompleted
                      ? const Icon(Icons.check_rounded, color: Colors.white, size: 14)
                      : Text(
                          '$stepNum',
                          style: GoogleFonts.inter(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: isCurrent ? Colors.white : AppColors.textSecondary,
                          ),
                        ),
                ),
                if (index < totalSteps - 1)
                  Expanded(
                    child: Container(
                      height: 2,
                      color: isCompleted ? AppColors.secondaryGreen : AppColors.primaryBlue.withValues(alpha: 0.15),
                    ),
                  ),
              ],
            ),
          );
        }),
      ),
    );
  }
}
