import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../models/review.dart';
import '../widgets/buttons/primary_button.dart';
import '../widgets/buttons/secondary_button.dart';
import 'main_navigation_screen.dart';
import 'edit_review_screen.dart';

class ReviewSubmittedScreen extends StatelessWidget {
  final ServiceReview review;

  const ReviewSubmittedScreen({
    super.key,
    required this.review,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            children: [
              const Spacer(),

              // Thank You Checkmark Graphic
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: AppColors.secondaryGreen.withValues(alpha: 0.12),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.favorite_rounded, color: AppColors.secondaryGreen, size: 64),
              ),
              const SizedBox(height: 20),

              Text(
                'Thank You for Your Feedback!',
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
              ),
              const SizedBox(height: 6),
              Text(
                'Your review helps us maintain better service quality and reward top service partners.',
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary, height: 1.4),
              ),
              const SizedBox(height: 28),

              // Rating Summary Card Box
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
                    Text('AC Servicing (2 ACs)', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                    const SizedBox(height: 4),
                    Text('Booking ID ${review.bookingId}', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
                    const SizedBox(height: 12),

                    // Overall Stars
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(5, (index) {
                        return Icon(
                          index < review.overallRating ? Icons.star_rounded : Icons.star_outline_rounded,
                          color: AppColors.warningAmber,
                          size: 28,
                        );
                      }),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      '${review.overallRating.toStringAsFixed(1)} / 5.0',
                      style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
                    ),

                    if (review.comment.isNotEmpty) ...[
                      const Divider(height: 20),
                      Text(
                        '"${review.comment}"',
                        textAlign: TextAlign.center,
                        style: GoogleFonts.inter(fontSize: 13, fontStyle: FontStyle.italic, color: AppColors.textSecondary),
                      ),
                    ],
                    const SizedBox(height: 12),

                    TextButton.icon(
                      onPressed: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => EditReviewScreen(review: review),
                          ),
                        );
                      },
                      icon: const Icon(Icons.edit_rounded, size: 16, color: AppColors.primaryBlue),
                      label: Text('EDIT REVIEW (58A)', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
                    ),
                  ],
                ),
              ),
              const Spacer(),

              PrimaryButton(
                text: 'GO TO HOME',
                onPressed: () {
                  Navigator.of(context).pushAndRemoveUntil(
                    MaterialPageRoute(builder: (_) => const MainNavigationScreen()),
                    (route) => false,
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
