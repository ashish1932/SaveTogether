class Booking {
  final String id;
  final String serviceId;
  final String serviceName;
  final int quantity;
  final String unitLabel;
  final String societyName;
  final String address;
  final DateTime serviceDate;
  final String timeWindow;
  final double estimatedUnitPrice;
  final double totalPrice;
  final String status; // BOOKED, AGGREGATING, VENDOR_ASSIGNED, SCHEDULED, IN_PROGRESS, COMPLETED
  final String? vendorName;
  final DateTime createdAt;

  Booking({
    required this.id,
    required this.serviceId,
    required this.serviceName,
    required this.quantity,
    required this.unitLabel,
    required this.societyName,
    required this.address,
    required this.serviceDate,
    required this.timeWindow,
    required this.estimatedUnitPrice,
    required this.totalPrice,
    required this.status,
    this.vendorName,
    required this.createdAt,
  });

  String get bookingId => id;
  double get totalAmount => totalPrice;
}
