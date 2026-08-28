import 'pricing_tier.dart';

class Service {
  final String id;
  final String categoryId;
  final String name;
  final String description;
  final String unitLabel; // e.g., "AC Unit", "Home", "Car"
  final double basePrice;
  final String iconName;
  final List<PricingTier> pricingTiers;
  final List<String> included;
  final List<String> excluded;

  Service({
    required this.id,
    required this.categoryId,
    required this.name,
    required this.description,
    required this.unitLabel,
    required this.basePrice,
    required this.iconName,
    required this.pricingTiers,
    required this.included,
    required this.excluded,
  });

  String get category => categoryId;

  PricingTier getTierForQuantity(int totalAggregatedQty) {
    for (var tier in pricingTiers) {
      if (totalAggregatedQty >= tier.minQty && totalAggregatedQty <= tier.maxQty) {
        return tier;
      }
    }
    return pricingTiers.last;
  }
}
