import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../core/constants/app_colors.dart';
import '../providers/auth_provider.dart';
import '../providers/service_provider.dart';
import '../providers/booking_provider.dart';
import '../widgets/home/demand_opportunity_card.dart';
import '../widgets/cards/referral_banner.dart';
import '../widgets/cards/service_card.dart';
import 'service_detail_screen.dart';
import 'service_categories_screen.dart';
import 'service_search_screen.dart';
import 'all_services_screen.dart';
import 'select_society_screen.dart';
import 'notification_center_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final serviceProvider = Provider.of<ServiceProvider>(context);
    final user = authProvider.userProfile;
    final society = user?.selectedSociety;
    final activeCampaigns = serviceProvider.activeCampaigns;

    final String userName = user?.name.split(' ').first ?? 'Ashish';
    final String greeting = '${_getGreeting()}, $userName';

    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 17.2 Header (Dynamic Greeting, Society Selector, Notification)
              Row(
                children: [
                  CircleAvatar(
                    radius: 20,
                    backgroundColor: AppColors.primaryBlue.withValues(alpha: 0.12),
                    child: Text(
                      userName.substring(0, 1),
                      style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.primaryBlue),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '👋 $greeting',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: AppColors.deepNavy,
                          ),
                        ),
                        const SizedBox(height: 2),
                        GestureDetector(
                          onTap: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(builder: (_) => const SelectSocietyScreen()),
                            );
                          },
                          child: Row(
                            children: [
                              const Icon(Icons.location_on_rounded, color: AppColors.primaryBlue, size: 14),
                              const SizedBox(width: 2),
                              Text(
                                society?.name ?? 'ABC Residency',
                                style: GoogleFonts.inter(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                  color: AppColors.primaryBlue,
                                ),
                              ),
                              const Icon(Icons.arrow_drop_down_rounded, color: AppColors.primaryBlue, size: 20),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  GestureDetector(
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => const NotificationCenterScreen()),
                      );
                    },
                    child: Stack(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: AppColors.pureWhite,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.deepNavy.withValues(alpha: 0.06),
                                blurRadius: 8,
                              ),
                            ],
                          ),
                          child: const Icon(Icons.notifications_none_rounded, color: AppColors.deepNavy, size: 20),
                        ),
                        Positioned(
                          right: 2,
                          top: 2,
                          child: Container(
                            padding: const EdgeInsets.all(4),
                            decoration: const BoxDecoration(
                              color: AppColors.errorRed,
                              shape: BoxShape.circle,
                            ),
                            child: Text(
                              '2',
                              style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.white),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // 17.4 Search Bar
              GestureDetector(
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => const ServiceSearchScreen()),
                  );
                },
                child: Container(
                  height: 48,
                  decoration: BoxDecoration(
                    color: AppColors.pureWhite,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.15)),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.deepNavy.withValues(alpha: 0.04),
                        blurRadius: 8,
                      ),
                    ],
                  ),
                  padding: const EdgeInsets.symmetric(horizontal: 14),
                  child: Row(
                    children: [
                      const Icon(Icons.search_rounded, color: AppColors.textSecondary, size: 20),
                      const SizedBox(width: 10),
                      Text(
                        'Search services (AC, Cleaning, Car wash)...',
                        style: GoogleFonts.inter(fontSize: 14, color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // 17.5 Service Categories Section
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'SERVICES',
                    style: GoogleFonts.inter(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textSecondary,
                      letterSpacing: 0.5,
                    ),
                  ),
                  GestureDetector(
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => const ServiceCategoriesScreen()),
                      );
                    },
                    child: Text(
                      'View all',
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppColors.primaryBlue,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Categories Carousel
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    _buildCategoryChip(context, 'AC', Icons.ac_unit_rounded, AppColors.primaryBlue),
                    _buildCategoryChip(context, 'Cleaning', Icons.cleaning_services_rounded, AppColors.secondaryGreen),
                    _buildCategoryChip(context, 'Pest Control', Icons.security_rounded, AppColors.warningAmber),
                    _buildCategoryChip(context, 'Car Wash', Icons.directions_car_rounded, AppColors.primaryBlue),
                    _buildCategoryChip(context, 'RO Service', Icons.water_drop_rounded, Colors.blue),
                    _buildCategoryChip(context, 'More', Icons.more_horiz_rounded, AppColors.textSecondary, isMore: true),
                  ],
                ),
              ),
              const SizedBox(height: 28),

              // 17.7 🔥 BETTER PRICES NEAR YOU (Hero Demand Section)
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '🔥 BETTER PRICES NEAR YOU',
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: AppColors.deepNavy,
                      letterSpacing: 0.5,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                'Popular services in your community',
                style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary),
              ),
              const SizedBox(height: 14),

              // Hero Demand Cards List
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: activeCampaigns.length,
                itemBuilder: (context, index) {
                  final cmp = activeCampaigns[index];
                  final srv = serviceProvider.services.firstWhere((s) => s.id == cmp.serviceId);

                  return Padding(
                    padding: const EdgeInsets.only(bottom: 16.0),
                    child: DemandOpportunityCard(
                      serviceName: cmp.serviceName,
                      aggregatedQty: cmp.totalAggregatedQty,
                      unitLabel: srv.unitLabel,
                      currentPrice: cmp.currentUnitPrice,
                      nextPrice: cmp.nextTierUnitPrice,
                      totalTargetQty: cmp.totalAggregatedQty + cmp.qtyNeededForNextTier,
                      qtyNeededForNextTier: cmp.qtyNeededForNextTier,
                      savingsAmount: cmp.currentUnitPrice - cmp.nextTierUnitPrice,
                      onBookNow: () {
                        Provider.of<BookingProvider>(context, listen: false).startBooking(srv);
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => ServiceDetailScreen(service: srv),
                          ),
                        );
                      },
                    ),
                  );
                },
              ),
              const SizedBox(height: 20),

              // 17.15 Referral Banner (🎁 REFER & EARN)
              ReferralBanner(
                rewardAmount: 50,
                onShareNow: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('✓ Referral code NEIGHBOR50 copied to clipboard!')),
                  );
                },
              ),
              const SizedBox(height: 28),

              // POPULAR SERVICES Catalog List
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'POPULAR SERVICES',
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: AppColors.deepNavy,
                      letterSpacing: 0.5,
                    ),
                  ),
                  GestureDetector(
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => const AllServicesScreen()),
                      );
                    },
                    child: Text(
                      'Explore all',
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppColors.primaryBlue,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),

              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: serviceProvider.services.length,
                itemBuilder: (context, index) {
                  final srv = serviceProvider.services[index];
                  final campaign = activeCampaigns.firstWhere(
                    (c) => c.serviceId == srv.id,
                    orElse: () => activeCampaigns.first,
                  );

                  return Padding(
                    padding: const EdgeInsets.only(bottom: 16.0),
                    child: ServiceCard(
                      serviceName: srv.name,
                      currentPrice: campaign.currentUnitPrice,
                      unitLabel: srv.unitLabel,
                      aggregatedQty: campaign.totalAggregatedQty,
                      nextPrice: campaign.nextTierUnitPrice,
                      requiredQtyForNextPrice: campaign.qtyNeededForNextTier,
                      progress: campaign.progressToNextTier,
                      onBookNow: () {
                        Provider.of<BookingProvider>(context, listen: false).startBooking(srv);
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => ServiceDetailScreen(service: srv),
                          ),
                        );
                      },
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCategoryChip(BuildContext context, String title, IconData icon, Color color, {bool isMore = false}) {
    return GestureDetector(
      onTap: () {
        if (isMore) {
          Navigator.of(context).push(
            MaterialPageRoute(builder: (_) => const ServiceCategoriesScreen()),
          );
        } else {
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (_) => AllServicesScreen(selectedCategoryFilter: title),
            ),
          );
        }
      },
      child: Container(
        margin: const EdgeInsets.only(right: 12),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: AppColors.pureWhite,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
          boxShadow: [
            BoxShadow(
              color: AppColors.deepNavy.withValues(alpha: 0.04),
              blurRadius: 8,
            ),
          ],
        ),
        child: Row(
          children: [
            Icon(icon, size: 20, color: color),
            const SizedBox(width: 8),
            Text(
              title,
              style: GoogleFonts.inter(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: AppColors.deepNavy,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
