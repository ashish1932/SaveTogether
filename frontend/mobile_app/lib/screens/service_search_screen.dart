import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../core/constants/app_colors.dart';
import '../providers/service_provider.dart';
import '../providers/booking_provider.dart';
import '../widgets/common/empty_state.dart';
import '../widgets/common/error_state.dart';
import '../widgets/cards/service_card.dart';
import 'service_detail_screen.dart';
import 'all_services_screen.dart';

class ServiceSearchScreen extends StatefulWidget {
  const ServiceSearchScreen({super.key});

  @override
  State<ServiceSearchScreen> createState() => _ServiceSearchScreenState();
}

class _ServiceSearchScreenState extends State<ServiceSearchScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _query = '';
  bool _hasError = false;

  final List<String> _recentSearches = ['AC servicing', 'Car wash'];
  final List<String> _popularSearches = ['AC', 'Cleaning', 'Pest Control', 'RO'];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final serviceProvider = Provider.of<ServiceProvider>(context);
    final results = serviceProvider.services.where((s) {
      if (_query.isEmpty) return false;
      return s.name.toLowerCase().contains(_query.toLowerCase()) ||
          s.category.toLowerCase().contains(_query.toLowerCase()) ||
          s.description.toLowerCase().contains(_query.toLowerCase());
    }).toList();

    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: AppColors.deepNavy),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: TextField(
          controller: _searchController,
          autofocus: true,
          onChanged: (val) => setState(() => _query = val.trim()),
          style: GoogleFonts.inter(fontSize: 16, color: AppColors.deepNavy),
          decoration: InputDecoration(
            hintText: 'Search services (e.g. AC, Cleaning)...',
            hintStyle: GoogleFonts.inter(fontSize: 14, color: AppColors.textSecondary),
            border: InputBorder.none,
            enabledBorder: InputBorder.none,
            focusedBorder: InputBorder.none,
            suffixIcon: _query.isNotEmpty
                ? IconButton(
                    icon: const Icon(Icons.close_rounded, color: AppColors.textSecondary, size: 18),
                    onPressed: () {
                      _searchController.clear();
                      setState(() => _query = '');
                    },
                  )
                : null,
          ),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: _hasError
              ? ErrorState(
                  explanation: 'We couldn’t load services. Please check your network.',
                  onTryAgain: () => setState(() => _hasError = false),
                )
              : _query.isEmpty
                  ? Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Recent Searches
                        if (_recentSearches.isNotEmpty) ...[
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'RECENT SEARCHES',
                                style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5),
                              ),
                              GestureDetector(
                                onTap: () => setState(() => _recentSearches.clear()),
                                child: Text('Clear all', style: GoogleFonts.inter(fontSize: 12, color: AppColors.primaryBlue)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          Wrap(
                            spacing: 8,
                            children: _recentSearches.map((term) {
                              return ActionChip(
                                label: Text(term),
                                backgroundColor: AppColors.pureWhite,
                                labelStyle: GoogleFonts.inter(fontSize: 13, color: AppColors.deepNavy),
                                onPressed: () {
                                  _searchController.text = term;
                                  setState(() => _query = term);
                                },
                              );
                            }).toList(),
                          ),
                          const SizedBox(height: 24),
                        ],

                        // Popular Searches
                        Text(
                          'POPULAR SEARCHES',
                          style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5),
                        ),
                        const SizedBox(height: 10),
                        Wrap(
                          spacing: 8,
                          children: _popularSearches.map((term) {
                            return ActionChip(
                              label: Text(term),
                              backgroundColor: AppColors.pureWhite,
                              labelStyle: GoogleFonts.inter(fontSize: 13, color: AppColors.primaryBlue, fontWeight: FontWeight.w600),
                              onPressed: () {
                                _searchController.text = term;
                                setState(() => _query = term);
                              },
                            );
                          }).toList(),
                        ),
                      ],
                    )
                  : results.isEmpty
                      // Empty Search State (20B)
                      ? EmptyState(
                          icon: Icons.search_off_rounded,
                          title: 'No services found',
                          description: 'Try searching for another service or check your spelling.',
                          actionText: 'VIEW ALL SERVICES',
                          onAction: () {
                            Navigator.of(context).pushReplacement(
                              MaterialPageRoute(builder: (_) => const AllServicesScreen()),
                            );
                          },
                        )
                      // Search Results (20A)
                      : ListView.builder(
                          itemCount: results.length,
                          itemBuilder: (context, index) {
                            final srv = results[index];
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
      ),
    );
  }
}
