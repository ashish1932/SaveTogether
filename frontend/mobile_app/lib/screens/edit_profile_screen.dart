import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../core/constants/app_colors.dart';
import '../providers/auth_provider.dart';
import '../widgets/input/custom_text_input.dart';
import '../widgets/buttons/primary_button.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  late TextEditingController _nameController;
  late TextEditingController _emailController;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    final user = Provider.of<AuthProvider>(context, listen: false).userProfile;
    _nameController = TextEditingController(text: user?.name ?? 'Ashish Kumar');
    _emailController = TextEditingController(text: user?.email ?? 'ashishkumar@gmail.com');
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  void _showPhotoPickerSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.pureWhite,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text('Change Profile Photo', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                const SizedBox(height: 16),
                ListTile(
                  leading: const Icon(Icons.camera_alt_rounded, color: AppColors.primaryBlue),
                  title: Text('Take Photo', style: GoogleFonts.inter(fontSize: 14, color: AppColors.deepNavy)),
                  onTap: () {
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('📷 Camera opened')));
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.photo_library_rounded, color: AppColors.primaryBlue),
                  title: Text('Choose from Gallery', style: GoogleFonts.inter(fontSize: 14, color: AppColors.deepNavy)),
                  onTap: () {
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('🖼️ Gallery opened')));
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.delete_outline_rounded, color: AppColors.errorRed),
                  title: Text('Remove Photo', style: GoogleFonts.inter(fontSize: 14, color: AppColors.errorRed)),
                  onTap: () {
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('✓ Profile photo removed')));
                  },
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _handleSave() {
    setState(() => _errorMessage = null);

    if (_nameController.text.trim().isEmpty) {
      setState(() => _errorMessage = 'Please enter your name.');
      return;
    }

    if (!_emailController.text.contains('@') || !_emailController.text.contains('.')) {
      setState(() => _errorMessage = 'Please enter a valid email address.');
      return;
    }

    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    authProvider.updateProfile(_nameController.text.trim(), _emailController.text.trim());

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('✓ Profile updated successfully.'),
        backgroundColor: AppColors.secondaryGreen,
      ),
    );

    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final user = Provider.of<AuthProvider>(context).userProfile;

    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Edit Profile', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            children: [
              // Photo Avatar with Edit Badge
              GestureDetector(
                onTap: () => _showPhotoPickerSheet(context),
                child: Stack(
                  children: [
                    CircleAvatar(
                      radius: 46,
                      backgroundColor: AppColors.primaryBlue.withValues(alpha: 0.12),
                      child: Text(
                        (user?.name.substring(0, 1) ?? 'A').toUpperCase(),
                        style: GoogleFonts.inter(fontSize: 36, fontWeight: FontWeight.bold, color: AppColors.primaryBlue),
                      ),
                    ),
                    Positioned(
                      bottom: 0,
                      right: 0,
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppColors.primaryBlue,
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white, width: 2),
                        ),
                        child: const Icon(Icons.camera_alt_rounded, color: Colors.white, size: 16),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 28),

              CustomTextInput(
                label: 'Full Name *',
                placeholder: 'Enter full name',
                controller: _nameController,
              ),
              const SizedBox(height: 16),

              // Read-only Mobile Field
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Mobile Number', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
                  const SizedBox(height: 6),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: AppColors.softBlueWhite,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.grey.shade300),
                    ),
                    child: Text(
                      user?.phone ?? '+91 98765 43210',
                      style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.grey.shade600),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'To change mobile number, please contact customer support.',
                    style: GoogleFonts.inter(fontSize: 11, color: AppColors.textSecondary),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              CustomTextInput(
                label: 'Email Address *',
                placeholder: 'ashishkumar@gmail.com',
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
              ),
              const SizedBox(height: 20),

              if (_errorMessage != null) ...[
                Text(
                  _errorMessage!,
                  style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.errorRed),
                ),
                const SizedBox(height: 16),
              ],

              PrimaryButton(
                text: 'SAVE CHANGES',
                onPressed: _handleSave,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
