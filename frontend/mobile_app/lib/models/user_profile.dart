import 'society.dart';

class UserProfile {
  final String id;
  final String name;
  final String phone;
  final String email;
  final Society? selectedSociety;
  final String flatNo;
  final String referralCode;
  final double walletBalance;
  final int totalReferralsCount;

  UserProfile({
    required this.id,
    required this.name,
    required this.phone,
    required this.email,
    this.selectedSociety,
    required this.flatNo,
    required this.referralCode,
    required this.walletBalance,
    required this.totalReferralsCount,
  });

  UserProfile copyWith({
    String? id,
    String? name,
    String? phone,
    String? email,
    Society? selectedSociety,
    String? flatNo,
    String? referralCode,
    double? walletBalance,
    int? totalReferralsCount,
  }) {
    return UserProfile(
      id: id ?? this.id,
      name: name ?? this.name,
      phone: phone ?? this.phone,
      email: email ?? this.email,
      selectedSociety: selectedSociety ?? this.selectedSociety,
      flatNo: flatNo ?? this.flatNo,
      referralCode: referralCode ?? this.referralCode,
      walletBalance: walletBalance ?? this.walletBalance,
      totalReferralsCount: totalReferralsCount ?? this.totalReferralsCount,
    );
  }
}
