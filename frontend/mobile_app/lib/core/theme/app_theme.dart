import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: AppColors.softBlueWhite,
      primaryColor: AppColors.primaryBlue,
      colorScheme: const ColorScheme.light(
        primary: AppColors.primaryBlue,
        secondary: AppColors.secondaryGreen,
        surface: AppColors.pureWhite,
        error: AppColors.errorRed,
      ),
      cardTheme: CardThemeData(
        color: AppColors.pureWhite,
        elevation: 1.5,
        shadowColor: AppColors.deepNavy.withValues(alpha: 0.05),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(color: AppColors.primaryBlue.withValues(alpha: 0.08)),
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.softBlueWhite,
        elevation: 0,
        centerTitle: false,
        iconTheme: const IconThemeData(color: AppColors.deepNavy),
        titleTextStyle: GoogleFonts.inter(
          color: AppColors.deepNavy,
          fontSize: 18,
          fontWeight: FontWeight.w600, // H3
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primaryBlue,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: GoogleFonts.inter(
            fontSize: 15,
            fontWeight: FontWeight.w600, // Button SemiBold
            height: 1.33,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.primaryBlue,
          side: const BorderSide(color: AppColors.primaryBlue, width: 1.5),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: GoogleFonts.inter(
            fontSize: 15,
            fontWeight: FontWeight.w600, // Button SemiBold
            height: 1.33,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.pureWhite,
        contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: AppColors.primaryBlue.withValues(alpha: 0.15)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: AppColors.primaryBlue.withValues(alpha: 0.15)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.primaryBlue, width: 2),
        ),
        hintStyle: GoogleFonts.inter(color: AppColors.textSecondary, fontSize: 14),
      ),
      textTheme: TextTheme(
        displayLarge: GoogleFonts.inter(fontSize: 32, fontWeight: FontWeight.w700, height: 1.25, color: AppColors.deepNavy),
        headlineLarge: GoogleFonts.inter(fontSize: 28, fontWeight: FontWeight.w700, height: 1.28, color: AppColors.deepNavy), // H1
        headlineMedium: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.w700, height: 1.36, color: AppColors.deepNavy), // H2
        titleLarge: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600, height: 1.44, color: AppColors.deepNavy), // H3
        bodyLarge: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w400, height: 1.5, color: AppColors.deepNavy),
        bodyMedium: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w400, height: 1.43, color: AppColors.deepNavy),
        bodySmall: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w400, height: 1.38, color: AppColors.textSecondary),
        labelLarge: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600, height: 1.33, color: Colors.white), // Button
        labelMedium: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, height: 1.5, color: AppColors.textSecondary),
        labelSmall: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w400, height: 1.5, color: AppColors.textSecondary), // Caption
      ),
    );
  }

  // Backward compatibility alias
  static ThemeData get darkTheme => lightTheme;
}
