import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_colors.dart';
import '../../models/address.dart';

class AddressCard extends StatelessWidget {
  final Address address;
  final String societyName;
  final VoidCallback onEdit;
  final VoidCallback onDelete;
  final VoidCallback? onSetDefault;

  const AddressCard({
    super.key,
    required this.address,
    required this.societyName,
    required this.onEdit,
    required this.onDelete,
    this.onSetDefault,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.pureWhite,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: address.isDefault ? AppColors.primaryBlue : AppColors.primaryBlue.withValues(alpha: 0.12),
          width: address.isDefault ? 1.5 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.deepNavy.withValues(alpha: 0.04),
            blurRadius: 10,
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
                    address.label.toUpperCase(),
                    style: GoogleFonts.inter(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: AppColors.deepNavy,
                      letterSpacing: 0.5,
                    ),
                  ),
                  if (address.isDefault) ...[
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: AppColors.primaryBlue.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        '✓ DEFAULT',
                        style: GoogleFonts.inter(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: AppColors.primaryBlue,
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ],
          ),
          const SizedBox(height: 10),

          Text(
            '${address.flatNo}, ${address.buildingBlock}',
            style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
          ),
          const SizedBox(height: 2),
          Text(
            societyName,
            style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.primaryBlue),
          ),
          const SizedBox(height: 2),
          Text(
            '${address.streetArea}, ${address.city} - ${address.postalCode}',
            style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary),
          ),
          if (address.landmark != null && address.landmark!.isNotEmpty) ...[
            const SizedBox(height: 4),
            Text(
              'Landmark: ${address.landmark}',
              style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary, fontStyle: FontStyle.italic),
            ),
          ],
          const Divider(height: 20),

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              if (!address.isDefault && onSetDefault != null)
                TextButton(
                  onPressed: onSetDefault,
                  child: Text('SET AS DEFAULT', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
                )
              else
                const SizedBox(),

              Row(
                children: [
                  TextButton.icon(
                    onPressed: onEdit,
                    icon: const Icon(Icons.edit_outlined, size: 16, color: AppColors.primaryBlue),
                    label: Text('EDIT', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
                  ),
                  const SizedBox(width: 8),
                  TextButton.icon(
                    onPressed: onDelete,
                    icon: const Icon(Icons.delete_outline_rounded, size: 16, color: AppColors.errorRed),
                    label: Text('DELETE', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.errorRed)),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}
