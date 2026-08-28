import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../core/constants/app_colors.dart';
import '../providers/auth_provider.dart';
import '../models/society.dart';
import '../widgets/input/custom_search_bar.dart';
import '../widgets/location/society_card.dart';
import '../widgets/buttons/primary_button.dart';
import '../widgets/buttons/secondary_button.dart';
import 'society_details_screen.dart';

class SelectSocietyScreen extends StatefulWidget {
  const SelectSocietyScreen({super.key});

  @override
  State<SelectSocietyScreen> createState() => _SelectSocietyScreenState();
}

class _SelectSocietyScreenState extends State<SelectSocietyScreen> {
  String _searchQuery = '';
  Society? _selectedSociety;

  void _showRequestSocietyModal(BuildContext context) {
    final nameController = TextEditingController();
    final addressController = TextEditingController();
    final cityController = TextEditingController(text: 'Bengaluru');
    final pinController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.pureWhite,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(
            top: 24,
            left: 24,
            right: 24,
            bottom: MediaQuery.of(context).viewInsets.bottom + 24,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Request New Society',
                style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
              ),
              const SizedBox(height: 6),
              Text(
                'Can’t find your society? Submit details and we will review & notify you once onboarding is ready.',
                style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: nameController,
                style: const TextStyle(color: AppColors.deepNavy),
                decoration: const InputDecoration(labelText: 'Society Name *', hintText: 'e.g. Green Valley Residency'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: addressController,
                style: const TextStyle(color: AppColors.deepNavy),
                decoration: const InputDecoration(labelText: 'Address *', hintText: 'e.g. Main Road, HSR Layout'),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: cityController,
                      style: const TextStyle(color: AppColors.deepNavy),
                      decoration: const InputDecoration(labelText: 'City *'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: TextField(
                      controller: pinController,
                      style: const TextStyle(color: AppColors.deepNavy),
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(labelText: 'PIN Code *'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              PrimaryButton(
                text: 'SUBMIT REQUEST',
                onPressed: () {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('✓ Thanks! We’ll review your society and notify you when available.'),
                      backgroundColor: AppColors.secondaryGreen,
                    ),
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final societies = authProvider.mockSocieties.where((s) {
      return s.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          s.address.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          s.city.toLowerCase().contains(_searchQuery.toLowerCase());
    }).toList();

    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Select Your Society', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Search Input
              CustomSearchBar(
                placeholder: 'Search society by name, area, or PIN...',
                onChanged: (text) => setState(() => _searchQuery = text),
                onClear: () => setState(() => _searchQuery = ''),
              ),
              const SizedBox(height: 16),

              // Use Current Location CTA Button
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('📍 Detecting current location...')),
                    );
                  },
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.primaryBlue,
                    side: const BorderSide(color: AppColors.primaryBlue),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  icon: const Icon(Icons.my_location_rounded, size: 18),
                  label: const Text('USE CURRENT LOCATION'),
                ),
              ),
              const SizedBox(height: 20),

              Text(
                'NEARBY SOCIETIES',
                style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textSecondary,
                  letterSpacing: 0.5,
                ),
              ),
              const SizedBox(height: 12),

              // Society List
              Expanded(
                child: ListView.builder(
                  itemCount: societies.length,
                  itemBuilder: (context, index) {
                    final soc = societies[index];
                    final isSelected = _selectedSociety?.id == soc.id;

                    return SocietyCard(
                      society: soc,
                      distanceText: '${(1.2 + (index * 0.9)).toStringAsFixed(1)} km away',
                      isSelected: isSelected,
                      onSelect: () {
                        setState(() => _selectedSociety = soc);
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => SocietyDetailsScreen(society: soc),
                          ),
                        );
                      },
                    );
                  },
                ),
              ),

              // Request New Society Card Footer
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.1)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Can’t find your society?',
                      style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.deepNavy),
                    ),
                    TextButton(
                      onPressed: () => _showRequestSocietyModal(context),
                      child: Text(
                        'REQUEST SOCIETY',
                        style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.primaryBlue),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
