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
    if (nodeEnv === 'production') {
      throw new Error(`❌ Production startup failed! Missing critical environment variables: ${missingCritical.join(', ')}`);
    } else {
      console.warn(`⚠️ Development Warning: Missing variables [${missingCritical.join(', ')}]. Fallback local values loaded.`);
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
