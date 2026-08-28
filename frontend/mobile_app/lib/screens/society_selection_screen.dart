import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../core/constants/app_colors.dart';
import '../providers/auth_provider.dart';
import '../models/society.dart';
import '../widgets/buttons/primary_button.dart';
import '../widgets/input/custom_text_input.dart';
import 'main_navigation_screen.dart';

class SocietySelectionScreen extends StatefulWidget {
  const SocietySelectionScreen({super.key});

  @override
  State<SocietySelectionScreen> createState() => _SocietySelectionScreenState();
}

class _SocietySelectionScreenState extends State<SocietySelectionScreen> {
  Society? _selectedSociety;
  final TextEditingController _flatController = TextEditingController(text: 'Tower B - Flat 402');

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final societies = authProvider.mockSocieties;

    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text(
          'Select Your Society',
          style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600, color: AppColors.deepNavy),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Where should services be delivered?',
                style: GoogleFonts.inter(
                  fontSize: 22,
                  fontWeight: FontWeight.w700, // H2 Bold Navy
                  color: AppColors.deepNavy,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'Automatic bulk discounts apply across residents in your selected apartment society.',
                style: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: 24),
              Expanded(
                child: ListView.builder(
                  itemCount: societies.length,
                  itemBuilder: (context, index) {
                    final soc = societies[index];
                    final isSelected = _selectedSociety?.id == soc.id;

                    return GestureDetector(
                      onTap: () => setState(() => _selectedSociety = soc),
                      child: Container(
                        margin: const EdgeInsets.only(bottom: 12),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? AppColors.primaryBlue.withValues(alpha: 0.08)
                              : AppColors.pureWhite,
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.deepNavy.withValues(alpha: 0.04),
                              blurRadius: 8,
                            ),
                          ],
                          border: Border.all(
                            color: isSelected ? AppColors.primaryBlue : AppColors.primaryBlue.withValues(alpha: 0.1),
                            width: isSelected ? 2 : 1,
                          ),
                        ),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: AppColors.primaryBlue.withValues(alpha: 0.1),
                                shape: BoxShape.circle,
                              ),
                              child: Icon(
                                Icons.apartment_rounded,
                                color: isSelected ? AppColors.primaryBlue : AppColors.textSecondary,
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    soc.name,
                                    style: GoogleFonts.inter(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                      color: AppColors.deepNavy,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    '${soc.address}, ${soc.city}',
                                    style: GoogleFonts.inter(
                                      fontSize: 13,
                                      color: AppColors.textSecondary,
                                    ),
                                  ),
                                  const SizedBox(height: 6),
                                  Row(
                                    children: [
                                      const Icon(Icons.people_alt_outlined, size: 14, color: AppColors.secondaryGreen),
                                      const SizedBox(width: 4),
                                      Text(
                                        '${soc.activeUsersCount} active residents',
                                        style: GoogleFonts.inter(
                                          fontSize: 12,
                                          fontWeight: FontWeight.w600,
                                          color: AppColors.secondaryGreen,
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                            if (isSelected)
                              const Icon(Icons.check_circle_rounded, color: AppColors.primaryBlue),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
              if (_selectedSociety != null) ...[
                const SizedBox(height: 12),
                CustomTextInput(
                  label: 'Flat / Tower Number',
                  placeholder: 'e.g. Block A - Flat 102',
                  controller: _flatController,
                ),
                const SizedBox(height: 16),
              ],
              PrimaryButton(
                text: 'CONFIRM & CONTINUE',
                onPressed: _selectedSociety == null
                    ? null
                    : () {
                        authProvider.updateSociety(_selectedSociety!, _flatController.text);
                        Navigator.of(context).pushReplacement(
                          MaterialPageRoute(builder: (_) => const MainNavigationScreen()),
                        );
                      },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
