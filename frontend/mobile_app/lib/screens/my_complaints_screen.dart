import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../models/complaint.dart';
import '../widgets/common/empty_state.dart';
import 'complaint_detail_screen.dart';
import 'raise_complaint_screen.dart';

class MyComplaintsScreen extends StatefulWidget {
  const MyComplaintsScreen({super.key});

  @override
  State<MyComplaintsScreen> createState() => _MyComplaintsScreenState();
}

class _MyComplaintsScreenState extends State<MyComplaintsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final List<ComplaintItem> _complaints = [
    ComplaintItem(
      complaintId: '#C1023',
      bookingId: '#BK10245',
      category: 'Payment Issue',
      description: 'I made the payment but it failed and amount was deducted from my account.',
      attachments: ['img1.png', 'img2.png'],
      status: 'IN_PROGRESS',
      raisedDate: '25 May 2025, 10:30 AM',
      conversation: [
        ChatMessage(id: '1', sender: 'User', text: 'Payment was deducted but booking failed.', time: '25 May, 10:30 AM'),
        ChatMessage(id: '2', sender: 'SaveTogether Support', text: 'Thanks. We are checking this with our payment partner.', time: '25 May, 10:32 AM'),
        ChatMessage(id: '3', sender: 'User', text: 'Please let me know once updated.', time: '25 May, 2:10 PM'),
        ChatMessage(id: '4', sender: 'SaveTogether Support', text: 'We are checking with our payment partner. Please allow some time.', time: '25 May, 2:15 PM'),
      ],
    ),
    ComplaintItem(
      complaintId: '#C1018',
      bookingId: '#BK09987',
      category: 'Service Issue',
      description: 'Technician arrived 45 minutes late.',
      attachments: [],
      status: 'RESOLVED',
      raisedDate: '18 May 2025',
      resolutionSummary: 'We verified the issue and processed a refund of ₹1,398 to your original UPI account.',
      conversation: [
        ChatMessage(id: '1', sender: 'User', text: 'Technician arrived late.', time: '18 May'),
        ChatMessage(id: '2', sender: 'SaveTogether Support', text: 'Apologies. We have issued a full refund.', time: '18 May'),
      ],
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
        title: Text('My Complaints', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_circle_outline_rounded, color: AppColors.primaryBlue),
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const RaiseComplaintScreen()),
              );
            },
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppColors.primaryBlue,
          unselectedLabelColor: AppColors.textSecondary,
          indicatorColor: AppColors.primaryBlue,
          tabs: const [
            Tab(text: 'ALL'),
            Tab(text: 'IN PROGRESS'),
            Tab(text: 'RESOLVED'),
            Tab(text: 'CLOSED'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildList(_complaints),
          _buildList(_complaints.where((c) => c.status == 'IN_PROGRESS' || c.status == 'OPEN').toList()),
          _buildList(_complaints.where((c) => c.status == 'RESOLVED').toList()),
          _buildList(_complaints.where((c) => c.status == 'CLOSED').toList()),
        ],
      ),
    );
  }

  Widget _buildList(List<ComplaintItem> list) {
    if (list.isEmpty) {
      return EmptyState(
        icon: Icons.headset_mic_rounded,
        title: 'No complaints here',
        description: 'If you experience any problem with a service, you can raise a complaint here.',
        actionText: 'RAISE A COMPLAINT',
        onAction: () {
          Navigator.of(context).push(
            MaterialPageRoute(builder: (_) => const RaiseComplaintScreen()),
          );
        },
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(20.0),
      itemCount: list.length,
      itemBuilder: (context, index) {
        final c = list[index];
        final isResolved = c.status == 'RESOLVED';

        return GestureDetector(
          onTap: () {
            Navigator.of(context).push(
              MaterialPageRoute(
                builder: (_) => ComplaintDetailScreen(complaint: c),
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
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Complaint ${c.complaintId}', style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: isResolved ? AppColors.secondaryGreen.withValues(alpha: 0.12) : AppColors.warningAmber.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        c.status,
                        style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.bold, color: isResolved ? AppColors.secondaryGreen : AppColors.warningAmber),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text('Booking ID ${c.bookingId}', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
                Text('Category: ${c.category}', style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
                const SizedBox(height: 4),
                Text(c.raisedDate, style: GoogleFonts.inter(fontSize: 11, color: AppColors.textSecondary)),
                const SizedBox(height: 12),

                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton(
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) => ComplaintDetailScreen(complaint: c),
                        ),
                      );
                    },
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.primaryBlue,
                      side: const BorderSide(color: AppColors.primaryBlue),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: Text('VIEW COMPLAINT', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
