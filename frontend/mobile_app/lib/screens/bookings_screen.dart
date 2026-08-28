import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../core/constants/app_colors.dart';
import '../models/booking.dart';
import '../providers/booking_provider.dart';
import '../widgets/common/status_badge.dart';
import '../widgets/common/empty_state.dart';
import 'booking_detail_screen.dart';
import 'all_services_screen.dart';

class BookingsScreen extends StatefulWidget {
  const BookingsScreen({super.key});

  @override
  State<BookingsScreen> createState() => _BookingsScreenState();
}

class _BookingsScreenState extends State<BookingsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final bookingProvider = Provider.of<BookingProvider>(context);
    final allBookings = bookingProvider.userBookings;

    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('My Bookings', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppColors.primaryBlue,
          unselectedLabelColor: AppColors.textSecondary,
          indicatorColor: AppColors.primaryBlue,
          indicatorWeight: 3,
          labelStyle: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold),
          unselectedLabelStyle: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w500),
          tabs: const [
            Tab(text: 'UPCOMING'),
            Tab(text: 'ACTIVE'),
            Tab(text: 'COMPLETED'),
            Tab(text: 'CANCELLED'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildBookingList(allBookings.where((b) => b.status == 'Scheduled' || b.status == 'Confirmed').toList()),
          _buildBookingList(allBookings.where((b) => b.status == 'In Progress' || b.status == 'Demand Aggregating' || b.status == 'Vendor Assigned').toList()),
          _buildBookingList(allBookings.where((b) => b.status == 'Completed').toList()),
          _buildBookingList(allBookings.where((b) => b.status == 'Cancelled').toList()),
        ],
      ),
    );
  }

  Widget _buildBookingList(List<Booking> list) {
    if (list.isEmpty) {
      return EmptyState(
        icon: Icons.calendar_today_rounded,
        title: 'No bookings here',
        description: 'You don\'t have any services in this category.',
        actionText: 'EXPLORE SERVICES',
        onAction: () {
          Navigator.of(context).push(
            MaterialPageRoute(builder: (_) => const AllServicesScreen()),
          );
        },
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(20.0),
      itemCount: list.length,
      itemBuilder: (context, index) {
        final b = list[index];
        return _buildBookingCard(b);
      },
    );
  }

  Widget _buildBookingCard(Booking b) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.pureWhite,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
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
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: AppColors.primaryBlue.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.ac_unit_rounded, color: AppColors.primaryBlue, size: 24),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(b.serviceName, style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                    Text('${b.quantity} ACs', style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary)),
                  ],
                ),
              ),
              StatusBadge(status: b.status),
            ],
          ),
          const Divider(height: 24),

          Row(
            children: [
              const Icon(Icons.calendar_month_rounded, size: 16, color: AppColors.primaryBlue),
              const SizedBox(width: 6),
              Text('Sun, 25 May', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
              const SizedBox(width: 16),
              const Icon(Icons.access_time_rounded, size: 16, color: AppColors.primaryBlue),
              const SizedBox(width: 6),
              Text('9 AM – 12 PM', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
            ],
          ),
          const SizedBox(height: 12),

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Booking ID', style: GoogleFonts.inter(fontSize: 11, color: AppColors.textSecondary)),
                  Text(b.bookingId, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
                ],
              ),
              Text(
                '₹${b.totalAmount.toInt()}',
                style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
              ),
            ],
          ),
          const SizedBox(height: 16),

          SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (_) => BookingDetailScreen(booking: b),
                  ),
                );
              },
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.primaryBlue,
                side: const BorderSide(color: AppColors.primaryBlue),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              child: Text('VIEW DETAILS', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }
}
