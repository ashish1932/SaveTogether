import { QueueName, JobName, JobStatus, BackgroundJobRecord, QueueMetricsResponseDto } from './job.types';

const mockJobsStore: BackgroundJobRecord[] = [
  {
    id: 'job_1001',
    jobId: 'JOB-OTP-001',
    queue: 'otp',
    name: 'otp.cleanup',
    payload: { batchSize: 50 },
    status: 'COMPLETED',
    attempts: 1,
    maxAttempts: 3,
    processedAt: '2026-08-27T10:00:00Z',
    completedAt: '2026-08-27T10:00:01Z',
    createdAt: '2026-08-27T10:00:00Z',
  },
  {
    id: 'job_1002',
    jobId: 'JOB-NTF-002',
    queue: 'notifications',
    name: 'notification.send',
    payload: { notificationId: 'nt_1001' },
    status: 'COMPLETED',
    attempts: 1,
    maxAttempts: 3,
    processedAt: '2026-08-27T10:15:00Z',
    completedAt: '2026-08-27T10:15:02Z',
    createdAt: '2026-08-27T10:15:00Z',
  },
];

export class JobsRepository {
  public static async enqueueJob(data: {
    queue: QueueName;
    name: JobName;
    payload: Record<string, any>;
    maxAttempts?: number;
  }): Promise<BackgroundJobRecord> {
    const id = `job_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const jobId = `JOB-${data.queue.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const record: BackgroundJobRecord = {
      id,
      jobId,
      queue: data.queue,
      name: data.name,
      payload: data.payload,
      status: 'QUEUED',
      attempts: 0,
      maxAttempts: data.maxAttempts || 3,
      createdAt: new Date().toISOString(),
    };

    mockJobsStore.push(record);
    return record;
  }

  public static async updateJobStatus(
    id: string,
    status: JobStatus,
    error?: string,
  ): Promise<BackgroundJobRecord | undefined> {
    const job = mockJobsStore.find((j) => j.id === id || j.jobId === id);
    if (!job) return undefined;

    job.status = status;
    job.attempts += 1;
    if (error) job.error = error;
    if (status === 'PROCESSING') job.processedAt = new Date().toISOString();
    if (status === 'COMPLETED' || status === 'FAILED') job.completedAt = new Date().toISOString();

    return job;
  }

  public static async findAll(): Promise<BackgroundJobRecord[]> {
    return mockJobsStore;
  }

  public static async findById(id: string): Promise<BackgroundJobRecord | undefined> {
    return mockJobsStore.find((j) => j.id === id || j.jobId === id);
  }

  public static async getQueueMetrics(): Promise<QueueMetricsResponseDto[]> {
    const queues: QueueName[] = ['otp', 'notifications', 'campaigns', 'bookings', 'referrals', 'rewards', 'refunds', 'analytics', 'outbox'];

    return queues.map((q) => {
      const qJobs = mockJobsStore.filter((j) => j.queue === q);
      return {
        queue: q,
        queuedCount: qJobs.filter((j) => j.status === 'QUEUED').length,
        processingCount: qJobs.filter((j) => j.status === 'PROCESSING').length,
        completedCount: qJobs.filter((j) => j.status === 'COMPLETED').length,
        failedCount: qJobs.filter((j) => j.status === 'FAILED').length,
      };
    });
  }
}
