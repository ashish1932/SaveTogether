import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../widgets/buttons/primary_button.dart';

class LanguageSelectionScreen extends StatefulWidget {
  const LanguageSelectionScreen({super.key});

  @override
  State<LanguageSelectionScreen> createState() => _LanguageSelectionScreenState();
}

class _LanguageSelectionScreenState extends State<LanguageSelectionScreen> {
  String _selectedLanguage = 'English';

  final List<Map<String, String>> _languages = const [
    {'name': 'English', 'native': 'English'},
    {'name': 'Hindi', 'native': 'हिन्दी'},
    {'name': 'Tamil', 'native': 'தமிழ்'},
    {'name': 'Telugu', 'native': 'తెలుగు'},
    {'name': 'Malayalam', 'native': 'മലയാളം'},
    {'name': 'Kannada', 'native': 'கன்னட'},
    {'name': 'Gujarati', 'native': 'ગુજરાતી'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Language', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(20.0),
                children: [
                  Text('Choose your language', style: GoogleFonts.inter(fontSize: 14, color: AppColors.textSecondary)),
                  const SizedBox(height: 16),

                  ..._languages.map((lang) {
                    final isSelected = _selectedLanguage == lang['name'];

                    return Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      decoration: BoxDecoration(
                        color: isSelected ? AppColors.primaryBlue.withValues(alpha: 0.08) : AppColors.pureWhite,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: isSelected ? AppColors.primaryBlue : AppColors.primaryBlue.withValues(alpha: 0.12),
                          width: isSelected ? 2 : 1,
                        ),
                      ),
                      child: RadioListTile<String>(
                        title: Text('${lang['name']} (${lang['native']})', style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
                        value: lang['name']!,
                        groupValue: _selectedLanguage,
                        activeColor: AppColors.primaryBlue,
                        onChanged: (val) {
                          if (val != null) setState(() => _selectedLanguage = val);
                        },
                      ),
                    );
                  }),
                ],
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(20.0),
              child: PrimaryButton(
                text: 'SAVE LANGUAGE',
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('✓ Language set to $_selectedLanguage')),
                  );
                  Navigator.pop(context);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
