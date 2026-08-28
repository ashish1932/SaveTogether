import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../models/review.dart';
import '../widgets/buttons/primary_button.dart';

class EditReviewScreen extends StatefulWidget {
  final ServiceReview review;

  const EditReviewScreen({
    super.key,
    required this.review,
  });

  @override
  State<EditReviewScreen> createState() => _EditReviewScreenState();
}

class _EditReviewScreenState extends State<EditReviewScreen> {
  late double _overall;
  late double _quality;
  late double _professionalism;
  late double _value;
  late TextEditingController _commentController;

  @override
  void initState() {
    super.initState();
    _overall = widget.review.overallRating;
    _quality = widget.review.serviceQuality;
    _professionalism = widget.review.professionalism;
    _value = widget.review.valueForMoney;
    _commentController = TextEditingController(text: widget.review.comment);
  }

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Edit Your Review', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('OVERALL RATING', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5)),
              const SizedBox(height: 8),
              _buildStarRow(_overall, (val) => setState(() => _overall = val)),
              const SizedBox(height: 20),

              Text('SERVICE QUALITY', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5)),
              const SizedBox(height: 8),
              _buildStarRow(_quality, (val) => setState(() => _quality = val)),
              const SizedBox(height: 20),

              Text('PROFESSIONALISM', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5)),
              const SizedBox(height: 8),
              _buildStarRow(_professionalism, (val) => setState(() => _professionalism = val)),
              const SizedBox(height: 20),

              Text('VALUE FOR MONEY', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5)),
              const SizedBox(height: 8),
              _buildStarRow(_value, (val) => setState(() => _value = val)),
              const SizedBox(height: 24),

              Text('COMMENT', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5)),
              const SizedBox(height: 8),
              TextField(
                controller: _commentController,
                maxLines: 3,
                style: GoogleFonts.inter(fontSize: 14, color: AppColors.deepNavy),
                decoration: const InputDecoration(hintText: 'Edit your comment...'),
              ),
              const SizedBox(height: 28),

              PrimaryButton(
                text: 'SAVE CHANGES',
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('✓ Review updated successfully!'),
                      backgroundColor: AppColors.secondaryGreen,
                    ),
                  );
                  Navigator.pop(context);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStarRow(double currentVal, ValueChanged<double> onChanged) {
    return Row(
      children: List.generate(5, (index) {
        final starNum = index + 1.0;
        final isFilled = starNum <= currentVal;
        return IconButton(
          icon: Icon(
            isFilled ? Icons.star_rounded : Icons.star_outline_rounded,
            color: AppColors.warningAmber,
            size: 32,
          ),
          onPressed: () => onChanged(starNum),
        );
      }),
    );
  }
}
