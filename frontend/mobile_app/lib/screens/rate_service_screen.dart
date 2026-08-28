import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../models/review.dart';
import '../widgets/buttons/primary_button.dart';
import 'review_submitted_screen.dart';
import 'raise_complaint_screen.dart';

class RateServiceScreen extends StatefulWidget {
  final String bookingId;

  const RateServiceScreen({
    super.key,
    this.bookingId = '#BK10245',
  });

  @override
  State<RateServiceScreen> createState() => _RateServiceScreenState();
}

class _RateServiceScreenState extends State<RateServiceScreen> {
  double _overallRating = 4.0;
  double _serviceQuality = 5.0;
  double _professionalism = 4.0;
  double _valueForMoney = 4.0;

  final TextEditingController _commentController = TextEditingController();
  final List<String> _selectedTags = ['Professional', 'Good Quality'];
  final List<String> _photos = ['ac_after_service.jpg'];
  String? _errorMessage;

  final List<String> _availableTags = [
    'Professional',
    'On Time',
    'Good Quality',
    'Clean Work',
    'Value for Money',
    'Helpful Technician',
  ];

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  String _getRatingLabel(double val) {
    if (val <= 1.0) return '1 ★ Very Poor';
    if (val <= 2.0) return '2 ★★ Poor';
    if (val <= 3.0) return '3 ★★★ Average';
    if (val <= 4.0) return '4 ★★★★ Good';
    return '5 ★★★★★ Excellent';
  }

  void _handleSubmit() {
    setState(() => _errorMessage = null);

    if (_overallRating == 0) {
      setState(() => _errorMessage = 'Please select an overall rating.');
      return;
    }

    // 58B Low Rating Support Prompt (If 1-2 stars selected)
    if (_overallRating <= 2.0) {
      showDialog(
        context: context,
        builder: (_) => Dialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          backgroundColor: AppColors.pureWhite,
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.sentiment_dissatisfied_rounded, color: AppColors.warningAmber, size: 56),
                const SizedBox(height: 12),
                Text('We’re Sorry!', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                const SizedBox(height: 6),
                Text(
                  'We noticed your experience wasn’t great. Would you like to raise a complaint so our support team can resolve this?',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary, height: 1.4),
                ),
                const SizedBox(height: 20),

                Column(
                  children: [
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () {
                          Navigator.pop(context);
                          Navigator.of(context).push(
                            MaterialPageRoute(builder: (_) => RaiseComplaintScreen(bookingId: widget.bookingId)),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primaryBlue,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        child: Text('CONTACT SUPPORT', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold)),
                      ),
                    ),
                    const SizedBox(height: 8),
                    TextButton(
                      onPressed: () {
                        Navigator.pop(context);
                        _proceedToSubmission();
                      },
                      child: Text('SUBMIT REVIEW ANYWAY', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textSecondary)),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      );
      return;
    }

    _proceedToSubmission();
  }

  void _proceedToSubmission() {
    final review = ServiceReview(
      id: 'rev_${DateTime.now().millisecondsSinceEpoch}',
      bookingId: widget.bookingId,
      overallRating: _overallRating,
      serviceQuality: _serviceQuality,
      professionalism: _professionalism,
      valueForMoney: _valueForMoney,
      comment: _commentController.text.trim(),
      tags: _selectedTags,
      photos: _photos,
      dateText: 'Just now',
    );

    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (_) => ReviewSubmittedScreen(review: review),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Rate Service', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 57A Overall Star Rating Header
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
                ),
                child: Column(
                  children: [
                    Text('How was your experience?', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(5, (index) {
                        final starVal = index + 1.0;
                        final isFilled = starVal <= _overallRating;
                        return IconButton(
                          icon: Icon(
                            isFilled ? Icons.star_rounded : Icons.star_outline_rounded,
                            color: AppColors.warningAmber,
                            size: 36,
                          ),
                          onPressed: () => setState(() => _overallRating = starVal),
                        );
                      }),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      _getRatingLabel(_overallRating),
                      style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.secondaryGreen),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Rating Categories (57B, 57C, 57D)
              Text('DETAILED RATING (OPTIONAL)', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5)),
              const SizedBox(height: 10),
              _buildCategoryRatingRow('Service Quality', _serviceQuality, (val) => setState(() => _serviceQuality = val)),
              _buildCategoryRatingRow('Professionalism', _professionalism, (val) => setState(() => _professionalism = val)),
              _buildCategoryRatingRow('Value for Money', _valueForMoney, (val) => setState(() => _valueForMoney = val)),
              const SizedBox(height: 20),

              // 57F Review Tags
              Text('WHAT DID YOU LIKE?', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5)),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: _availableTags.map((tag) {
                  final isSelected = _selectedTags.contains(tag);
                  return FilterChip(
                    label: Text(tag),
                    selected: isSelected,
                    selectedColor: AppColors.secondaryGreen.withValues(alpha: 0.15),
                    backgroundColor: AppColors.pureWhite,
                    checkmarkColor: AppColors.secondaryGreen,
                    labelStyle: GoogleFonts.inter(fontSize: 12, color: isSelected ? AppColors.secondaryGreen : AppColors.deepNavy, fontWeight: isSelected ? FontWeight.bold : FontWeight.w500),
                    onSelected: (val) {
                      setState(() {
                        if (val) {
                          _selectedTags.add(tag);
                        } else {
                          _selectedTags.remove(tag);
                        }
                      });
                    },
                  );
                }).toList(),
              ),
              const SizedBox(height: 20),

              // 57E Comment Input (0/500)
              Text('ADD A COMMENT (OPTIONAL)', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5)),
              const SizedBox(height: 8),
              TextField(
                controller: _commentController,
                maxLength: 500,
                maxLines: 3,
                style: GoogleFonts.inter(fontSize: 14, color: AppColors.deepNavy),
                decoration: const InputDecoration(
                  hintText: 'Tell us about your experience...',
                ),
              ),
              const SizedBox(height: 16),

              // 57G Photo Upload
              Text('ADD PHOTOS (OPTIONAL)', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5)),
              const SizedBox(height: 8),
              Row(
                children: [
                  ..._photos.map((p) => Container(
                        margin: const EdgeInsets.only(right: 10),
                        width: 60,
                        height: 60,
                        decoration: BoxDecoration(
                          color: AppColors.pureWhite,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.2)),
                        ),
                        child: const Icon(Icons.image_rounded, color: AppColors.primaryBlue, size: 28),
                      )),
                  if (_photos.length < 5)
                    GestureDetector(
                      onTap: () {
                        setState(() => _photos.add('new_photo.png'));
                      },
                      child: Container(
                        width: 60,
                        height: 60,
                        decoration: BoxDecoration(
                          color: AppColors.primaryBlue.withValues(alpha: 0.08),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppColors.primaryBlue, width: 1.5),
                        ),
                        child: const Icon(Icons.add_a_photo_rounded, color: AppColors.primaryBlue, size: 24),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 24),

              if (_errorMessage != null) ...[
                Text(_errorMessage!, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.errorRed)),
                const SizedBox(height: 16),
              ],

              PrimaryButton(
                text: 'SUBMIT REVIEW',
                onPressed: _handleSubmit,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCategoryRatingRow(String title, double value, ValueChanged<double> onChanged) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: AppColors.pureWhite,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.1)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
          Row(
            children: List.generate(5, (index) {
              final starVal = index + 1.0;
              return InkWell(
                onTap: () => onChanged(starVal),
                child: Icon(
                  starVal <= value ? Icons.star_rounded : Icons.star_outline_rounded,
                  color: AppColors.warningAmber,
                  size: 22,
                ),
              );
            }),
          ),
        ],
      ),
    );
  }
}
