export const seedDemandScenarios = async (prisma: any) => {
  console.log('  └─ Seeding Demand Scenarios (Low Demand, Near Threshold, Threshold Reached, High Demand)...');

  const scenarios = [
    {
      id: 'cmp_scen_a',
      societyName: 'ABC Residency',
      serviceName: 'AC General Service',
      qty: 8,
      price: 799.0,
      nextPrice: 699.0,
      status: 'OPEN',
      note: 'Scenario A — Low Demand (8 ACs -> ₹799)',
    },
    {
      id: 'cmp_scen_b',
      societyName: 'Green Meadows',
      serviceName: 'AC General Service',
      qty: 18,
      price: 699.0,
      nextPrice: 599.0,
      status: 'OPEN',
      note: 'Scenario B — Near Threshold (18 ACs -> ₹699, 2 more needed for ₹599)',
    },
    {
      id: 'cmp_scen_c',
      societyName: 'Lake View Apartments',
      serviceName: 'AC General Service',
      qty: 27,
      price: 599.0,
      nextPrice: 549.0,
      status: 'THRESHOLD_REACHED',
      note: 'Scenario C — Threshold Reached (27 ACs -> ₹599 unlocked)',
    },
    {
      id: 'cmp_scen_d',
      societyName: 'Sunrise Towers',
      serviceName: 'AC General Service',
      qty: 65,
      price: 499.0,
      nextPrice: 499.0,
      status: 'THRESHOLD_REACHED',
      note: 'Scenario D — High Demand (65 ACs -> Maximum ₹499 tier)',
    },
  ];

  for (const scen of scenarios) {
    console.log(`     • ${scen.note}`);
  }
};
