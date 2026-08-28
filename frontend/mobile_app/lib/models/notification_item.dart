class NotificationItem {
  final String id;
  final String type; // DEMAND, PRICE_DROP, SERVICE_SCHEDULED, VENDOR_ASSIGNED, PAYMENT, REFUND, REFERRAL
  final String title;
  final String message;
  final String timeAgo;
  final bool isRead;
  final String dateGroup; // TODAY, YESTERDAY, THIS WEEK
  final String? relatedBookingId;

  NotificationItem({
    required this.id,
    required this.type,
    required this.title,
    required this.message,
    required this.timeAgo,
    this.isRead = false,
    required this.dateGroup,
    this.relatedBookingId,
  });

  NotificationItem copyWith({bool? isRead}) {
    return NotificationItem(
      id: id,
      type: type,
      title: title,
      message: message,
      timeAgo: timeAgo,
      isRead: isRead ?? this.isRead,
      dateGroup: dateGroup,
      relatedBookingId: relatedBookingId,
    );
  }
}
