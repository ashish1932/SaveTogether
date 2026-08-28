class ReferralItem {
  final String id;
  final String friendName;
  final String friendPhone;
  final String status; // INVITED, REGISTERED, BOOKING_PENDING, COMPLETED, EARNED, NOT_ELIGIBLE
  final String dateText;
  final double rewardAmount;
  final String? qualifyingService;
  final String? bookingId;

  ReferralItem({
    required this.id,
    required this.friendName,
    required this.friendPhone,
    required this.status,
    required this.dateText,
    required this.rewardAmount,
    this.qualifyingService,
    this.bookingId,
  });
}

class RewardTransactionItem {
  final String id;
  final String title;
  final String subtitle;
  final double amount;
  final bool isCredit; // true for earned, false for spent
  final String dateText;
  final String status; // COMPLETED, PENDING, EXPIRED, USED

  RewardTransactionItem({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.amount,
    required this.isCredit,
    required this.dateText,
    required this.status,
  });
}
