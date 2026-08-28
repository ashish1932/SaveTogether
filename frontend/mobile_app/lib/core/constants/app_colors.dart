import 'package:flutter/material.dart';

class AppColors {
  // Brand Palette
  static const Color primaryBlue = Color(0xFF1769E0);    // SaveTogether Blue #1769E0
  static const Color secondaryGreen = Color(0xFF22B573);  // SaveTogether Green #22B573
  static const Color deepNavy = Color(0xFF102A56);        // Deep Navy #102A56

  // Background & Surfaces
  static const Color softBlueWhite = Color(0xFFF7FAFF);   // Soft Blue White #F7FAFF
  static const Color pureWhite = Color(0xFFFFFFFF);      // Pure White #FFFFFF

  // Functional Status Colors
  static const Color successGreen = Color(0xFF16A34A);    // Success Green #16A34A
  static const Color warningAmber = Color(0xFFF59E0B);    // Amber #F59E0B
  static const Color errorRed = Color(0xFFDC2626);        // Error Red #DC2626

  // Typography Tokens
  static const Color textPrimary = Color(0xFF102A56);     // Deep Navy #102A56
  static const Color textSecondary = Color(0xFF64748B);   // Slate Gray #64748B

  // Compatibility Aliases
  static const Color navyBlue = deepNavy;
  static const Color emeraldGreen = secondaryGreen;
  static const Color accentOrange = warningAmber;

  static const Color primary = primaryBlue;
  static const Color primaryLight = primaryBlue;
  static const Color primaryDark = deepNavy;

  static const Color accent = secondaryGreen;
  static const Color accentLight = secondaryGreen;

  static const Color bgDark = softBlueWhite;
  static const Color cardDark = pureWhite;

  static const Color textPrimaryDark = textPrimary;
  static const Color textSecondaryDark = textSecondary;

  static const Color success = successGreen;
  static const Color warning = warningAmber;
  static const Color error = errorRed;
  static const Color tierUnlocked = secondaryGreen;
}
