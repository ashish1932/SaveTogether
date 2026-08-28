import { RewardTransactionType, RewardTransactionStatus } from './responses/reward-response.dto';

export interface LocalRewardTransactionRecord {
  id: string;
  transactionNumber: string;
  userId: string;
  type: RewardTransactionType;
  status: RewardTransactionStatus;
  amount: number; // Signed: + positive, - negative
  referenceId: string | null;
  description: string;
  createdBy?: string;
  createdAt: string;
}

const mockTransactionsStore: LocalRewardTransactionRecord[] = [
  {
    id: 'rt_1001',
    transactionNumber: 'RT-000101',
    userId: 'usr_1',
    type: 'REFERRAL_REWARD',
    status: 'COMPLETED',
    amount: 50,
    referenceId: 'REFERRAL_REWARD:REF1001',
    description: 'Referral bonus for qualifying resident completion (Ref: REF1001)',
    createdAt: '2026-08-27T10:00:00Z',
  },
  {
    id: 'rt_1002',
    transactionNumber: 'RT-000102',
    userId: 'usr_2',
    type: 'REFERRAL_REWARD',
    status: 'COMPLETED',
    amount: 100,
    referenceId: 'REFERRAL_REWARD:REF1002',
    description: 'Welcome referral reward',
    createdAt: '2026-08-27T11:00:00Z',
  },
];

export class RewardsRepository {
  public static async createTransaction(data: {
    userId: string;
    type: RewardTransactionType;
    status?: RewardTransactionStatus;
    amount: number; // Signed amount
    referenceId?: string | null;
    description: string;
    createdBy?: string;
  }): Promise<LocalRewardTransactionRecord> {
    const id = `rt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const transactionNumber = `RT-${Math.floor(100000 + Math.random() * 900000)}`;

    const tx: LocalRewardTransactionRecord = {
      id,
      transactionNumber,
      userId: data.userId,
      type: data.type,
      status: data.status || 'COMPLETED',
      amount: Math.round(data.amount * 100) / 100,
      referenceId: data.referenceId || null,
      description: data.description,
      createdBy: data.createdBy,
      createdAt: new Date().toISOString(),
    };

    mockTransactionsStore.push(tx);
    return tx;
  }

  public static async findById(id: string): Promise<LocalRewardTransactionRecord | undefined> {
    return mockTransactionsStore.find((t) => t.id === id || t.transactionNumber === id);
  }

  public static async findByUserId(userId: string): Promise<LocalRewardTransactionRecord[]> {
    return mockTransactionsStore.filter((t) => t.userId === userId);
  }

  public static async findAll(): Promise<LocalRewardTransactionRecord[]> {
    return mockTransactionsStore;
  }

  /**
   * Pure derivation of Available Balance (Step 27.7): SUM(amount) for COMPLETED transactions
   */
  public static async calculateAvailableBalance(userId: string): Promise<number> {
    const userTxs = mockTransactionsStore.filter((t) => t.userId === userId && t.status === 'COMPLETED');
    const total = userTxs.reduce((sum, tx) => sum + tx.amount, 0);
    return Math.max(0, Math.round(total * 100) / 100);
  }
}
