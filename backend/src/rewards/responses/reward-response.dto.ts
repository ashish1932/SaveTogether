export type RewardTransactionType =
  | 'REFERRAL_REWARD'
  | 'REDEMPTION'
  | 'REFUND'
  | 'ADMIN_CREDIT'
  | 'ADMIN_DEBIT'
  | 'ADJUSTMENT'
  | 'REVERSAL';

export type RewardTransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED' | 'CANCELLED';

export interface WalletSummaryResponseDto {
  availableBalance: number;
  pendingRewards: number;
  totalEarned: number;
  totalUsed: number;
}

export interface RewardTransactionItemDto {
  id: string;
  transactionNumber: string;
  userId: string;
  type: RewardTransactionType;
  status: RewardTransactionStatus;
  amount: number; // Signed: positive for credit, negative for debit
  referenceId: string | null;
  description: string;
  createdAt: string;
}
