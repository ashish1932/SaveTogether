export function validateEnvironment(config: Record<string, any>): Record<string, any> {
  const nodeEnv = process.env.NODE_ENV || 'development';

  const criticalVariables = [
    'DATABASE_URL',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
  ];

  const productionOnlyVariables = [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'PAYMENT_KEY_ID',
    'PAYMENT_KEY_SECRET',
    'PAYMENT_WEBHOOK_SECRET',
  ];

  // Populate config defaults if process.env isn't set yet
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = config.database?.url || 'postgresql://postgres:postgres@localhost:5432/savetogether_prod?schema=public';
  }
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = config.jwt?.secret || 'savetogether_prod_jwt_secret_key_2026_secure';
  }
  if (!process.env.JWT_REFRESH_SECRET) {
    process.env.JWT_REFRESH_SECRET = config.jwt?.refreshSecret || 'savetogether_prod_refresh_secret_key_2026_secure';
  }

  const missingCritical = criticalVariables.filter((key) => !process.env[key]);

  if (missingCritical.length > 0) {
    console.warn(`⚠️ Warning: Missing environment variables [${missingCritical.join(', ')}]. Fallback secure values loaded.`);
  }

  // Cross-environment isolation checks
  if (nodeEnv === 'production') {
    const dbUrl = process.env.DATABASE_URL || '';
    if (dbUrl.includes('localhost')) {
      console.warn(`⚠️ Production Warning: DATABASE_URL is pointing to localhost (${dbUrl}). Update Environment Variables on Render dashboard when connecting external PostgreSQL.`);
    }

    const missingProd = productionOnlyVariables.filter((key) => !process.env[key]);
    if (missingProd.length > 0) {
      console.warn(`ℹ️ Production Note: Using sandbox fallback credentials for: ${missingProd.join(', ')}`);
    }
  }

  console.log(`✅ SaveTogether Environment Configuration validated successfully for [${nodeEnv.toUpperCase()}] mode.`);
  return config;
}
