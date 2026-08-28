class Address {
  final String id;
  final String label; // 'Home' or 'Other'
  final String flatNo;
  final String buildingBlock;
  final String streetArea;
  final String city;
  final String postalCode;
  final String? landmark;
  final bool isDefault;

  Address({
    required this.id,
    this.label = 'Home',
    required this.flatNo,
    required this.buildingBlock,
    required this.streetArea,
    required this.city,
    required this.postalCode,
    this.landmark,
    this.isDefault = false,
  });

  Address copyWith({
    String? id,
    String? label,
    String? flatNo,
    String? buildingBlock,
    String? streetArea,
    String? city,
    String? postalCode,
    String? landmark,
    bool? isDefault,
  }) {
    return Address(
      id: id ?? this.id,
      label: label ?? this.label,
      flatNo: flatNo ?? this.flatNo,
      buildingBlock: buildingBlock ?? this.buildingBlock,
      streetArea: streetArea ?? this.streetArea,
      city: city ?? this.city,
      postalCode: postalCode ?? this.postalCode,
      landmark: landmark ?? this.landmark,
      isDefault: isDefault ?? this.isDefault,
    );
  }

  String get fullAddressString => '$flatNo, $buildingBlock, $streetArea, $city - $postalCode';
}
