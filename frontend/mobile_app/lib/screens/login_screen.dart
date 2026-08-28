import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../core/constants/app_colors.dart';
import '../providers/auth_provider.dart';
import '../widgets/authentication/phone_input.dart';
import '../widgets/buttons/primary_button.dart';
import 'otp_verification_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _phoneController = TextEditingController(text: '9876543210');
  String? _validationError;

  @override
  void dispose() {
    _phoneController.dispose();
    super.dispose();
  }

  void _handleSendOtp() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final String rawPhone = _phoneController.text.trim();

    setState(() => _validationError = null);

    if (rawPhone.isEmpty) {
      setState(() => _validationError = 'Please enter your mobile number.');
      return;
    }

    if (rawPhone.length != 10 || !RegExp(r'^[0-9]+$').hasMatch(rawPhone)) {
      setState(() => _validationError = 'Please enter a valid 10-digit mobile number.');
      return;
    }

    final success = await authProvider.sendOtp(rawPhone);
    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('✓ OTP sent to +91 $rawPhone! Use Demo Code: 123456'),
          backgroundColor: AppColors.secondaryGreen,
          duration: const Duration(seconds: 4),
        ),
      );

      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (_) => OTPVerificationScreen(phoneNumber: '+91 $rawPhone'),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 32),

              // SaveTogether App Logo Header
              Center(
                child: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppColors.pureWhite,
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.deepNavy.withValues(alpha: 0.08),
                        blurRadius: 16,
                      ),
                    ],
                  ),
                  child: Image.asset(
                    'assets/images/app_logo.jpg',
                    width: 64,
                    height: 64,
                    fit: BoxFit.contain,
                  ),
                ),
              ),
              const SizedBox(height: 32),

              // Welcome Heading (H1 28px Bold Navy)
              Text(
                'Welcome to SaveTogether',
                style: GoogleFonts.inter(
                  fontSize: 28,
                  fontWeight: FontWeight.w700,
                  color: AppColors.deepNavy,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Enter your mobile number to continue',
                style: GoogleFonts.inter(
                  fontSize: 15,
                  fontWeight: FontWeight.w400,
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: 32),

              // Phone Number Input Component (+91 ▼ | Enter mobile number)
              PhoneInput(
                controller: _phoneController,
                errorText: _validationError ?? authProvider.authError,
                onChanged: (_) {
                  if (_validationError != null) setState(() => _validationError = null);
                },
              ),
              const SizedBox(height: 12),

              // Demo mode helper hint
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: AppColors.primaryBlue.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.info_outline_rounded, color: AppColors.primaryBlue, size: 16),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Demo Mode: Click SEND OTP and use code 123456',
                        style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.primaryBlue),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Primary CTA Button (SEND OTP / SENDING OTP...)
              PrimaryButton(
                text: authProvider.isLoading ? 'SENDING OTP...' : 'SEND OTP',
                state: authProvider.isLoading ? ButtonState.loading : ButtonState.defaultState,
                onPressed: _handleSendOtp,
              ),
              const SizedBox(height: 24),

              // Terms & Privacy Notice
              Center(
                child: RichText(
                  textAlign: TextAlign.center,
                  text: TextSpan(
                    style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary, height: 1.4),
                    children: const [
                      TextSpan(text: 'By continuing, you agree to '),
                      TextSpan(text: 'Terms of Service', style: TextStyle(color: AppColors.primaryBlue, fontWeight: FontWeight.w600)),
                      TextSpan(text: ' and '),
                      TextSpan(text: 'Privacy Policy', style: TextStyle(color: AppColors.primaryBlue, fontWeight: FontWeight.w600)),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
