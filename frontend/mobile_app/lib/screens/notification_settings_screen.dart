import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';

class NotificationSettingsScreen extends StatefulWidget {
  const NotificationSettingsScreen({super.key});

  @override
  State<NotificationSettingsScreen> createState() => _NotificationSettingsScreenState();
}

class _NotificationSettingsScreenState extends State<NotificationSettingsScreen> {
  bool _bookingUpdates = true;
  bool _priceDemandUpdates = true;
  bool _serviceReminders = true;
  bool _paymentUpdates = true;
  bool _referralRewards = true;
  bool _promotionsOffers = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Notification Settings', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(20.0),
          children: [
            _buildSwitchTile('Booking Updates', 'Get updates about your bookings & vendor dispatch.', _bookingUpdates, (val) => setState(() => _bookingUpdates = val)),
            _buildSwitchTile('Price & Demand Updates', 'Stay informed about price drops and community demand updates.', _priceDemandUpdates, (val) => setState(() => _priceDemandUpdates = val)),
            _buildSwitchTile('Service Reminders', 'Get reminders for your upcoming service appointments.', _serviceReminders, (val) => setState(() => _serviceReminders = val)),
            _buildSwitchTile('Payment Updates', 'Payment success, failure & refund status notifications.', _paymentUpdates, (val) => setState(() => _paymentUpdates = val)),
            _buildSwitchTile('Referral & Rewards', 'Updates about your referrals and earned rewards.', _referralRewards, (val) => setState(() => _referralRewards = val)),
            _buildSwitchTile('Promotions & Offers', 'Receive promotional offers and discount notifications.', _promotionsOffers, (val) => setState(() => _promotionsOffers = val)),
          ],
        ),
      ),
    );
  }

  Widget _buildSwitchTile(String title, String subtitle, bool value, ValueChanged<bool> onChanged) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.pureWhite,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                const SizedBox(height: 2),
                Text(subtitle, style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary, height: 1.3)),
              ],
            ),
          ),
          Switch(
            value: value,
            activeColor: AppColors.primaryBlue,
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }
}
