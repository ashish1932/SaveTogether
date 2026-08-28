class PricingTier {
  final int tierLevel;
  final int minQty;
  final int maxQty;
  final double unitPrice;

  PricingTier({
    required this.tierLevel,
    required this.minQty,
    required this.maxQty,
    required this.unitPrice,
  });

  factory PricingTier.fromJson(Map<String, dynamic> json) {
    return PricingTier(
      tierLevel: json['tierLevel'] ?? 1,
      minQty: json['minQty'] ?? 1,
      maxQty: json['maxQty'] ?? 999,
      unitPrice: (json['unitPrice'] as num).toDouble(),
    );
  }
}
