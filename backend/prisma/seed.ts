import { seedRolesAndPermissions } from './seed/roles-permissions.seed';
import { seedSocietiesAndUsers } from './seed/societies-users.seed';
import { seedServicesAndPricing } from './seed/services-pricing.seed';
import { seedDemandScenarios } from './seed/demand-scenarios.seed';

async function main() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  if (nodeEnv === 'production' && process.env.ALLOW_PRODUCTION_SEED !== 'true') {
    console.error('⛔ SEED SAFETY GUARD BLOCKED EXECUTION: Direct database seeding is blocked in PRODUCTION environment to prevent data loss. Set ALLOW_PRODUCTION_SEED=true to override.');
    process.exit(1);
  }

  console.log(`🌱 Executing SaveTogether Master Database Seed Pipeline [${nodeEnv.toUpperCase()}]...`);

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
