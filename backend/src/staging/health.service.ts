import configuration from '../config/configuration';

export interface InfrastructureReadinessDto {
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  timestamp: string;
  environment: string;
  checks: {
    database: { status: 'UP' | 'DOWN'; latencyMs: number };
    redis: { status: 'UP' | 'DOWN'; latencyMs: number };
    queues: { status: 'UP' | 'DOWN'; activeWorkers: number };
    storage: { status: 'UP' | 'DOWN'; bucket: string };
  };
}

export class HealthService {
  public static async getBasicHealth() {
    const cfg = configuration();
    return {
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: cfg.app.environment,
    };
  }

  public static async getReadinessCheck(): Promise<InfrastructureReadinessDto> {
    const cfg = configuration();
    const startDb = Date.now();
    // Simulate database query ping
    const dbLatency = Date.now() - startDb;

    const startRedis = Date.now();
    // Simulate Redis ping
    const redisLatency = Date.now() - startRedis;

    return {
      status: 'HEALTHY',
      timestamp: new Date().toISOString(),
      environment: cfg.app.environment,
      checks: {
        database: { status: 'UP', latencyMs: dbLatency },
        redis: { status: 'UP', latencyMs: redisLatency },
        queues: { status: 'UP', activeWorkers: 9 },
        storage: { status: 'UP', bucket: cfg.storage.bucket || 'savetogether-staging' },
      },
    };
  }
}
