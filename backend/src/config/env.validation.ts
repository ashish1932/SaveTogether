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

  const missingCritical = criticalVariables.filter((key) => !process.env[key] && !config[key]);

  if (missingCritical.length > 0) {
    if (nodeEnv === 'production' || nodeEnv === 'staging') {
      throw new Error(`❌ Startup failed in [${nodeEnv.toUpperCase()}] mode! Missing critical environment variables: ${missingCritical.join(', ')}`);
    } else {
      console.warn(`⚠️ Development Warning: Missing variables [${missingCritical.join(', ')}]. Fallback local values loaded.`);
    }
  }

  // Cross-environment isolation checks
  if (nodeEnv === 'production' || nodeEnv === 'staging') {
    const dbUrl = process.env.DATABASE_URL || config.database?.url || '';
    if (dbUrl.includes('savetogether_db') || dbUrl.includes('localhost')) {
      if (nodeEnv === 'production') {
        throw new Error(`⛔ SAFETY GUARD FAILURE: Production cannot connect to local or dev database (${dbUrl})!`);
      } else if (nodeEnv === 'staging' && !dbUrl.includes('staging')) {
        console.warn(`⚠️ Staging Warning: DATABASE_URL should point to a dedicated staging database.`);
      }
    }

    const jwtSecret = process.env.JWT_SECRET || config.jwt?.secret;
    if (jwtSecret === 'savetogether_jwt_super_secret_key_2026') {
      throw new Error(`⛔ SAFETY GUARD FAILURE: Default development JWT secret cannot be used in [${nodeEnv.toUpperCase()}] environment!`);
    }
  }

  if (nodeEnv === 'production') {
    const missingProd = productionOnlyVariables.filter((key) => !process.env[key]);
    if (missingProd.length > 0) {
      throw new Error(`❌ Production startup failed! Missing required production secrets: ${missingProd.join(', ')}`);
    }
  }

  console.log(`✅ SaveTogether Environment Configuration validated successfully for [${nodeEnv.toUpperCase()}] mode.`);
  return config;
}
