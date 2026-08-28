import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../widgets/profile/logout_dialog.dart';
import 'notification_settings_screen.dart';
import 'language_selection_screen.dart';
import 'privacy_policy_screen.dart';
import 'terms_conditions_screen.dart';
import 'about_app_screen.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Settings', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(20.0),
          children: [
            Text('ACCOUNT & PREFERENCES', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5)),
            const SizedBox(height: 12),

            Container(
              decoration: BoxDecoration(
                color: AppColors.pureWhite,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
              ),
              child: Column(
                children: [
                  _buildSettingItem(context, 'Notifications', Icons.notifications_none_rounded, const NotificationSettingsScreen()),
                  const Divider(height: 1),
                  _buildSettingItem(context, 'Language', Icons.language_rounded, const LanguageSelectionScreen(), subtitle: 'English'),
                  const Divider(height: 1),
                  _buildSettingItem(context, 'Privacy Policy', Icons.lock_outline_rounded, const PrivacyPolicyScreen()),
                  const Divider(height: 1),
                  _buildSettingItem(context, 'Terms & Conditions', Icons.description_outlined, const TermsConditionsScreen()),
                  const Divider(height: 1),
                  _buildSettingItem(context, 'About SaveTogether', Icons.info_outline_rounded, const AboutAppScreen(), subtitle: 'v1.0.0'),
                ],
              ),
            ),
            const SizedBox(height: 28),

            // Logout Action Button
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () => LogoutDialog.show(context),
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppColors.errorRed,
                  side: const BorderSide(color: AppColors.errorRed),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                icon: const Icon(Icons.logout_rounded, size: 18),
                label: Text('LOGOUT', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSettingItem(BuildContext context, String title, IconData icon, Widget targetScreen, {String? subtitle}) {
    return ListTile(
      leading: Icon(icon, color: AppColors.primaryBlue),
      title: Text(title, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      trailing: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (subtitle != null) ...[
            Text(subtitle, style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
            const SizedBox(width: 6),
          ],
          const Icon(Icons.chevron_right_rounded, color: AppColors.textSecondary, size: 20),
        ],
      ),
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute(builder: (_) => targetScreen),
        );
      },
    );
  }
}
