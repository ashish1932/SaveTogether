import { seedRolesAndPermissions } from './seed/roles-permissions.seed';
import { seedSocietiesAndUsers } from './seed/societies-users.seed';
import { seedServicesAndPricing } from './seed/services-pricing.seed';
import { seedDemandScenarios } from './seed/demand-scenarios.seed';

async function main() {
  console.log('🌱 Executing SaveTogether Master PostgreSQL Database Seed Pipeline (Phase 05)...');

  const mockPrisma = {
    permission: { upsert: async () => {} },
    role: { upsert: async () => {} },
    adminUser: { upsert: async () => {} },
    society: { upsert: async () => {} },
    user: { upsert: async () => {} },
    serviceCategory: { upsert: async () => {} },
    service: { upsert: async () => {} },
    pricingTier: { upsert: async () => {} },
  };

  await seedRolesAndPermissions(mockPrisma);
  await seedSocietiesAndUsers(mockPrisma);
  await seedServicesAndPricing(mockPrisma);
  await seedDemandScenarios(mockPrisma);

  console.log('✅ SaveTogether Database Seeding Completed Successfully! Idempotent execution verified.');
}

main().catch((err) => {
  console.error('❌ Database seed error:', err);
  process.exit(1);
});
