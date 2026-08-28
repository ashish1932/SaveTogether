import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../core/constants/app_colors.dart';
import '../providers/auth_provider.dart';
import '../widgets/authentication/otp_input.dart';
import '../widgets/authentication/otp_countdown.dart';
import '../widgets/authentication/auth_error.dart';
import '../widgets/buttons/primary_button.dart';
import 'profile_setup_screen.dart';
import 'society_selection_screen.dart';
import 'main_navigation_screen.dart';

class OTPVerificationScreen extends StatefulWidget {
  final String phoneNumber;

  const OTPVerificationScreen({
    super.key,
    required this.phoneNumber,
  });

  @override
  State<OTPVerificationScreen> createState() => _OTPVerificationScreenState();
}

class _OTPVerificationScreenState extends State<OTPVerificationScreen> {
  String _enteredOtp = '';
  bool _isSuccessMessage = false;

  void _handleVerify() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final success = await authProvider.verifyOtp(_enteredOtp);

    if (success) {
      setState(() => _isSuccessMessage = true);
      await Future.delayed(const Duration(milliseconds: 600));

      if (!mounted) return;
      if (authProvider.currentStep == AuthStep.profileSetup) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const ProfileSetupScreen()),
        );
      } else if (authProvider.currentStep == AuthStep.societySelection) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const SocietySelectionScreen()),
        );
      } else {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const MainNavigationScreen()),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: AppColors.deepNavy),
          onPressed: () => Navigator.of(context).pop(),
        ),
        elevation: 0,
        backgroundColor: Colors.transparent,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Verify Your Number',
                style: GoogleFonts.inter(
                  fontSize: 28,
                  fontWeight: FontWeight.w700, // H1 Bold Navy
                  color: AppColors.deepNavy,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'We sent a 6-digit OTP to ${widget.phoneNumber}',
                style: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: 16),

              // Demo Mode Code Banner
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.secondaryGreen.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppColors.secondaryGreen, width: 1),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.mark_email_read_rounded, color: AppColors.secondaryGreen, size: 20),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'Demo OTP Code: 123456',
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: AppColors.secondaryGreen,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // 6-Digit OTP Input Boxes [1][2][3][4][5][6]
              OTPInput(
                onChanged: (val) => setState(() => _enteredOtp = val),
                onCompleted: (val) {
                  setState(() => _enteredOtp = val);
                  _handleVerify();
                },
              ),
              const SizedBox(height: 24),

              // Verification Feedback Banner (✓ Phone number verified)
              if (_isSuccessMessage) ...[
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.secondaryGreen.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.check_circle_rounded, color: AppColors.secondaryGreen, size: 20),
                      const SizedBox(width: 8),
                      Text(
                        '✓ Phone number verified',
                        style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.secondaryGreen),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
              ],

              if (authProvider.authError != null) ...[
                AuthErrorBanner(message: authProvider.authError!),
                const SizedBox(height: 16),
              ],

              // Resend Timer (Resend OTP in 00:24 -> [RESEND OTP])
              Center(
                child: OTPCountdown(
                  initialSeconds: 24,
                  onResend: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('✓ New OTP sent: 123456')),
                    );
                  },
                ),
              ),
              const SizedBox(height: 40),

              // VERIFY Primary CTA Button
              PrimaryButton(
                text: authProvider.isLoading ? 'VERIFYING...' : 'VERIFY',
                state: authProvider.isLoading ? ButtonState.loading : ButtonState.defaultState,
                onPressed: _enteredOtp.length == 6 ? _handleVerify : null,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
