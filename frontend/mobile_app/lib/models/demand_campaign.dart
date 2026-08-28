class DemandCampaign {
  final String id;
  final String societyId;
  final String societyName;
  final String serviceId;
  final String serviceName;
  final DateTime serviceDate;
  final String timeWindow;
  final int totalAggregatedQty;
  final int currentTierLevel;
  final double currentUnitPrice;
  final int nextTierTargetQty;
  final double nextTierUnitPrice;
  final String status; // AGGREGATING, CLOSED, ASSIGNED, COMPLETED

  DemandCampaign({
    required this.id,
    required this.societyId,
    required this.societyName,
    required this.serviceId,
    required this.serviceName,
    required this.serviceDate,
    required this.timeWindow,
    required this.totalAggregatedQty,
    required this.currentTierLevel,
    required this.currentUnitPrice,
    required this.nextTierTargetQty,
    required this.nextTierUnitPrice,
    required this.status,
  });

  double get progressToNextTier {
    if (nextTierTargetQty == 0) return 1.0;
    return (totalAggregatedQty / nextTierTargetQty).clamp(0.0, 1.0);
  }

  int get qtyNeededForNextTier {
    int remaining = nextTierTargetQty - totalAggregatedQty;
    return remaining > 0 ? remaining : 0;
  }
}
