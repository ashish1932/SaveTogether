import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../core/constants/app_colors.dart';
import '../providers/service_provider.dart';
import '../providers/booking_provider.dart';
import '../widgets/cards/service_card.dart';
import '../widgets/home/filter_bottom_sheet.dart';
import '../widgets/home/sort_bottom_sheet.dart';
import 'service_detail_screen.dart';

class AllServicesScreen extends StatefulWidget {
  final String? selectedCategoryFilter;

  const AllServicesScreen({
    super.key,
    this.selectedCategoryFilter,
  });

  @override
  State<AllServicesScreen> createState() => _AllServicesScreenState();
}

class _AllServicesScreenState extends State<AllServicesScreen> {
  String? _activeCategory;
  String _activeSort = 'Recommended';

  @override
  void initState() {
    super.initState();
    _activeCategory = widget.selectedCategoryFilter;
  }

  @override
  Widget build(BuildContext context) {
    final serviceProvider = Provider.of<ServiceProvider>(context);
    final services = serviceProvider.services.where((s) {
      if (_activeCategory == null || _activeCategory == 'All') return true;
      return s.name.toLowerCase().contains(_activeCategory!.toLowerCase()) ||
          s.category.toLowerCase().contains(_activeCategory!.toLowerCase());
    }).toList();

    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text(
          _activeCategory != null ? '$_activeCategory Services' : 'All Services',
          style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            children: [
              // Filter & Sort Action Buttons Bar
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () {
                        FilterBottomSheet.show(
                          context,
                          onApply: (category, priceRange, availableThisWeek) {
                            setState(() => _activeCategory = category);
                          },
                        );
                      },
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppColors.deepNavy,
                        side: BorderSide(color: AppColors.primaryBlue.withValues(alpha: 0.2)),
                        backgroundColor: AppColors.pureWhite,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                      icon: const Icon(Icons.filter_list_rounded, size: 18, color: AppColors.primaryBlue),
                      label: Text(_activeCategory != null ? 'Filter: $_activeCategory' : 'Filter', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () {
                        SortBottomSheet.show(
                          context,
                          currentSort: _activeSort,
                          onApply: (sort) => setState(() => _activeSort = sort),
                        );
                      },
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppColors.deepNavy,
                        side: BorderSide(color: AppColors.primaryBlue.withValues(alpha: 0.2)),
                        backgroundColor: AppColors.pureWhite,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                      icon: const Icon(Icons.swap_vert_rounded, size: 18, color: AppColors.primaryBlue),
                      label: Text('Sort: $_activeSort', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600), maxLines: 1, overflow: TextOverflow.ellipsis),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Services List
              Expanded(
                child: ListView.builder(
                  itemCount: services.length,
                  itemBuilder: (context, index) {
                    final srv = services[index];
                    final campaign = serviceProvider.activeCampaigns.firstWhere(
                      (c) => c.serviceId == srv.id,
                      orElse: () => serviceProvider.activeCampaigns.first,
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
              ),
            ],
          ),
        ),
      ),
    );
  }
}
