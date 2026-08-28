import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../core/constants/app_colors.dart';
import '../providers/auth_provider.dart';
import '../models/society.dart';
import '../models/address.dart';
import '../widgets/input/custom_text_input.dart';
import '../widgets/buttons/primary_button.dart';
import 'address_list_screen.dart';

class AddAddressScreen extends StatefulWidget {
  final Society society;
  final Address? existingAddress;

  const AddAddressScreen({
    super.key,
    required this.society,
    this.existingAddress,
  });

  @override
  State<AddAddressScreen> createState() => _AddAddressScreenState();
}

class _AddAddressScreenState extends State<AddAddressScreen> {
  late TextEditingController _flatController;
  late TextEditingController _buildingController;
  late TextEditingController _streetController;
  late TextEditingController _cityController;
  late TextEditingController _pinController;
  late TextEditingController _landmarkController;

  String _selectedLabel = 'Home';
  bool _isDefault = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    final addr = widget.existingAddress;

    _flatController = TextEditingController(text: addr?.flatNo ?? 'Flat 402');
    _buildingController = TextEditingController(text: addr?.buildingBlock ?? 'Block A');
    _streetController = TextEditingController(text: addr?.streetArea ?? 'Main Road');
    _cityController = TextEditingController(text: addr?.city ?? widget.society.city);
    _pinController = TextEditingController(text: addr?.postalCode ?? widget.society.postalCode);
    _landmarkController = TextEditingController(text: addr?.landmark ?? 'Near main gate');

    if (addr != null) {
      _selectedLabel = addr.label;
      _isDefault = addr.isDefault;
    }
  }

  @override
  void dispose() {
    _flatController.dispose();
    _buildingController.dispose();
    _streetController.dispose();
    _cityController.dispose();
    _pinController.dispose();
    _landmarkController.dispose();
    super.dispose();
  }

  void _handleSaveAddress() {
    setState(() => _errorMessage = null);

    if (_flatController.text.trim().isEmpty) {
      setState(() => _errorMessage = 'Please enter your flat/house number.');
      return;
    }

    if (_buildingController.text.trim().isEmpty) {
      setState(() => _errorMessage = 'Please enter your building or block.');
      return;
    }

    if (_cityController.text.trim().isEmpty) {
      setState(() => _errorMessage = 'Please enter your city.');
      return;
    }

    if (_pinController.text.trim().length != 6) {
      setState(() => _errorMessage = 'Please enter a valid PIN code.');
      return;
    }

    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final String fullFlatString = '${_flatController.text.trim()}, ${_buildingController.text.trim()}';

    authProvider.updateSociety(widget.society, fullFlatString);

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('✓ Address saved successfully'),
        backgroundColor: AppColors.secondaryGreen,
        duration: Duration(seconds: 3),
      ),
    );

    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (_) => AddressListScreen(society: widget.society),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isEditing = widget.existingAddress != null;

    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text(
          isEditing ? 'Edit Address' : 'Add Address',
          style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Address Label Radio Selection (Home / Other)
              Text(
                'Address Label',
                style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.deepNavy),
              ),
              const SizedBox(height: 8),
              Row(
                children: ['Home', 'Other'].map((label) {
                  final isSelected = _selectedLabel == label;
                  return Padding(
                    padding: const EdgeInsets.only(right: 12),
                    child: ChoiceChip(
                      label: Text(label),
                      selected: isSelected,
                      selectedColor: AppColors.primaryBlue,
                      backgroundColor: AppColors.pureWhite,
                      labelStyle: GoogleFonts.inter(
                        color: isSelected ? Colors.white : AppColors.deepNavy,
                        fontWeight: FontWeight.w600,
                      ),
                      onSelected: (selected) {
                        if (selected) setState(() => _selectedLabel = label);
                      },
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 16),

              // Form Fields
              CustomTextInput(
                label: 'Flat / House Number *',
                placeholder: 'Flat 402',
                controller: _flatController,
              ),
              const SizedBox(height: 14),

              CustomTextInput(
                label: 'Building / Block *',
                placeholder: 'Block A',
                controller: _buildingController,
              ),
              const SizedBox(height: 14),

              CustomTextInput(
                label: 'Street / Area *',
                placeholder: 'Main Road',
                controller: _streetController,
              ),
              const SizedBox(height: 14),

              Row(
                children: [
                  Expanded(
                    child: CustomTextInput(
                      label: 'City *',
                      placeholder: 'City name',
                      controller: _cityController,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: CustomTextInput(
                      label: 'PIN Code *',
                      placeholder: '6-digit PIN',
                      controller: _pinController,
                      keyboardType: TextInputType.number,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),

              CustomTextInput(
                label: 'Landmark (Optional)',
                placeholder: 'Near main gate (optional)',
                controller: _landmarkController,
              ),
              const SizedBox(height: 16),

              // Checkbox: SET AS DEFAULT ADDRESS
              Row(
                children: [
                  Checkbox(
                    value: _isDefault,
                    activeColor: AppColors.primaryBlue,
                    onChanged: (val) => setState(() => _isDefault = val ?? false),
                  ),
                  Text(
                    'Set as default address',
                    style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.deepNavy),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              if (_errorMessage != null) ...[
                Text(
                  _errorMessage!,
                  style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.errorRed),
                ),
                const SizedBox(height: 16),
              ],

              // Primary CTA: SAVE ADDRESS / SAVE CHANGES
              PrimaryButton(
                text: isEditing ? 'SAVE CHANGES' : 'SAVE ADDRESS',
                onPressed: _handleSaveAddress,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
