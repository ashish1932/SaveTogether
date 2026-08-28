export function validateEnv(config: Record<string, any>) {
  const requiredEnvs = ['DATABASE_URL', 'JWT_SECRET'];
  for (const envVar of requiredEnvs) {
    if (!config[envVar] && !process.env[envVar]) {
      console.warn(`⚠️ Warning: Missing environment variable ${envVar}. Fallback default will be used for local dev.`);
    }
  }
  return config;
}
