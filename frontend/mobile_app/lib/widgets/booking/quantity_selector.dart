import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_colors.dart';

class QuantitySelector extends StatelessWidget {
  final String label;
  final int quantity;
  final double unitPrice;
  final int minQty;
  final int maxQty;
  final ValueChanged<int> onChanged;

  const QuantitySelector({
    super.key,
    required this.label,
    required this.quantity,
    required this.unitPrice,
    this.minQty = 1,
    this.maxQty = 20,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final double totalPrice = quantity * unitPrice;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.pureWhite,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
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
          Text(
            label,
            style: GoogleFonts.inter(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: AppColors.deepNavy,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Total Calculation (e.g. 2 x ₹699 = ₹1,398)
              Text(
                '$quantity × ₹${unitPrice.toInt()} = ₹${totalPrice.toInt()}',
                style: GoogleFonts.inter(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: AppColors.primaryBlue,
                ),
              ),

              // [-] [Qty] [+] Controls
              Row(
                children: [
                  GestureDetector(
                    onTap: quantity > minQty ? () => onChanged(quantity - 1) : null,
                    child: Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: quantity > minQty ? AppColors.softBlueWhite : Colors.grey.shade100,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: quantity > minQty ? AppColors.primaryBlue.withValues(alpha: 0.3) : Colors.grey.shade300,
                        ),
                      ),
                      child: Center(
                        child: Text(
                          '−',
                          style: GoogleFonts.inter(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: quantity > minQty ? AppColors.primaryBlue : Colors.grey,
                          ),
                        ),
                      ),
                    ),
                  ),
                  Container(
                    width: 44,
                    height: 36,
                    alignment: Alignment.center,
                    child: Text(
                      '$quantity',
                      style: GoogleFonts.inter(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppColors.deepNavy,
                      ),
                    ),
                  ),
                  GestureDetector(
                    onTap: quantity < maxQty ? () => onChanged(quantity + 1) : null,
                    child: Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: quantity < maxQty ? AppColors.softBlueWhite : Colors.grey.shade100,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: quantity < maxQty ? AppColors.primaryBlue.withValues(alpha: 0.3) : Colors.grey.shade300,
                        ),
                      ),
                      child: Center(
                        child: Text(
                          '+',
                          style: GoogleFonts.inter(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: quantity < maxQty ? AppColors.primaryBlue : Colors.grey,
                          ),
                        ),
                      ),
                    ),
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
