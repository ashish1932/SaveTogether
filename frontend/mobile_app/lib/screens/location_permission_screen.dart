import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../widgets/buttons/primary_button.dart';
import '../widgets/buttons/secondary_button.dart';
import 'select_society_screen.dart';

class LocationPermissionScreen extends StatefulWidget {
  const LocationPermissionScreen({super.key});

  @override
  State<LocationPermissionScreen> createState() => _LocationPermissionScreenState();
}

class _LocationPermissionScreenState extends State<LocationPermissionScreen> {
  bool _isDetecting = false;
  String? _statusMessage;

  void _handleAllowLocation() async {
    setState(() {
      _isDetecting = true;
      _statusMessage = null;
    });

    await Future.delayed(const Duration(milliseconds: 1000));

    if (mounted) {
      setState(() {
        _isDetecting = false;
        _statusMessage = '✓ Location detected successfully.';
      });

      await Future.delayed(const Duration(milliseconds: 600));

      if (mounted) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const SelectSocietyScreen()),
        );
      }
    }
  }

  void _handleEnterManually() {
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (_) => const SelectSocietyScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(28.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Spacer(),

              // Location Icon graphic
              Container(
                padding: const EdgeInsets.all(32),
                decoration: BoxDecoration(
                  color: AppColors.primaryBlue.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                  border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.2)),
                ),
                child: const Icon(Icons.location_on_rounded, size: 84, color: AppColors.primaryBlue),
              ),
              const SizedBox(height: 36),

              // Title (H1 28px Bold Navy)
              Text(
                'Find Services Near You',
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(
                  fontSize: 28,
                  fontWeight: FontWeight.w700,
                  color: AppColors.deepNavy,
                ),
              ),
              const SizedBox(height: 12),

              Text(
                'Allow SaveTogether to use your location to find your society and available services nearby.',
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(
                  fontSize: 15,
                  fontWeight: FontWeight.w400,
                  color: AppColors.textSecondary,
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 20),

              if (_statusMessage != null) ...[
                Text(
                  _statusMessage!,
                  style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.secondaryGreen),
                ),
                const SizedBox(height: 12),
              ],

              const Spacer(),

              // Primary CTA: ALLOW LOCATION
              PrimaryButton(
                text: _isDetecting ? 'DETECTING LOCATION...' : 'ALLOW LOCATION',
                state: _isDetecting ? ButtonState.loading : ButtonState.defaultState,
                onPressed: _handleAllowLocation,
              ),
              const SizedBox(height: 14),

              // Secondary CTA: ENTER MANUALLY
              SecondaryButton(
                text: 'ENTER MANUALLY',
                onPressed: _handleEnterManually,
              ),
              const SizedBox(height: 24),

              Text(
                'We use your location only to improve service availability.',
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(
                  fontSize: 12,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
