export const seedServicesAndPricing = async (prisma: any) => {
  console.log('  └─ Seeding Service Categories, Services & Bulk Pricing Tiers...');

  const categories = [
    { id: 'cat_ac', name: 'AC Services', desc: 'Air conditioner maintenance & jet wash', icon: 'ac_unit', sort: 1 },
    { id: 'cat_cleaning', name: 'Home Deep Cleaning', desc: 'Sanitization & scrub services', icon: 'cleaning_services', sort: 2 },
    { id: 'cat_pest', name: 'Pest Control', desc: 'Insect & cockroach extermination', icon: 'bug_report', sort: 3 },
    { id: 'cat_car', name: 'Car Wash', desc: 'Exterior foam wash & interior vacuuming', icon: 'directions_car', sort: 4 },
    { id: 'cat_ro', name: 'RO Purifier', desc: 'Filter replacement & calibration', icon: 'water_drop', sort: 5 },
  ];

  for (const c of categories) {
    if (prisma.serviceCategory?.upsert) {
      await prisma.serviceCategory.upsert({
        where: { id: c.id },
        update: {},
        create: {
          id: c.id,
          name: c.name,
          description: c.desc,
          iconName: c.icon,
          sortOrder: c.sort,
          isActive: true,
        },
      });
    }
  }

  const services = [
    { id: 'srv_ac_gen', catId: 'cat_ac', name: 'AC General Service', desc: 'Complete AC general servicing & filter wash', unit: 'AC Unit', price: 799.0 },
    { id: 'srv_ac_deep', catId: 'cat_ac', name: 'AC Deep Foam Wash', desc: 'Chemical jet wash for heavy indoor units', unit: 'AC Unit', price: 1299.0 },
    { id: 'srv_clean', catId: 'cat_cleaning', name: 'Full Home Deep Cleaning', desc: 'Complete 3BHK deep sanitization', unit: 'Flat/Home', price: 999.0 },
    { id: 'srv_car', catId: 'cat_car', name: 'Car Wash & Polish', desc: 'Exterior foam & interior vacuum', unit: 'Car', price: 599.0 },
  ];

  for (const s of services) {
    if (prisma.service?.upsert) {
      await prisma.service.upsert({
        where: { id: s.id },
        update: {},
        create: {
          id: s.id,
          categoryId: s.catId,
          name: s.name,
          description: s.desc,
          unitLabel: s.unit,
          baseCatalogPrice: s.price,
          iconName: 'build',
          isActive: true,
        },
      });
    }
  }

  // 1–9 ₹799, 10–19 ₹699, 20–39 ₹599, 40–59 ₹549, 60+ ₹499
  const acTiers = [
    { id: 'tier_ac_1', minQty: 1, maxQty: 9, price: 799.0, label: '1–9 Units (Catalog Price)' },
    { id: 'tier_ac_2', minQty: 10, maxQty: 19, price: 699.0, label: '10–19 Units (Society Tier 1)' },
    { id: 'tier_ac_3', minQty: 20, maxQty: 39, price: 599.0, label: '20–39 Units (Society Tier 2)' },
    { id: 'tier_ac_4', minQty: 40, maxQty: 59, price: 549.0, label: '40–59 Units (Society Tier 3)' },
    { id: 'tier_ac_5', minQty: 60, maxQty: null, price: 499.0, label: '60+ Units (Maximum Bulk Tier)' },
  ];

  for (const t of acTiers) {
    if (prisma.pricingTier?.upsert) {
      await prisma.pricingTier.upsert({
        where: { id: t.id },
        update: {},
        create: {
          id: t.id,
          serviceId: 'srv_ac_gen',
          minimumQuantity: t.minQty,
          maximumQuantity: t.maxQty,
          price: t.price,
          tierLabel: t.label,
          status: 'ACTIVE',
        },
      });
    }
  }
};
