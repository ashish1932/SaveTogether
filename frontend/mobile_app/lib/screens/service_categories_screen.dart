import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';
import 'all_services_screen.dart';

class ServiceCategoriesScreen extends StatelessWidget {
  const ServiceCategoriesScreen({super.key});

  final List<Map<String, dynamic>> _categories = const [
    {'name': 'AC Servicing', 'subtitle': 'Keep your AC cool', 'icon': Icons.ac_unit_rounded, 'color': AppColors.primaryBlue},
    {'name': 'Cleaning', 'subtitle': 'Home & deep cleaning', 'icon': Icons.cleaning_services_rounded, 'color': AppColors.secondaryGreen},
    {'name': 'Pest Control', 'subtitle': 'Protect your home', 'icon': Icons.security_rounded, 'color': AppColors.warningAmber},
    {'name': 'Car Wash', 'subtitle': 'Interior & exterior', 'icon': Icons.directions_car_rounded, 'color': AppColors.primaryBlue},
    {'name': 'RO Service', 'subtitle': 'RO maintenance', 'icon': Icons.water_drop_rounded, 'color': Colors.blue},
    {'name': 'Plumbing', 'subtitle': 'Pipe & fitting work', 'icon': Icons.build_rounded, 'color': Colors.orange},
    {'name': 'Electrical', 'subtitle': 'Wiring & repair', 'icon': Icons.electric_bolt_rounded, 'color': Colors.amber},
    {'name': 'Sofa Cleaning', 'subtitle': 'Sofa & upholstery', 'icon': Icons.weekend_rounded, 'color': Colors.purple},
    {'name': 'Water Tank', 'subtitle': 'Tank deep clean', 'icon': Icons.opacity_rounded, 'color': Colors.teal},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.softBlueWhite,
      appBar: AppBar(
        title: Text('All Categories', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.deepNavy)),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: GridView.builder(
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 1.1,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
            ),
            itemCount: _categories.length,
            itemBuilder: (context, index) {
              final cat = _categories[index];

              return GestureDetector(
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => AllServicesScreen(selectedCategoryFilter: cat['name']),
                    ),
                  );
                },
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.pureWhite,
                    borderRadius: BorderRadius.circular(18),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.deepNavy.withValues(alpha: 0.04),
                        blurRadius: 10,
                      ),
                    ],
                    border: Border.all(color: AppColors.primaryBlue.withValues(alpha: 0.1)),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: (cat['color'] as Color).withValues(alpha: 0.12),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(cat['icon'] as IconData, size: 32, color: cat['color'] as Color),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        cat['name'] as String,
                        textAlign: TextAlign.center,
                        style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.deepNavy),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        cat['subtitle'] as String,
                        textAlign: TextAlign.center,
                        style: GoogleFonts.inter(fontSize: 11, color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}
