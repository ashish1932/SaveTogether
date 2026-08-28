import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../widgets/buttons/primary_button.dart';
import 'my_complaints_screen.dart';

class RaiseComplaintScreen extends StatefulWidget {
  final String? bookingId;

  const RaiseComplaintScreen({
    super.key,
    this.bookingId,
  });

  @override
  State<RaiseComplaintScreen> createState() => _RaiseComplaintScreenState();
}

class _RaiseComplaintScreenState extends State<RaiseComplaintScreen> {
  String _selectedCategory = 'Payment Issue';
  final TextEditingController _descController = TextEditingController();
  final List<String> _attachedImages = ['payment_ss.png', 'receipt.png'];
  String? _errorMessage;

  final List<String> _categories = [
    'Payment Issue',
    'Service Issue',
    'Booking Issue',
    'Refund Issue',
    'Vendor Issue',
    'Pricing Issue',
    'Referral Issue',
    'Technical Issue',
    'Other',
  ];

  @override
  void dispose() {
    _descController.dispose();
    super.dispose();
  }

  void _showCategorySelectorModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.pureWhite,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Select Complaint Category', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                const SizedBox(height: 12),
                Expanded(
                  child: ListView(
                    children: _categories.map((cat) {
                      final isSelected = _selectedCategory == cat;
                      return RadioListTile<String>(
                        title: Text(cat, style: GoogleFonts.inter(fontSize: 14, color: AppColors.deepNavy)),
                        value: cat,
                        groupValue: _selectedCategory,
                        activeColor: AppColors.primaryBlue,
                        onChanged: (val) {
                          if (val != null) {
                            setState(() => _selectedCategory = val);
                            Navigator.pop(context);
                          }
                        },
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _handleSubmit() {
    setState(() => _errorMessage = null);

    if (_descController.text.trim().isEmpty) {
      setState(() => _errorMessage = 'Please describe your issue.');
      return;
    }

    // 53.4 Complaint Submitted Dialog (#C1023)
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        backgroundColor: AppColors.pureWhite,
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.secondaryGreen.withValues(alpha: 0.12),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.check_circle_rounded, color: AppColors.secondaryGreen, size: 48),
              ),
              const SizedBox(height: 16),
              Text('✓ Complaint Submitted', style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
              const SizedBox(height: 8),
              Text('Complaint ID: #C1023', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
              const SizedBox(height: 6),
              Text(
                'Our support team will review your complaint and get back to you shortly.',
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary, height: 1.4),
              ),
              const SizedBox(height: 24),

              PrimaryButton(
                text: 'VIEW COMPLAINT',
                onPressed: () {
                  Navigator.pop(context); // Close dialog
                  Navigator.of(context).pushReplacement(
                    MaterialPageRoute(builder: (_) => const MyComplaintsScreen()),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final String activeBookingId = widget.bookingId ?? '#BK10245';

    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Raise a Complaint', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Linked Booking Card
              Text('BOOKING DETAILS', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5)),
              const SizedBox(height: 8),
              Container(
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
                        color: AppColors.primaryBlue.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.ac_unit_rounded, color: AppColors.primaryBlue, size: 24),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('AC Servicing (2 ACs)', style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                          Text('Booking ID $activeBookingId', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.primaryBlue)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Category Selector
              Text('CATEGORY *', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5)),
              const SizedBox(height: 8),
              GestureDetector(
                onTap: () => _showCategorySelectorModal(context),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.pureWhite,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.15)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(_selectedCategory, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                      const Icon(Icons.arrow_drop_down_rounded, color: AppColors.primaryBlue),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Description Field
              Text('DESCRIPTION *', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5)),
              const SizedBox(height: 8),
              TextField(
                controller: _descController,
                maxLines: 4,
                style: GoogleFonts.inter(fontSize: 14, color: AppColors.deepNavy),
                decoration: const InputDecoration(
                  hintText: 'Describe your issue in detail...',
                ),
              ),
              const SizedBox(height: 20),

              // Image Uploader (up to 5 images)
              Text('ADD IMAGES (OPTIONAL)', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.textSecondary, letterSpacing: 0.5)),
              const SizedBox(height: 8),
              Row(
                children: [
                  ..._attachedImages.map((img) {
                    return Container(
                      margin: const EdgeInsets.only(right: 10),
                      width: 64,
                      height: 64,
                      decoration: BoxDecoration(
                        color: AppColors.pureWhite,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.2)),
                      ),
                      child: const Icon(Icons.image_rounded, color: AppColors.primaryBlue, size: 28),
                    );
                  }),
                  if (_attachedImages.length < 5)
                    GestureDetector(
                      onTap: () {
                        setState(() {
                          _attachedImages.add('new_img.png');
                        });
                      },
                      child: Container(
                        width: 64,
                        height: 64,
                        decoration: BoxDecoration(
                          color: AppColors.primaryBlue.withValues(alpha: 0.08),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppColors.primaryBlue, width: 1.5),
                        ),
                        child: const Icon(Icons.add_a_photo_rounded, color: AppColors.primaryBlue, size: 24),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 6),
              Text('Up to 5 images (Max 5MB each)', style: GoogleFonts.inter(fontSize: 11, color: AppColors.textSecondary)),
              const SizedBox(height: 24),

              if (_errorMessage != null) ...[
                Text(_errorMessage!, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.errorRed)),
                const SizedBox(height: 16),
              ],

              PrimaryButton(
                text: 'SUBMIT COMPLAINT',
                onPressed: _handleSubmit,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
