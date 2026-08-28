import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../models/referral.dart';
import 'reward_detail_screen.dart';
import 'all_services_screen.dart';

class RewardsWalletScreen extends StatelessWidget {
  const RewardsWalletScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<RewardTransactionItem> transactions = [
      RewardTransactionItem(id: 'tx_01', title: 'Referral Reward', subtitle: 'Rahul Sharma', amount: 50, isCredit: true, dateText: 'Today, 5:24 PM', status: 'Completed'),
      RewardTransactionItem(id: 'tx_02', title: 'Referral Reward', subtitle: 'Priya Nair', amount: 50, isCredit: true, dateText: 'Yesterday, 7:10 PM', status: 'Completed'),
      RewardTransactionItem(id: 'tx_03', title: 'Used on AC Servicing', subtitle: 'Booking #BK10245', amount: 100, isCredit: false, dateText: '20 Aug 2026', status: 'Used'),
      RewardTransactionItem(id: 'tx_04', title: 'Referral Reward', subtitle: 'Anita Verma', amount: 50, isCredit: true, dateText: '15 Aug 2026', status: 'Completed'),
    ];

    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Rewards Wallet', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Available Balance Card (Screen 45 Hero)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [AppColors.primaryBlue, Color(0xFF1553B8)],
                  ),
                  borderRadius: BorderRadius.circular(22),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.primaryBlue.withValues(alpha: 0.3),
                      blurRadius: 16,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'AVAILABLE BALANCE',
                      style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white70, letterSpacing: 0.5),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      '₹300',
                      style: GoogleFonts.inter(fontSize: 38, fontWeight: FontWeight.w700, color: Colors.white),
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(builder: (_) => const AllServicesScreen()),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: AppColors.primaryBlue,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        child: Text('USE REWARDS ON BOOKING', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Breakdown Stats Grid
              Row(
                children: [
                  Expanded(child: _buildStatCard('Available', '₹300', AppColors.secondaryGreen)),
                  const SizedBox(width: 12),
                  Expanded(child: _buildStatCard('Pending', '₹100', AppColors.warningAmber)),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(child: _buildStatCard('Total Earned', '₹400', AppColors.primaryBlue)),
                  const SizedBox(width: 12),
                  Expanded(child: _buildStatCard('Used', '₹100', AppColors.deepNavy)),
                ],
              ),
              const SizedBox(height: 28),

              Text(
                'TRANSACTION HISTORY (45E)',
                style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5),
              ),
              const SizedBox(height: 14),

              // 45E Transaction History List
              ...transactions.map((tx) {
                return GestureDetector(
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => RewardDetailScreen(transaction: tx),
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
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: (tx.isCredit ? AppColors.secondaryGreen : AppColors.errorRed).withValues(alpha: 0.12),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            tx.isCredit ? Icons.add_rounded : Icons.remove_rounded,
                            color: tx.isCredit ? AppColors.secondaryGreen : AppColors.errorRed,
                            size: 20,
                          ),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(tx.title, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                              Text(tx.subtitle, style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
                              Text(tx.dateText, style: GoogleFonts.inter(fontSize: 11, color: AppColors.textSecondary)),
                            ],
                          ),
                        ),
                        Text(
                          '${tx.isCredit ? '+' : '-'} ₹${tx.amount.toInt()}',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: tx.isCredit ? AppColors.secondaryGreen : AppColors.deepNavy,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatCard(String title, String val, Color color) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.pureWhite,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: color.withValues(alpha: 0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
          const SizedBox(height: 4),
          Text(val, style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.bold, color: color)),
        ],
      ),
    );
  }
}
