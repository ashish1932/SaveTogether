import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../core/constants/app_colors.dart';
import '../models/service.dart';
import '../providers/auth_provider.dart';
import '../models/society.dart';
import '../models/address.dart';
import '../widgets/booking/step_progress_indicator.dart';
import '../widgets/buttons/primary_button.dart';
import '../widgets/buttons/secondary_button.dart';
import 'add_address_screen.dart';
import 'booking_summary_screen.dart';

class AddressSelectionBookingScreen extends StatefulWidget {
  final Service service;
  final int quantity;
  final DateTime selectedDate;
  final String selectedTimeSlot;

  const AddressSelectionBookingScreen({
    super.key,
    required this.service,
    required this.quantity,
    required this.selectedDate,
    required this.selectedTimeSlot,
  });

  @override
  State<AddressSelectionBookingScreen> createState() => _AddressSelectionBookingScreenState();
}

class _AddressSelectionBookingScreenState extends State<AddressSelectionBookingScreen> {
  String _selectedAddressId = 'addr_01';

  final List<Address> _addresses = [
    Address(
      id: 'addr_01',
      label: 'Home',
      flatNo: 'Flat 402',
      buildingBlock: 'Block A',
      streetArea: 'Main Road',
      city: 'Salem',
      postalCode: '636001',
      isDefault: true,
    ),
    Address(
      id: 'addr_02',
      label: 'Home 2',
      flatNo: 'Flat 102',
      buildingBlock: 'Block B',
      streetArea: 'Main Road',
      city: 'Salem',
      postalCode: '636001',
      isDefault: false,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final society = authProvider.userProfile?.selectedSociety ??
        Society(
          id: 'soc_01',
          name: 'ABC Residency',
          address: 'Main Road',
          city: 'Salem',
          postalCode: '636001',
          totalFlats: 400,
          activeUsersCount: 128,
        );

    final selectedAddrObj = _addresses.firstWhere((a) => a.id == _selectedAddressId);

    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Select Address', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Step 6 of 7
            const StepProgressIndicator(currentStep: 6),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Select Address',
                      style: GoogleFonts.inter(
                        fontSize: 26,
                        fontWeight: FontWeight.w700, // H1 Bold
                        color: AppColors.deepNavy,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Where should we provide the service?',
                      style: GoogleFonts.inter(fontSize: 14, color: AppColors.textSecondary),
                    ),
                    const SizedBox(height: 24),

                    Text(
                      'Saved Addresses',
                      style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.textSecondary),
                    ),
                    const SizedBox(height: 12),

                    // Saved Address Cards List
                    ..._addresses.map((addr) {
                      final isSelected = _selectedAddressId == addr.id;

                      return GestureDetector(
                        onTap: () => setState(() => _selectedAddressId = addr.id),
                        child: Container(
                          margin: const EdgeInsets.only(bottom: 14),
                          padding: const EdgeInsets.all(18),
                          decoration: BoxDecoration(
                            color: isSelected ? AppColors.primaryBlue.withValues(alpha: 0.08) : AppColors.pureWhite,
                            borderRadius: BorderRadius.circular(18),
                            border: Border.all(
                              color: isSelected ? AppColors.primaryBlue : AppColors.primaryBlue.withValues(alpha: 0.12),
                              width: isSelected ? 2 : 1,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.deepNavy.withValues(alpha: 0.04),
                                blurRadius: 8,
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Row(
                                    children: [
                                      Text(
                                        addr.label,
                                        style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
                                      ),
                                      if (addr.isDefault) ...[
                                        const SizedBox(width: 8),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                          decoration: BoxDecoration(
                                            color: AppColors.secondaryGreen.withValues(alpha: 0.12),
                                            borderRadius: BorderRadius.circular(6),
                                          ),
                                          child: Text(
                                            'Default',
                                            style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.secondaryGreen),
                                          ),
                                        ),
                                      ],
                                    ],
                                  ),
                                  Radio<String>(
                                    value: addr.id,
                                    groupValue: _selectedAddressId,
                                    activeColor: AppColors.primaryBlue,
                                    onChanged: (val) {
                                      if (val != null) setState(() => _selectedAddressId = val);
                                    },
                                  ),
                                ],
                              ),
                              const SizedBox(height: 6),
                              Text(
                                '${society.name}, ${addr.buildingBlock}, ${addr.flatNo}',
                                style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.deepNavy),
                              ),
                              Text(
                                '${addr.streetArea}, ${addr.city} – ${addr.postalCode}',
                                style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary),
                              ),
                            ],
                          ),
                        ),
                      );
                    }),
                    const SizedBox(height: 12),

                    // + Add New Address Button
                    SecondaryButton(
                      text: '+ Add New Address',
                      onPressed: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => AddAddressScreen(society: society),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),

            // Primary Button CTA: CONTINUE
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: PrimaryButton(
                text: 'CONTINUE',
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => BookingSummaryScreen(
                        service: widget.service,
                        quantity: widget.quantity,
                        selectedDate: widget.selectedDate,
                        selectedTimeSlot: widget.selectedTimeSlot,
                        selectedAddress: selectedAddrObj,
                        societyName: society.name,
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
