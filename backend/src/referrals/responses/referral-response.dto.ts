export type ReferralStatus =
  | 'REGISTERED'
  | 'BOOKING_PENDING'
  | 'QUALIFIED'
  | 'REWARD_PENDING'
  | 'REWARDED'
  | 'DISQUALIFIED'
  | 'FRAUD_REVIEW'
  | 'CANCELLED';

export interface ReferralSummaryResponseDto {
  referralCode: string;
  rewardPerSuccessfulReferral: number;
  totalInvited: number;
  successfulReferrals: number;
  totalEarned: number;
}

export interface ReferralHistoryItemDto {
  id: string;
  referredUserName: string;
  status: ReferralStatus;
  rewardAmount: number;
  qualifiedAt: string | null;
  createdAt: string;
}

export interface RewardTransactionResponseDto {
  id: string;
  userId: string;
  type: string;
  amount: number;
  status: string;
  description: string;
  createdAt: string;
}
