import 'package:flutter/material.dart';
import '../models/service.dart';
import '../models/pricing_tier.dart';
import '../models/demand_campaign.dart';

class ServiceProvider extends ChangeNotifier {
  List<Service> _services = [];
  List<DemandCampaign> _activeCampaigns = [];
  bool _isLoading = false;

  List<Service> get services => _services;
  List<DemandCampaign> get activeCampaigns => _activeCampaigns;
  bool get isLoading => _isLoading;

  ServiceProvider() {
    _loadInitialData();
  }

  void _loadInitialData() {
    _services = [
      Service(
        id: 'srv_ac',
        categoryId: 'cat_cooling',
        name: 'AC Servicing & Deep Jet Wash',
        description: 'High-pressure water jet cleaning, gas check, filter wash, and anti-bacterial foam spray.',
        unitLabel: 'AC Unit',
        basePrice: 799.0,
        iconName: 'ac_unit',
        pricingTiers: [
          PricingTier(tierLevel: 1, minQty: 1, maxQty: 9, unitPrice: 799.0),
          PricingTier(tierLevel: 2, minQty: 10, maxQty: 19, unitPrice: 699.0),
          PricingTier(tierLevel: 3, minQty: 20, maxQty: 39, unitPrice: 599.0),
          PricingTier(tierLevel: 4, minQty: 40, maxQty: 59, unitPrice: 549.0),
          PricingTier(tierLevel: 5, minQty: 60, maxQty: 999, unitPrice: 499.0),
        ],
        included: [
          'High-pressure jet wash of indoor coil & outdoor unit',
          'Gas leak check & operating pressure test',
          'Drain pipe clearing & anti-bacterial spray',
          '30-day post-service warranty',
        ],
        excluded: [
          'Gas charging / refilling (charged separately at standard rate)',
          'Spare parts replacement',
        ],
      ),
      Service(
        id: 'srv_clean',
        categoryId: 'cat_cleaning',
        name: 'Full Apartment Deep Cleaning',
        description: 'Complete home sanitization, kitchen degreasing, bathroom scrubbing, and floor buffing.',
        unitLabel: 'Home',
        basePrice: 3499.0,
        iconName: 'cleaning_services',
        pricingTiers: [
          PricingTier(tierLevel: 1, minQty: 1, maxQty: 4, unitPrice: 3499.0),
          PricingTier(tierLevel: 2, minQty: 5, maxQty: 14, unitPrice: 2999.0),
          PricingTier(tierLevel: 3, minQty: 15, maxQty: 29, unitPrice: 2499.0),
          PricingTier(tierLevel: 4, minQty: 30, maxQty: 999, unitPrice: 2199.0),
        ],
        included: [
          'Kitchen cabinet cleaning, degreasing & stove wash',
          'Bathroom deep scrubbing & tile stain removal',
          'Balcony washing & window glass cleaning',
          'Vacuuming of sofas & mattresses',
        ],
        excluded: ['Wall painting touchups', 'Heavy junk removal'],
      ),
      Service(
        id: 'srv_pest',
        categoryId: 'cat_pest',
        name: 'Herbal Pest Control Service',
        description: 'Odorless cockroach gel treatment + ant & pest spray for all rooms.',
        unitLabel: 'Home',
        basePrice: 1199.0,
        iconName: 'bug_report',
        pricingTiers: [
          PricingTier(tierLevel: 1, minQty: 1, maxQty: 9, unitPrice: 1199.0),
          PricingTier(tierLevel: 2, minQty: 10, maxQty: 24, unitPrice: 899.0),
          PricingTier(tierLevel: 3, minQty: 25, maxQty: 999, unitPrice: 699.0),
        ],
        included: [
          'Odorless gel application in kitchen cabinets',
          'Drainage & corner spray treatment',
          'Safe for kids & pets',
        ],
        excluded: ['Bed bug heat treatment (specialist package required)'],
      ),
      Service(
        id: 'srv_car',
        categoryId: 'cat_auto',
        name: 'Waterless Eco Car Foam Wash',
        description: 'Exterior foam wash, tire dressing, interior vacuuming & dashboard polish.',
        unitLabel: 'Car',
        basePrice: 499.0,
        iconName: 'directions_car',
        pricingTiers: [
          PricingTier(tierLevel: 1, minQty: 1, maxQty: 14, unitPrice: 499.0),
          PricingTier(tierLevel: 2, minQty: 15, maxQty: 29, unitPrice: 399.0),
          PricingTier(tierLevel: 3, minQty: 30, maxQty: 999, unitPrice: 299.0),
        ],
        included: [
          'High-shine exterior foam wash & microfiber dry',
          'Interior vacuuming & dashboard polish',
          'Tire degreasing & rim shine',
        ],
        excluded: ['Upholstery deep shampooing'],
      ),
    ];

    _activeCampaigns = [
      DemandCampaign(
        id: 'cmp_ac_01',
        societyId: 'soc_1',
        societyName: 'ABC Residency',
        serviceId: 'srv_ac',
        serviceName: 'AC Servicing & Deep Jet Wash',
        serviceDate: DateTime.now().add(const Duration(days: 2)),
        timeWindow: '10:00 AM - 01:00 PM',
        totalAggregatedQty: 16,
        currentTierLevel: 2,
        currentUnitPrice: 699.0,
        nextTierTargetQty: 20,
        nextTierUnitPrice: 599.0,
        status: 'AGGREGATING',
      ),
      DemandCampaign(
        id: 'cmp_clean_01',
        societyId: 'soc_1',
        societyName: 'ABC Residency',
        serviceId: 'srv_clean',
        serviceName: 'Full Apartment Deep Cleaning',
        serviceDate: DateTime.now().add(const Duration(days: 3)),
        timeWindow: '09:00 AM - 12:00 PM',
        totalAggregatedQty: 12,
        currentTierLevel: 2,
        currentUnitPrice: 2999.0,
        nextTierTargetQty: 15,
        nextTierUnitPrice: 2499.0,
        status: 'AGGREGATING',
      ),
    ];
  }
}
