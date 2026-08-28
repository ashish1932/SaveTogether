export interface AppConfig {
  name: string;
  environment: string;
  port: number;
  apiPrefix: string;
}

export interface DatabaseConfig {
  url: string;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

export interface RedisConfig {
  url: string;
}

export interface StorageConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
}

export interface FirebaseConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

export interface OtpConfig {
  provider: string;
  apiUrl: string;
  apiKey: string;
  senderId: string;
}

export interface PaymentConfig {
  provider: string;
  keyId: string;
  keySecret: string;
  webhookSecret: string;
}

export interface SecurityConfig {
  corsOrigins: string[];
  logLevel: string;
}

export interface SaveTogetherConfiguration {
  app: AppConfig;
  database: DatabaseConfig;
  jwt: JwtConfig;
  redis: RedisConfig;
  storage: StorageConfig;
  firebase: FirebaseConfig;
  otp: OtpConfig;
  payment: PaymentConfig;
  security: SecurityConfig;
}

export default (): SaveTogetherConfiguration => ({
  app: {
    name: process.env.APP_NAME || 'SaveTogether',
    environment: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 5000,
    apiPrefix: process.env.API_PREFIX || 'api/v1',
  },

  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/savetogether_db?schema=public',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'savetogether_jwt_super_secret_key_2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'savetogether_jwt_refresh_secret_key_2026',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  storage: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || 'ap-south-1',
    bucket: process.env.AWS_S3_BUCKET || 'savetogether-media-storage-dev',
  },

  firebase: {
    projectId: process.env.FCM_PROJECT_ID || '',
    clientEmail: process.env.FCM_CLIENT_EMAIL || '',
    privateKey: process.env.FCM_PRIVATE_KEY || '',
  },

  otp: {
    provider: process.env.OTP_PROVIDER || 'MSG91',
    apiUrl: process.env.OTP_API_URL || 'https://api.msg91.com/api/v5/otp',
    apiKey: process.env.OTP_API_KEY || '',
    senderId: process.env.OTP_SENDER_ID || 'SAVETG',
  },

  payment: {
    provider: process.env.PAYMENT_PROVIDER || 'RAZORPAY',
    keyId: process.env.PAYMENT_KEY_ID || 'rzp_test_mockkeyid',
    keySecret: process.env.PAYMENT_KEY_SECRET || 'mock_razorpay_secret',
    webhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || 'mock_webhook_secret',
  },

  security: {
    corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:8080,http://localhost:8081').split(','),
    logLevel: process.env.LOG_LEVEL || 'debug',
  },
});
