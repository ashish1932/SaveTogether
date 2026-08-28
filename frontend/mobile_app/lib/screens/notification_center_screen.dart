import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../models/notification_item.dart';
import '../widgets/common/empty_state.dart';
import '../widgets/common/error_state.dart';
import 'notification_detail_screen.dart';

class NotificationCenterScreen extends StatefulWidget {
  const NotificationCenterScreen({super.key});

  @override
  State<NotificationCenterScreen> createState() => _NotificationCenterScreenState();
}

class _NotificationCenterScreenState extends State<NotificationCenterScreen> {
  String _selectedFilter = 'All'; // 'All', 'Unread', 'Bookings', 'Payments', 'Offers'
  bool _hasError = false;

  late List<NotificationItem> _notifications;

  @override
  void initState() {
    super.initState();
    _notifications = [
      NotificationItem(
        id: 'nt_01',
        type: 'DEMAND',
        title: 'Your society reached 20 AC bookings!',
        message: 'Great news! Customers in your society have reached 20 AC bookings. Your booking may now qualify for the next pricing tier.',
        timeAgo: '5 min ago',
        isRead: false,
        dateGroup: 'TODAY',
        relatedBookingId: '#BK10245',
      ),
      NotificationItem(
        id: 'nt_02',
        type: 'PRICE_DROP',
        title: 'Your price dropped from ₹699 to ₹599',
        message: 'Your local demand reached the required level for the next pricing tier. You saved ₹200 on each AC.',
        timeAgo: '25 min ago',
        isRead: false,
        dateGroup: 'TODAY',
        relatedBookingId: '#BK10245',
      ),
      NotificationItem(
        id: 'nt_03',
        type: 'SERVICE_SCHEDULED',
        title: 'Service scheduled tomorrow',
        message: 'Your AC Servicing appointment is scheduled for tomorrow (Sunday, 9 AM – 12 PM).',
        timeAgo: '2 hours ago',
        isRead: true,
        dateGroup: 'TODAY',
        relatedBookingId: '#BK10245',
      ),
      NotificationItem(
        id: 'nt_04',
        type: 'VENDOR_ASSIGNED',
        title: 'A service provider has been assigned',
        message: 'Your AC servicing booking has been assigned to CoolCare Services.',
        timeAgo: '4 hours ago',
        isRead: true,
        dateGroup: 'TODAY',
        relatedBookingId: '#BK10245',
      ),
      NotificationItem(
        id: 'nt_05',
        type: 'REFERRAL',
        title: 'You earned a referral reward!',
        message: 'Your neighbor joined SaveTogether! ₹50 referral reward has been added to your wallet balance.',
        timeAgo: 'Yesterday',
        isRead: true,
        dateGroup: 'YESTERDAY',
      ),
    ];
  }

  void _handleMarkAllRead() {
    setState(() {
      _notifications = _notifications.map((n) => n.copyWith(isRead: true)).toList();
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('✓ All notifications marked as read'),
        duration: Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _notifications.where((n) {
      if (_selectedFilter == 'Unread') return !n.isRead;
      if (_selectedFilter == 'Bookings') return n.type == 'DEMAND' || n.type == 'SERVICE_SCHEDULED' || n.type == 'VENDOR_ASSIGNED';
      if (_selectedFilter == 'Payments') return n.type == 'PRICE_DROP' || n.type == 'PAYMENT' || n.type == 'REFUND';
      if (_selectedFilter == 'Offers') return n.type == 'REFERRAL';
      return true;
    }).toList();

    final todayItems = filtered.where((n) => n.dateGroup == 'TODAY').toList();
    final yesterdayItems = filtered.where((n) => n.dateGroup == 'YESTERDAY').toList();

    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Notifications', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
        actions: [
          TextButton.icon(
            onPressed: _handleMarkAllRead,
            icon: const Icon(Icons.done_all_rounded, size: 16, color: AppColors.primaryBlue),
            label: Text('Mark all read', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Filter Chips Bar (All, Unread, Bookings, Payments, Offers)
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              child: Row(
                children: ['All', 'Unread', 'Bookings', 'Payments', 'Offers'].map((filter) {
                  final isSelected = _selectedFilter == filter;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8.0),
                    child: ChoiceChip(
                      label: Text(filter),
                      selected: isSelected,
                      selectedColor: AppColors.primaryBlue,
                      backgroundColor: AppColors.pureWhite,
                      labelStyle: GoogleFonts.inter(
                        fontSize: 13,
                        fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                        color: isSelected ? Colors.white : AppColors.deepNavy,
                      ),
                      onSelected: (val) {
                        if (val) setState(() => _selectedFilter = filter);
                      },
                    ),
                  );
                }).toList(),
              ),
            ),

            // Content Body
            Expanded(
              child: _hasError
                  // 40D Error State
                  ? ErrorState(
                      explanation: 'Unable to load notifications. Please check your connection.',
                      onTryAgain: () => setState(() => _hasError = false),
                    )
                  : filtered.isEmpty
                      // 40C Empty State
                      ? EmptyState(
                          icon: Icons.notifications_off_rounded,
                          title: 'You\'re all caught up!',
                          description: 'New updates about your bookings, payments, and offers will appear here.',
                          actionText: 'REFRESH',
                          onAction: () => setState(() {}),
                        )
                      // Notification List
                      : ListView(
                          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 8.0),
                          children: [
                            if (todayItems.isNotEmpty) ...[
                              Text('TODAY', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5)),
                              const SizedBox(height: 10),
                              ...todayItems.map((item) => _buildNotificationCard(item)),
                              const SizedBox(height: 16),
                            ],
                            if (yesterdayItems.isNotEmpty) ...[
                              Text('YESTERDAY', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5)),
                              const SizedBox(height: 10),
                              ...yesterdayItems.map((item) => _buildNotificationCard(item)),
                            ],
                          ],
                        ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNotificationCard(NotificationItem item) {
    return GestureDetector(
      onTap: () {
        setState(() {
          _notifications = _notifications.map((n) {
            return n.id == item.id ? n.copyWith(isRead: true) : n;
          }).toList();
        });
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (_) => NotificationDetailScreen(notification: item),
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: item.isRead ? AppColors.pureWhite : AppColors.primaryBlue.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: item.isRead ? AppColors.primaryBlue.withValues(alpha: 0.1) : AppColors.primaryBlue.withValues(alpha: 0.3),
            width: item.isRead ? 1 : 1.5,
          ),
          boxShadow: [
            BoxShadow(
              color: AppColors.deepNavy.withValues(alpha: 0.04),
              blurRadius: 8,
            ),
          ],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: _getIconBgColor(item.type),
                shape: BoxShape.circle,
              ),
              child: Icon(_getIconData(item.type), color: _getIconColor(item.type), size: 22),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          item.title,
                          style: GoogleFonts.inter(
                            fontSize: 14,
                            fontWeight: item.isRead ? FontWeight.w600 : FontWeight.bold,
                            color: AppColors.deepNavy,
                          ),
                        ),
                      ),
                      if (!item.isRead) ...[
                        const SizedBox(width: 8),
                        Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(
                            color: AppColors.primaryBlue,
                            shape: BoxShape.circle,
                          ),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    item.message,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary, height: 1.4),
                  ),
                  const SizedBox(height: 6),
                  Text(item.timeAgo, style: GoogleFonts.inter(fontSize: 11, color: AppColors.textSecondary)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  IconData _getIconData(String type) {
    switch (type) {
      case 'DEMAND':
        return Icons.local_fire_department_rounded;
      case 'PRICE_DROP':
        return Icons.arrow_downward_rounded;
      case 'SERVICE_SCHEDULED':
        return Icons.calendar_month_rounded;
      case 'VENDOR_ASSIGNED':
        return Icons.person_rounded;
      case 'REFERRAL':
        return Icons.card_giftcard_rounded;
      default:
        return Icons.notifications_rounded;
    }
  }

  Color _getIconBgColor(String type) {
    switch (type) {
      case 'DEMAND':
        return AppColors.warningAmber.withValues(alpha: 0.12);
      case 'PRICE_DROP':
      case 'REFERRAL':
        return AppColors.secondaryGreen.withValues(alpha: 0.12);
      default:
        return AppColors.primaryBlue.withValues(alpha: 0.12);
    }
  }

  Color _getIconColor(String type) {
    switch (type) {
      case 'DEMAND':
        return AppColors.warningAmber;
      case 'PRICE_DROP':
      case 'REFERRAL':
        return AppColors.secondaryGreen;
      default:
        return AppColors.primaryBlue;
    }
  }
}
