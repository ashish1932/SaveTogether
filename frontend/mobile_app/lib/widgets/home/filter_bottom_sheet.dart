import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_colors.dart';
import '../buttons/primary_button.dart';
import '../buttons/secondary_button.dart';

class FilterBottomSheet extends StatefulWidget {
  final Function(String? category, String? priceRange, bool availableThisWeek) onApply;

  const FilterBottomSheet({
    super.key,
    required this.onApply,
  });

  static void show(BuildContext context, {required Function(String?, String?, bool) onApply}) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.pureWhite,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => FilterBottomSheet(onApply: onApply),
    );
  }

  @override
  State<FilterBottomSheet> createState() => _FilterBottomSheetState();
}

class _FilterBottomSheetState extends State<FilterBottomSheet> {
  String? _selectedCategory;
  String? _selectedPriceRange;
  bool _availableThisWeek = true;

  final List<String> _categories = ['All', 'AC', 'Cleaning', 'Pest Control', 'Car Wash', 'RO', 'Plumbing', 'Electrical'];
  final List<String> _priceRanges = ['Under ₹500', '₹500 – ₹1,000', '₹1,000 – ₹2,000', 'Above ₹2,000'];

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Filter Services',
                  style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
                ),
                IconButton(
                  icon: const Icon(Icons.close_rounded, color: AppColors.textSecondary),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const Divider(height: 20),

            // Category Filter
            Text('Category', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _categories.map((cat) {
                final isSelected = (_selectedCategory == cat) || (_selectedCategory == null && cat == 'All');
                return ChoiceChip(
                  label: Text(cat),
                  selected: isSelected,
                  selectedColor: AppColors.primaryBlue,
                  backgroundColor: AppColors.softBlueWhite,
                  labelStyle: GoogleFonts.inter(color: isSelected ? Colors.white : AppColors.deepNavy, fontSize: 12),
                  onSelected: (selected) {
                    setState(() => _selectedCategory = cat == 'All' ? null : cat);
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 20),

            // Price Range Filter
            Text('Price Range', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _priceRanges.map((range) {
                final isSelected = _selectedPriceRange == range;
                return ChoiceChip(
                  label: Text(range),
                  selected: isSelected,
                  selectedColor: AppColors.primaryBlue,
                  backgroundColor: AppColors.softBlueWhite,
                  labelStyle: GoogleFonts.inter(color: isSelected ? Colors.white : AppColors.deepNavy, fontSize: 12),
                  onSelected: (selected) {
                    setState(() => _selectedPriceRange = selected ? range : null);
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 20),

            // Availability Checkbox
            Row(
              children: [
                Checkbox(
                  value: _availableThisWeek,
                  activeColor: AppColors.primaryBlue,
                  onChanged: (val) => setState(() => _availableThisWeek = val ?? true),
                ),
                Text(
                  'Available this week',
                  style: GoogleFonts.inter(fontSize: 14, color: AppColors.deepNavy),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Action CTAs (RESET / APPLY)
            Row(
              children: [
                Expanded(
                  child: SecondaryButton(
                    text: 'RESET',
                    onPressed: () {
                      setState(() {
                        _selectedCategory = null;
                        _selectedPriceRange = null;
                        _availableThisWeek = true;
                      });
                    },
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: PrimaryButton(
                    text: 'APPLY FILTERS',
                    onPressed: () {
                      Navigator.pop(context);
                      widget.onApply(_selectedCategory, _selectedPriceRange, _availableThisWeek);
                    },
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
