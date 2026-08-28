class ServiceReview {
  final String id;
  final String bookingId;
  final double overallRating;
  final double serviceQuality;
  final double professionalism;
  final double valueForMoney;
  final String comment;
  final List<String> tags;
  final List<String> photos;
  final String dateText;

  ServiceReview({
    required this.id,
    required this.bookingId,
    required this.overallRating,
    required this.serviceQuality,
    required this.professionalism,
    required this.valueForMoney,
    required this.comment,
    required this.tags,
    required this.photos,
    required this.dateText,
  });
}
