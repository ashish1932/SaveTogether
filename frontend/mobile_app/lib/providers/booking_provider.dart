import 'package:flutter/material.dart';
import '../models/service.dart';
import '../models/pricing_tier.dart';
import '../models/booking.dart';

class BookingProvider extends ChangeNotifier {
  Service? _selectedService;
  int _selectedQuantity = 1;
  DateTime _selectedDate = DateTime.now().add(const Duration(days: 2));
  String _selectedTimeWindow = '10:00 AM - 01:00 PM';
  String _address = 'Tower B - Flat 402, ABC Residency';
  
  final List<Booking> _myBookings = [];

  Service? get selectedService => _selectedService;
  int get selectedQuantity => _selectedQuantity;
  DateTime get selectedDate => _selectedDate;
  String get selectedTimeWindow => _selectedTimeWindow;
  String get address => _address;
  List<Booking> get myBookings => List.unmodifiable(_myBookings);
  List<Booking> get userBookings => List.unmodifiable(_myBookings);

  BookingProvider() {
    // Initial mock booking for history demonstration
    _myBookings.add(
      Booking(
        id: 'BK-89012',
        serviceId: 'srv_ac',
        serviceName: 'AC Servicing & Deep Jet Wash',
        quantity: 2,
        unitLabel: 'AC Unit',
        societyName: 'ABC Residency',
        address: 'Tower B - Flat 402, ABC Residency',
        serviceDate: DateTime.now().add(const Duration(days: 2)),
        timeWindow: '10:00 AM - 01:00 PM',
        estimatedUnitPrice: 599.0,
        totalPrice: 1198.0,
        status: 'AGGREGATING',
        createdAt: DateTime.now().subtract(const Duration(hours: 4)),
      ),
    );
  }

  void startBooking(Service service) {
    _selectedService = service;
    _selectedQuantity = 1;
    notifyListeners();
  }

  void updateQuantity(int qty) {
    if (qty >= 1 && qty <= 20) {
      _selectedQuantity = qty;
      notifyListeners();
    }
  }

  void setDateTime(DateTime date, String timeWindow) {
    _selectedDate = date;
    _selectedTimeWindow = timeWindow;
    notifyListeners();
  }

  void setAddress(String newAddress) {
    _address = newAddress;
    notifyListeners();
  }

  PricingTier? get currentTier {
    if (_selectedService == null) return null;
    return _selectedService!.getTierForQuantity(_selectedQuantity);
  }

  double get currentUnitPrice {
    return currentTier?.unitPrice ?? _selectedService?.basePrice ?? 0.0;
  }

  double get totalPrice {
    return currentUnitPrice * _selectedQuantity;
  }

  Booking createBooking() {
    final booking = Booking(
      id: 'BK-${(10000 + _myBookings.length * 7 + 103)}',
      serviceId: _selectedService?.id ?? '',
      serviceName: _selectedService?.name ?? '',
      quantity: _selectedQuantity,
      unitLabel: _selectedService?.unitLabel ?? 'Unit',
      societyName: 'ABC Residency',
      address: _address,
      serviceDate: _selectedDate,
      timeWindow: _selectedTimeWindow,
      estimatedUnitPrice: currentUnitPrice,
      totalPrice: totalPrice,
      status: 'BOOKED',
      createdAt: DateTime.now(),
    );

    _myBookings.insert(0, booking);
    notifyListeners();
    return booking;
  }
}
