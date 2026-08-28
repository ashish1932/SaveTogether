import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../core/constants/app_colors.dart';
import '../providers/auth_provider.dart';
import '../widgets/input/custom_text_input.dart';
import '../widgets/buttons/primary_button.dart';
import '../widgets/authentication/auth_error.dart';
import 'society_selection_screen.dart';

class ProfileSetupScreen extends StatefulWidget {
  const ProfileSetupScreen({super.key});

  @override
  State<ProfileSetupScreen> createState() => _ProfileSetupScreenState();
}

class _ProfileSetupScreenState extends State<ProfileSetupScreen> {
  final TextEditingController _nameController = TextEditingController(text: 'Ashish Kumar');
  final TextEditingController _emailController = TextEditingController(text: 'ashish@example.com');
  String? _selectedPhotoPath;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  void _showPhotoBottomSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.pureWhite,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Add Profile Photo',
                  style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
                ),
                const Divider(height: 24),
                ListTile(
                  leading: const Icon(Icons.camera_alt_rounded, color: AppColors.primaryBlue),
                  title: Text('TAKE PHOTO', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
                  onTap: () {
                    Navigator.pop(context);
                    setState(() => _selectedPhotoPath = 'camera_photo');
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('✓ Photo captured successfully!')),
                    );
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.photo_library_rounded, color: AppColors.primaryBlue),
                  title: Text('CHOOSE FROM GALLERY', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
                  onTap: () {
                    Navigator.pop(context);
                    setState(() => _selectedPhotoPath = 'gallery_photo');
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('✓ Photo selected from gallery!')),
                    );
                  },
                ),
                if (_selectedPhotoPath != null)
                  ListTile(
                    leading: const Icon(Icons.delete_outline_rounded, color: AppColors.errorRed),
                    title: Text('REMOVE PHOTO', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.errorRed)),
                    onTap: () {
                      Navigator.pop(context);
                      setState(() => _selectedPhotoPath = null);
                    },
                  ),
                ListTile(
                  leading: const Icon(Icons.close_rounded, color: AppColors.textSecondary),
                  title: Text('CANCEL', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.textSecondary)),
                  onTap: () => Navigator.pop(context),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _handleSaveProfile() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final success = await authProvider.saveProfile(
      name: _nameController.text,
      email: _emailController.text,
    );

    if (success && mounted) {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const SocietySelectionScreen()),
      );
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
                'Create Your Profile',
                style: GoogleFonts.inter(
                  fontSize: 28,
                  fontWeight: FontWeight.w700, // H1 Bold Navy
                  color: AppColors.deepNavy,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Set up your SaveTogether customer profile to start saving with your community.',
                style: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: 32),

              // Profile Photo Component + ADD PHOTO Trigger
              Center(
                child: GestureDetector(
                  onTap: _showPhotoBottomSheet,
                  child: Column(
                    children: [
                      Stack(
                        children: [
                          CircleAvatar(
                            radius: 46,
                            backgroundColor: AppColors.primaryBlue.withValues(alpha: 0.12),
                            child: Icon(
                              _selectedPhotoPath != null ? Icons.face_rounded : Icons.person_rounded,
                              size: 52,
                              color: AppColors.primaryBlue,
                            ),
                          ),
                          Positioned(
                            bottom: 0,
                            right: 0,
                            child: Container(
                              padding: const EdgeInsets.all(6),
                              decoration: const BoxDecoration(
                                color: AppColors.primaryBlue,
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.camera_alt_rounded, color: Colors.white, size: 16),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'ADD PROFILE PHOTO',
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: AppColors.primaryBlue,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 32),

              // Full Name (Required)
              CustomTextInput(
                label: 'Full Name *',
                placeholder: 'Enter your full name',
                controller: _nameController,
              ),
              const SizedBox(height: 20),

              // Email Address (Optional)
              CustomTextInput(
                label: 'Email Address (Optional)',
                placeholder: 'Enter email (optional)',
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
              ),
              const SizedBox(height: 24),

              if (authProvider.authError != null) ...[
                AuthErrorBanner(message: authProvider.authError!),
                const SizedBox(height: 16),
              ],

              // CONTINUE Primary CTA Button
              PrimaryButton(
                text: authProvider.isLoading ? 'SAVING...' : 'CONTINUE',
                state: authProvider.isLoading ? ButtonState.loading : ButtonState.defaultState,
                onPressed: _handleSaveProfile,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
