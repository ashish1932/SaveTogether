import { ReferralsRepository, LocalReferralRecord } from './referrals.repository';
import { ReferralSummaryResponseDto, ReferralHistoryItemDto } from './responses/referral-response.dto';
import { UsersRepository } from '../users/users.repository';
import { ErrorCode } from '../common/types/error-codes.enum';

export class ReferralsService {
  /**
   * Validates a referral code without side effects (Step 26.6 & 26.7)
   */
  public static async validateReferralCode(code: string, currentUserId?: string) {
    const referrer = await UsersRepository.findByReferralCode(code);
    if (!referrer) {
      throw {
        statusCode: 400,
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Invalid or inactive referral code',
      };
    }

    // Step 26.10: Prohibit self-referral
    if (currentUserId && referrer.id === currentUserId) {
      throw {
        statusCode: 400,
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Self-referral is not allowed',
      };
    }

    return {
      valid: true,
      referralCode: referrer.referralCode || code,
    };
  }

  /**
   * Immutable referral attribution binding during onboarding (Step 26.8 & 26.9)
   */
  public static async attributeReferral(referredUserId: string, referralCode: string) {
    const existing = await ReferralsRepository.findByReferredUserId(referredUserId);
    if (existing) {
      throw {
        statusCode: 400,
        code: ErrorCode.VALIDATION_ERROR,
        message: 'User has already been attributed to a referrer',
      };
    }

    const referrer = await UsersRepository.findByReferralCode(referralCode);
    if (!referrer) {
      throw {
        statusCode: 400,
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Invalid referral code',
      };
    }

    if (referrer.id === referredUserId) {
      throw {
        statusCode: 400,
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Self-referral is not allowed',
      };
    }

    const referredUser = await UsersRepository.findById(referredUserId);

    return ReferralsRepository.createReferral({
      referralCode,
      referrerId: referrer.id,
      referredUserId,
      referredUserName: referredUser?.name || 'Referred Resident',
    });
  }

  /**
   * Triggered when referred user completes service: Qualifies referral & issues exactly-once ₹50 reward (Step 26.13 - 26.19)
   */
  public static async qualifyReferralOnBookingComplete(referredUserId: string, bookingId: string) {
    const referral = await ReferralsRepository.findByReferredUserId(referredUserId);
    if (!referral) return null;

    if (referral.status === 'REWARDED' || referral.status === 'QUALIFIED') {
      return referral;
    }

    // Update Referral status to QUALIFIED & REWARDED
    const updated = await ReferralsRepository.updateStatus(referral.id, 'REWARDED');

    // Issue exactly-once RewardTransaction (+₹50) for the referrer (Step 26.18)
    await ReferralsRepository.createRewardTransaction({
      userId: referral.referrerId,
      amount: 50,
      referenceId: `REFERRAL_REWARD:${referral.id}`,
      description: `Referral bonus for qualifying resident completion (Ref: ${referral.id})`,
    });

    return updated;
  }

  /**
   * Assembles customer referral summary metrics (Step 26.22)
   */
  public static async getSummary(userId: string): Promise<ReferralSummaryResponseDto> {
    const user = await UsersRepository.findById(userId);
    const referrals = await ReferralsRepository.findManyByReferrerId(userId);
    const rewardTx = await ReferralsRepository.getRewardTransactionsByUser(userId);

    const totalInvited = referrals.length;
    const successfulReferrals = referrals.filter((r) => r.status === 'QUALIFIED' || r.status === 'REWARDED').length;
    const totalEarned = rewardTx.reduce((sum, tx) => sum + tx.amount, 0);

    return {
      referralCode: user?.referralCode || 'ST0001',
      rewardPerSuccessfulReferral: 50,
      totalInvited,
      successfulReferrals,
      totalEarned,
    };
  }

  /**
   * Returns referral attribution history (Step 26.21)
   */
  public static async getHistory(userId: string): Promise<ReferralHistoryItemDto[]> {
    const list = await ReferralsRepository.findManyByReferrerId(userId);
    return list.map((r) => ({
      id: r.id,
      referredUserName: r.referredUserName,
      status: r.status,
      rewardAmount: r.rewardAmount,
      qualifiedAt: r.qualifiedAt,
      createdAt: r.createdAt,
    }));
  }

  public static async listAdminReferrals() {
    return ReferralsRepository.findAll();
  }

  public static async setFraudReview(referralId: string) {
    return ReferralsRepository.updateStatus(referralId, 'FRAUD_REVIEW');
  }
}
