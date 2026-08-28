import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../models/society.dart';
import '../widgets/location/society_details_card.dart';
import '../widgets/buttons/primary_button.dart';
import '../widgets/buttons/secondary_button.dart';
import 'add_address_screen.dart';

class SocietyDetailsScreen extends StatefulWidget {
  final Society society;

  const SocietyDetailsScreen({
    super.key,
    required this.society,
  });

  @override
  State<SocietyDetailsScreen> createState() => _SocietyDetailsScreenState();
}

class _SocietyDetailsScreenState extends State<SocietyDetailsScreen> {
  bool _isConfirmed = false;

  void _handleConfirmSociety() async {
    setState(() => _isConfirmed = true);
    await Future.delayed(const Duration(milliseconds: 600));

    if (mounted) {
      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (_) => AddAddressScreen(society: widget.society),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Society Details', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Society Details Graphic Card
              SocietyDetailsCard(society: widget.society),
              const SizedBox(height: 24),

              if (_isConfirmed) ...[
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.secondaryGreen.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.secondaryGreen, width: 1),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.check_circle_rounded, color: AppColors.secondaryGreen, size: 20),
                          const SizedBox(width: 8),
                          Text(
                            '✓ Society selected',
                            style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.secondaryGreen),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text(
                        '${widget.society.name}\nYour bookings can now benefit from local demand aggregation.',
                        style: GoogleFonts.inter(fontSize: 13, color: AppColors.deepNavy, height: 1.4),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
              ],

              // Primary CTA: CONFIRM SOCIETY
              PrimaryButton(
                text: 'CONFIRM SOCIETY',
                onPressed: _handleConfirmSociety,
              ),
              const SizedBox(height: 12),

              // Secondary CTA: CHANGE SOCIETY
              SecondaryButton(
                text: 'CHANGE SOCIETY',
                onPressed: () => Navigator.of(context).pop(),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
