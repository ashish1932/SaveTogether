export type QueueName =
  | 'otp'
  | 'notifications'
  | 'campaigns'
  | 'bookings'
  | 'referrals'
  | 'rewards'
  | 'refunds'
  | 'analytics'
  | 'outbox';

export type JobName =
  | 'otp.cleanup'
  | 'notification.send'
  | 'notification.scheduled'
  | 'campaign.expire'
  | 'booking.expire'
  | 'referral.qualify'
  | 'reward.process'
  | 'refund.reconcile'
  | 'analytics.aggregate'
  | 'outbox.publish';

export type JobStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'RETRYING';

export interface BackgroundJobRecord {
  id: string;
  jobId: string;
  queue: QueueName;
  name: JobName;
  payload: Record<string, any>;
  status: JobStatus;
  attempts: number;
  maxAttempts: number;
  error?: string | null;
  processedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
}

export interface QueueMetricsResponseDto {
  queue: QueueName;
  queuedCount: number;
  processingCount: number;
  completedCount: number;
  failedCount: number;
}
