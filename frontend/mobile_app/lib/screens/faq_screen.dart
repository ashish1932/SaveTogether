import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import '../models/complaint.dart';
import '../widgets/buttons/secondary_button.dart';
import 'raise_complaint_screen.dart';

class FaqScreen extends StatefulWidget {
  final String? initialCategory;

  const FaqScreen({
    super.key,
    this.initialCategory,
  });

  @override
  State<FaqScreen> createState() => _FaqScreenState();
}

class _FaqScreenState extends State<FaqScreen> {
  String _selectedCategory = 'All';
  String _searchQuery = '';
  String? _expandedFaqId;

  final List<FAQItem> _faqs = [
    FAQItem(
      id: 'faq_01',
      category: 'Booking',
      question: 'How does SaveTogether work?',
      answer: 'SaveTogether allows residents in the same local society or locality to book home services independently. As more neighbors book in your area, our pricing engine automatically aggregates demand to unlock lower pricing tiers.',
    ),
    FAQItem(
      id: 'faq_02',
      category: 'Booking',
      question: 'How is the final price decided?',
      answer: 'The final price per unit is calculated based on total aggregated community bookings at the end of the campaign window. If more people book, your final price drops!',
    ),
    FAQItem(
      id: 'faq_03',
      category: 'Booking',
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel your booking anytime before the service fulfillment window starts. Eligible refunds are automatically credited back to your original payment method.',
    ),
    FAQItem(
      id: 'faq_04',
      category: 'Booking',
      question: 'How do I reschedule my service?',
      answer: 'Go to My Bookings -> Select Booking -> Tap Reschedule to choose a new convenient date and time slot.',
    ),
    FAQItem(
      id: 'faq_05',
      category: 'Payment',
      question: 'What payment methods are supported?',
      answer: 'We support all major Indian payment methods: UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, Mastercard, RuPay), Net Banking, and SaveTogether Wallet Credits.',
    ),
    FAQItem(
      id: 'faq_06',
      category: 'Payment',
      question: 'Payment failed but amount was deducted. What should I do?',
      answer: 'If money was deducted during a failed transaction, it is automatically refunded by your bank within 3-5 business days. You can also raise a complaint with transaction details.',
    ),
    FAQItem(
      id: 'faq_07',
      category: 'Refund',
      question: 'When will I get my refund?',
      answer: 'UPI refunds are processed within 24-48 hours. Card and Net Banking refunds take 3-5 business days depending on your bank.',
    ),
    FAQItem(
      id: 'faq_08',
      category: 'Referral & Rewards',
      question: 'How does referral work?',
      answer: 'Share your referral code or link with friends. When they register and complete an eligible booking, you earn ₹50 in referral rewards in your wallet!',
    ),
  ];

  @override
  void initState() {
    super.initState();
    if (widget.initialCategory != null) {
      _selectedCategory = widget.initialCategory!;
    }
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _faqs.where((f) {
      final matchesCat = _selectedCategory == 'All' || f.category.toLowerCase().contains(_selectedCategory.toLowerCase());
      final matchesSearch = _searchQuery.isEmpty || f.question.toLowerCase().contains(_searchQuery.toLowerCase()) || f.answer.toLowerCase().contains(_searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    }).toList();

    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('Frequently Asked Questions', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Search Input Bar
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: TextField(
                onChanged: (val) => setState(() => _searchQuery = val.trim()),
                style: GoogleFonts.inter(fontSize: 14, color: AppColors.deepNavy),
                decoration: InputDecoration(
                  hintText: 'Search FAQs...',
                  prefixIcon: const Icon(Icons.search_rounded, color: AppColors.textSecondary),
                  filled: true,
                  fillColor: AppColors.pureWhite,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: AppColors.primaryBlue.withValues(alpha: 0.12))),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                ),
              ),
            ),

            // Category Filter Bar
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: ['All', 'Booking', 'Payment', 'Refund', 'Referral & Rewards'].map((cat) {
                  final isSelected = _selectedCategory == cat;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8.0),
                    child: ChoiceChip(
                      label: Text(cat),
                      selected: isSelected,
                      selectedColor: AppColors.primaryBlue,
                      backgroundColor: AppColors.pureWhite,
                      labelStyle: GoogleFonts.inter(fontSize: 12, color: isSelected ? Colors.white : AppColors.deepNavy, fontWeight: isSelected ? FontWeight.bold : FontWeight.w500),
                      onSelected: (val) {
                        if (val) setState(() => _selectedCategory = cat);
                      },
                    ),
                  );
                }).toList(),
              ),
            ),
            const SizedBox(height: 16),

            // FAQ List / Expandable Details (52.1)
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 20.0),
                itemCount: filtered.length,
                itemBuilder: (context, index) {
                  final faq = filtered[index];
                  final isExpanded = _expandedFaqId == faq.id;

                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    decoration: BoxDecoration(
                      color: AppColors.pureWhite,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
                    ),
                    child: ExpansionTile(
                      key: Key(faq.id),
                      initiallyExpanded: isExpanded,
                      onExpansionChanged: (exp) {
                        setState(() => _expandedFaqId = exp ? faq.id : null);
                      },
                      title: Text(
                        faq.question,
                        style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
                      ),
                      children: [
                        Padding(
                          padding: const EdgeInsets.only(left: 16, right: 16, bottom: 16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                faq.answer,
                                style: GoogleFonts.inter(fontSize: 13, color: AppColors.deepNavy, height: 1.5),
                              ),
                              const SizedBox(height: 14),

                              // Helpful feedback buttons 👍 / 👎
                              Row(
                                children: [
                                  Text('Was this helpful?', style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
                                  const SizedBox(width: 12),
                                  InkWell(
                                    onTap: () {
                                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('👍 Thank you for your feedback!')));
                                    },
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                      decoration: BoxDecoration(color: AppColors.softBlueWhite, borderRadius: BorderRadius.circular(8)),
                                      child: const Text('👍 Yes', style: TextStyle(fontSize: 12)),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  InkWell(
                                    onTap: () {
                                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('👎 Thanks. We will improve this article.')));
                                    },
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                      decoration: BoxDecoration(color: AppColors.softBlueWhite, borderRadius: BorderRadius.circular(8)),
                                      child: const Text('👎 No', style: TextStyle(fontSize: 12)),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),

            // Bottom CTA Card: Can't find what you're looking for?
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.pureWhite,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.12)),
                ),
                child: Column(
                  children: [
                    Text('Can’t find what you’re looking for?', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.deepNavy)),
                    const SizedBox(height: 10),
                    SecondaryButton(
                      text: 'RAISE A COMPLAINT',
                      onPressed: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(builder: (_) => const RaiseComplaintScreen()),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
