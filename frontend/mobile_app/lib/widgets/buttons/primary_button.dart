import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_colors.dart';

enum ButtonState { defaultState, loading, disabled, success, error }

class PrimaryButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final ButtonState state;
  final double height;
  final double borderRadius;

  const PrimaryButton({
    super.key,
    required this.text,
    this.onPressed,
    this.state = ButtonState.defaultState,
    this.height = 48.0,
    this.borderRadius = 12.0,
  });

  @override
  Widget build(BuildContext context) {
    final isDisabled = state == ButtonState.disabled || onPressed == null;
    final isLoading = state == ButtonState.loading;
    final isSuccess = state == ButtonState.success;
    final isError = state == ButtonState.error;

    Color bgColor = AppColors.primaryBlue;
    if (isDisabled) bgColor = const Color(0xFFCBD5E1);
    if (isSuccess) bgColor = AppColors.secondaryGreen;
    if (isError) bgColor = AppColors.errorRed;

    Color textColor = isDisabled ? const Color(0xFF94A3B8) : Colors.white;

    return SizedBox(
      width: double.infinity,
      height: height,
      child: ElevatedButton(
        onPressed: (isDisabled || isLoading) ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: bgColor,
          disabledBackgroundColor: const Color(0xFFCBD5E1),
          foregroundColor: textColor,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(borderRadius),
          ),
        ),
        child: isLoading
            ? const SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2.5,
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                ),
              )
            : Text(
                text,
                style: GoogleFonts.inter(
                  fontSize: 15,
                  fontWeight: FontWeight.w600, // SemiBold
                  color: textColor,
                ),
              ),
      ),
    );
  }
}
