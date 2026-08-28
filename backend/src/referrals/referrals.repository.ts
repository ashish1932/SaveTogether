import { ReferralStatus } from './responses/referral-response.dto';

export interface LocalReferralRecord {
  id: string;
  referralCode: string;
  referrerId: string;
  referredUserId: string;
  referredUserName: string;
  status: ReferralStatus;
  rewardAmount: number;
  qualifiedAt: string | null;
  rewardedAt: string | null;
  createdAt: string;
}

export interface LocalRewardTransactionRecord {
  id: string;
  userId: string;
  type: string;
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'REVERSED';
  referenceId: string;
  description: string;
  createdAt: string;
}

const mockReferralsStore: LocalReferralRecord[] = [
  {
    id: 'REF1001',
    referralCode: 'ASHISH50',
    referrerId: 'usr_1',
    referredUserId: 'usr_2',
    referredUserName: 'Rahul Kumar',
    status: 'QUALIFIED',
    rewardAmount: 50,
    qualifiedAt: '2026-08-27T10:00:00Z',
    rewardedAt: '2026-08-27T10:00:00Z',
    createdAt: '2026-08-27',
  },
];
const mockRewardTransactionsStore: LocalRewardTransactionRecord[] = [
  {
    id: 'rw_1001',
    userId: 'usr_1',
    type: 'REFERRAL_REWARD',
    amount: 50,
    status: 'COMPLETED',
    referenceId: 'REFERRAL_REWARD:REF1001',
    description: 'Referral bonus for qualifying resident completion (Ref: REF1001)',
    createdAt: '2026-08-27T10:00:00Z',
  },
];

export class ReferralsRepository {
  public static async createReferral(data: {
    referralCode: string;
    referrerId: string;
    referredUserId: string;
    referredUserName?: string;
  }): Promise<LocalReferralRecord> {
    const id = `ref_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const ref: LocalReferralRecord = {
      id,
      referralCode: data.referralCode,
      referrerId: data.referrerId,
      referredUserId: data.referredUserId,
      referredUserName: data.referredUserName || 'Referred Resident',
      status: 'REGISTERED',
      rewardAmount: 50,
      qualifiedAt: null,
      rewardedAt: null,
      createdAt: new Date().toISOString(),
    };

    mockReferralsStore.push(ref);
    return ref;
  }

  public static async findByReferredUserId(referredUserId: string): Promise<LocalReferralRecord | undefined> {
    return mockReferralsStore.find((r) => r.referredUserId === referredUserId);
  }

  public static async findManyByReferrerId(referrerId: string): Promise<LocalReferralRecord[]> {
    return mockReferralsStore.filter((r) => r.referrerId === referrerId);
  }

  public static async findAll(): Promise<LocalReferralRecord[]> {
    return mockReferralsStore;
  }

  public static async findById(id: string): Promise<LocalReferralRecord | undefined> {
    return mockReferralsStore.find((r) => r.id === id);
  }

  public static async updateStatus(id: string, status: ReferralStatus, qualifiedAt?: string): Promise<LocalReferralRecord | undefined> {
    const ref = await this.findById(id);
    if (!ref) return undefined;

    ref.status = status;
    if (status === 'QUALIFIED' || status === 'REWARDED') {
      ref.qualifiedAt = qualifiedAt || new Date().toISOString();
      ref.rewardedAt = new Date().toISOString();
    }
    return ref;
  }

  /**
   * Exactly-Once Reward Transaction (Step 26.18 & 26.19)
   */
  public static async createRewardTransaction(data: {
    userId: string;
    amount: number;
    referenceId: string;
    description: string;
  }): Promise<LocalRewardTransactionRecord> {
    // Idempotency check: Ensure referenceId (e.g. REFERRAL_REWARD:ref_123) is processed exactly once!
    const existing = mockRewardTransactionsStore.find((tx) => tx.referenceId === data.referenceId);
    if (existing) {
      return existing;
    }

    const tx: LocalRewardTransactionRecord = {
      id: `rw_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      userId: data.userId,
      type: 'REFERRAL_REWARD',
      amount: data.amount,
      status: 'COMPLETED',
      referenceId: data.referenceId,
      description: data.description,
      createdAt: new Date().toISOString(),
    };

    mockRewardTransactionsStore.push(tx);
    return tx;
  }

  public static async getRewardTransactionsByUser(userId: string): Promise<LocalRewardTransactionRecord[]> {
    return mockRewardTransactionsStore.filter((tx) => tx.userId === userId);
  }
}
