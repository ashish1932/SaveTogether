import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../models/referral.dart';
import 'referral_detail_screen.dart';

class ReferralHistoryScreen extends StatefulWidget {
  const ReferralHistoryScreen({super.key});

  @override
  State<ReferralHistoryScreen> createState() => _ReferralHistoryScreenState();
}

class _ReferralHistoryScreenState extends State<ReferralHistoryScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final List<ReferralItem> _referrals = [
    ReferralItem(
      id: 'ref_01',
      friendName: 'Rahul Sharma',
      friendPhone: '+91 98765 43210',
      status: 'EARNED',
      dateText: 'Today, 5:24 PM',
      rewardAmount: 50,
      qualifyingService: 'AC Servicing (2 ACs)',
      bookingId: '#BK10245',
    ),
    ReferralItem(
      id: 'ref_02',
      friendName: 'Priya Nair',
      friendPhone: '+91 91234 56789',
      status: 'BOOKING_PENDING',
      dateText: 'Yesterday, 7:10 PM',
      rewardAmount: 50,
    ),
    ReferralItem(
      id: 'ref_03',
      friendName: 'Kumar S',
      friendPhone: '+91 99887 66554',
      status: 'INVITED',
      dateText: '4 days ago',
      rewardAmount: 50,
    ),
    ReferralItem(
      id: 'ref_04',
      friendName: 'Anita Verma',
      friendPhone: '+91 88990 11223',
      status: 'EARNED',
      dateText: '5 days ago',
      rewardAmount: 50,
    ),
  ];

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
    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Referral History', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppColors.primaryBlue,
          unselectedLabelColor: AppColors.textSecondary,
          indicatorColor: AppColors.primaryBlue,
          tabs: const [
            Tab(text: 'ALL'),
            Tab(text: 'INVITED'),
            Tab(text: 'REGISTERED'),
            Tab(text: 'EARNED'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildList(_referrals),
          _buildList(_referrals.where((r) => r.status == 'INVITED').toList()),
          _buildList(_referrals.where((r) => r.status == 'REGISTERED' || r.status == 'BOOKING_PENDING').toList()),
          _buildList(_referrals.where((r) => r.status == 'EARNED').toList()),
        ],
      ),
    );
  }

  Widget _buildList(List<ReferralItem> list) {
    if (list.isEmpty) {
      return Center(
        child: Text('No referrals in this category.', style: GoogleFonts.inter(fontSize: 14, color: AppColors.textSecondary)),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(20.0),
      itemCount: list.length,
      itemBuilder: (context, index) {
        final item = list[index];
        final isEarned = item.status == 'EARNED';

        return GestureDetector(
          onTap: () {
            Navigator.of(context).push(
              MaterialPageRoute(
                builder: (_) => ReferralDetailScreen(referral: item),
              ),
            );
          },
          child: Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.pureWhite,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  backgroundColor: AppColors.primaryBlue.withValues(alpha: 0.1),
                  child: Text(item.friendName.substring(0, 1), style: GoogleFonts.inter(fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(item.friendName, style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                      const SizedBox(height: 2),
                      Text(item.friendPhone, style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
                      const SizedBox(height: 4),
                      Text(item.dateText, style: GoogleFonts.inter(fontSize: 11, color: AppColors.textSecondary)),
                    ],
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: isEarned ? AppColors.secondaryGreen.withValues(alpha: 0.12) : AppColors.warningAmber.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        isEarned ? 'EARNED' : 'PENDING',
                        style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold, color: isEarned ? AppColors.secondaryGreen : AppColors.warningAmber),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '₹${item.rewardAmount.toInt()}',
                      style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold, color: isEarned ? AppColors.secondaryGreen : AppColors.deepNavy),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
