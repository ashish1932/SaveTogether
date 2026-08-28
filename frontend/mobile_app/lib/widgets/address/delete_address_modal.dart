import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_colors.dart';
import '../buttons/primary_button.dart';
import '../buttons/secondary_button.dart';

class DeleteAddressModal extends StatelessWidget {
  final VoidCallback onConfirmDelete;

  const DeleteAddressModal({
    super.key,
    required this.onConfirmDelete,
  });

  static Future<void> show(BuildContext context, {required VoidCallback onConfirmDelete}) {
    return showDialog(
      context: context,
      builder: (_) => DeleteAddressModal(onConfirmDelete: onConfirmDelete),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      backgroundColor: AppColors.pureWhite,
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.errorRed.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.delete_forever_rounded, color: AppColors.errorRed, size: 36),
            ),
            const SizedBox(height: 16),
            Text(
              'Delete Address?',
              style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
            ),
            const SizedBox(height: 8),
            Text(
              'Are you sure you want to delete this service address?',
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(fontSize: 14, color: AppColors.textSecondary),
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(
                  child: SecondaryButton(
                    text: 'CANCEL',
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: PrimaryButton(
                    text: 'DELETE',
                    onPressed: () {
                      Navigator.of(context).pop();
                      onConfirmDelete();
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
