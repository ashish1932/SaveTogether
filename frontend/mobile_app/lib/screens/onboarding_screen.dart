import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../widgets/buttons/primary_button.dart';
import 'login_screen.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _controller = PageController();
  int _currentPage = 0;

  final List<Map<String, String>> _pages = [
    {
      'title': 'Book Services Easily',
      'description': 'Choose the service you need and book it for yourself.',
      'icon': 'phone_service',
    },
    {
      'title': 'More Local Bookings =\nBetter Prices',
      'description': 'When more people nearby book the same service, better prices can become available.',
      'icon': 'community_price',
    },
    {
      'title': 'Refer & Earn',
      'description': 'Invite friends and neighbors to SaveTogether and earn rewards on eligible bookings.',
      'icon': 'refer_reward',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      body: SafeArea(
        child: Column(
          children: [
            // Top Navigation Bar (SKIP Button on top right for pages 1 and 2)
            Align(
              alignment: Alignment.centerRight,
              child: SizedBox(
                height: 48,
                child: _currentPage < 2
                    ? TextButton(
                        onPressed: () {
                          Navigator.of(context).pushReplacement(
                            MaterialPageRoute(builder: (_) => const LoginScreen()),
                          );
                        },
                        child: Text(
                          'SKIP',
                          style: GoogleFonts.inter(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      )
                    : const SizedBox(),
              ),
            ),

            // Onboarding Carousel View
            Expanded(
              child: PageView.builder(
                controller: _controller,
                onPageChanged: (index) => setState(() => _currentPage = index),
                itemCount: _pages.length,
                itemBuilder: (context, index) {
                  final page = _pages[index];

                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 32.0),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        // Visual Illustration Box
                        Container(
                          width: 200,
                          height: 200,
                          padding: const EdgeInsets.all(24),
                          decoration: BoxDecoration(
                            color: AppColors.pureWhite,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.deepNavy.withValues(alpha: 0.06),
                                blurRadius: 20,
                                offset: const Offset(0, 8),
                              ),
                            ],
                            border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.15)),
                          ),
                          child: index == 0
                              ? const Icon(Icons.touch_app_rounded, size: 84, color: AppColors.primaryBlue)
                              : index == 1
                                  ? Column(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        Row(
                                          mainAxisAlignment: MainAxisAlignment.center,
                                          children: const [
                                            Icon(Icons.home_rounded, color: AppColors.primaryBlue, size: 28),
                                            SizedBox(width: 8),
                                            Icon(Icons.home_rounded, color: AppColors.primaryBlue, size: 28),
                                            SizedBox(width: 8),
                                            Icon(Icons.home_rounded, color: AppColors.primaryBlue, size: 28),
                                          ],
                                        ),
                                        const SizedBox(height: 8),
                                        const Icon(Icons.arrow_downward_rounded, color: AppColors.secondaryGreen, size: 24),
                                        Text(
                                          '₹799 → ₹699',
                                          style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.secondaryGreen),
                                        ),
                                      ],
                                    )
                                  : const Icon(Icons.card_giftcard_rounded, size: 84, color: AppColors.secondaryGreen),
                        ),
                        const SizedBox(height: 40),

                        // Heading (H1 28px Bold Navy)
                        Text(
                          page['title']!,
                          textAlign: TextAlign.center,
                          style: GoogleFonts.inter(
                            fontSize: 26,
                            fontWeight: FontWeight.w700,
                            color: AppColors.deepNavy,
                            height: 1.3,
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Description (Body Large 16px Slate Gray)
                        Text(
                          page['description']!,
                          textAlign: TextAlign.center,
                          style: GoogleFonts.inter(
                            fontSize: 15,
                            fontWeight: FontWeight.w400,
                            color: AppColors.textSecondary,
                            height: 1.5,
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),

            // Pagination Dots Indicator (● ○ ○)
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                _pages.length,
                (index) => AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  width: _currentPage == index ? 24 : 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: _currentPage == index ? AppColors.primaryBlue : AppColors.primaryBlue.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Primary Button CTA (NEXT / GET STARTED)
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: PrimaryButton(
                text: _currentPage == 2 ? 'GET STARTED' : 'NEXT',
                onPressed: () {
                  if (_currentPage < 2) {
                    _controller.nextPage(
                      duration: const Duration(milliseconds: 300),
                      curve: Curves.easeInOut,
                    );
                  } else {
                    Navigator.of(context).pushReplacement(
                      MaterialPageRoute(builder: (_) => const LoginScreen()),
                    );
                  }
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
