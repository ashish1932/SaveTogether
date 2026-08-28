class Society {
  final String id;
  final String name;
  final String address;
  final String city;
  final String postalCode;
  final int totalFlats;
  final int activeUsersCount;

  Society({
    required this.id,
    required this.name,
    required this.address,
    required this.city,
    required this.postalCode,
    required this.totalFlats,
    required this.activeUsersCount,
  });

  factory Society.fromJson(Map<String, dynamic> json) {
    return Society(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      address: json['address'] ?? '',
      city: json['city'] ?? '',
      postalCode: json['postalCode'] ?? '',
      totalFlats: json['totalFlats'] ?? 0,
      activeUsersCount: json['activeUsersCount'] ?? 0,
    );
  }
}
