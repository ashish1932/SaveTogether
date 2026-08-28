import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_colors.dart';

class CustomTextInput extends StatelessWidget {
  final String? label;
  final String placeholder;
  final TextEditingController? controller;
  final String? errorText;
  final bool isPrefixMobile;
  final ValueChanged<String>? onChanged;
  final TextInputType keyboardType;

  const CustomTextInput({
    super.key,
    this.label,
    required this.placeholder,
    this.controller,
    this.errorText,
    this.isPrefixMobile = false,
    this.onChanged,
    this.keyboardType = TextInputType.text,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (label != null) ...[
          Text(
            label!,
            style: GoogleFonts.inter(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: AppColors.deepNavy,
            ),
          ),
          const SizedBox(height: 6),
        ],
        Row(
          children: [
            if (isPrefixMobile) ...[
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.15)),
                ),
                child: Text(
                  '🇮🇳 +91',
                  style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.deepNavy),
                ),
              ),
              const SizedBox(width: 10),
            ],
            Expanded(
              child: TextField(
                controller: controller,
                onChanged: onChanged,
                keyboardType: keyboardType,
                style: GoogleFonts.inter(color: AppColors.deepNavy, fontSize: 15, fontWeight: FontWeight.w500),
                decoration: InputDecoration(
                  hintText: placeholder,
                  hintStyle: GoogleFonts.inter(color: AppColors.textSecondary, fontSize: 14),
                  errorText: errorText,
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
