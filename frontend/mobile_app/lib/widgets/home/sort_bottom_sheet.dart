import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_colors.dart';
import '../buttons/primary_button.dart';

class SortBottomSheet extends StatefulWidget {
  final String currentSort;
  final Function(String sortOption) onApply;

  const SortBottomSheet({
    super.key,
    required this.currentSort,
    required this.onApply,
  });

  static void show(BuildContext context, {required String currentSort, required Function(String) onApply}) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.pureWhite,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => SortBottomSheet(currentSort: currentSort, onApply: onApply),
    );
  }

  @override
  State<SortBottomSheet> createState() => _SortBottomSheetState();
}

class _SortBottomSheetState extends State<SortBottomSheet> {
  late String _selectedOption;

  final List<String> _sortOptions = [
    'Recommended',
    'Most Popular',
    'Highest Savings',
    'Lowest Price',
    'Nearest Service Date',
    'A - Z',
    'Z - A',
  ];

  @override
  void initState() {
    super.initState();
    _selectedOption = widget.currentSort;
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Sort By',
              style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
            ),
            const Divider(height: 20),

            ..._sortOptions.map((opt) {
              return RadioListTile<String>(
                title: Text(opt, style: GoogleFonts.inter(fontSize: 14, color: AppColors.deepNavy)),
                value: opt,
                groupValue: _selectedOption,
                activeColor: AppColors.primaryBlue,
                contentPadding: EdgeInsets.zero,
                onChanged: (val) {
                  if (val != null) setState(() => _selectedOption = val);
                },
              );
            }),
            const SizedBox(height: 16),

            PrimaryButton(
              text: 'APPLY SORT',
              onPressed: () {
                Navigator.pop(context);
                widget.onApply(_selectedOption);
              },
            ),
          ],
        ),
      ),
    );
  }
}
