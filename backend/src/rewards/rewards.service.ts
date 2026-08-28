import { RewardsRepository, LocalRewardTransactionRecord } from './rewards.repository';
import { WalletSummaryResponseDto, RewardTransactionItemDto } from './responses/reward-response.dto';
import { CreateRedemptionDto } from './dto/redemption.dto';
import { AdminAdjustmentDto } from './dto/admin-adjustment.dto';
import { ErrorCode } from '../common/types/error-codes.enum';

export class RewardsService {
  /**
   * Computes wallet balance purely from transaction ledger (Step 27.7 & 27.22)
   */
  public static async getWalletSummary(userId: string): Promise<WalletSummaryResponseDto> {
    const txs = await RewardsRepository.findByUserId(userId);

    const completed = txs.filter((t) => t.status === 'COMPLETED');
    const availableBalance = Math.max(0, completed.reduce((sum, t) => sum + t.amount, 0));
    const pendingRewards = txs.filter((t) => t.status === 'PENDING').reduce((sum, t) => sum + Math.max(0, t.amount), 0);
    const totalEarned = completed.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const totalUsed = Math.abs(completed.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));

    return {
      availableBalance: Math.round(availableBalance * 100) / 100,
      pendingRewards: Math.round(pendingRewards * 100) / 100,
      totalEarned: Math.round(totalEarned * 100) / 100,
      totalUsed: Math.round(totalUsed * 100) / 100,
    };
  }

  /**
   * Returns user transaction history (Step 27.23)
   */
  public static async getUserTransactions(userId: string): Promise<RewardTransactionItemDto[]> {
    const list = await RewardsRepository.findByUserId(userId);
    return list.map(this.toDto);
  }

  /**
   * Controlled Reward Credit Redemption against bookings (Step 27.8 - 27.11)
   */
  public static async redeemRewards(userId: string, dto: CreateRedemptionDto): Promise<RewardTransactionItemDto> {
    const available = await RewardsRepository.calculateAvailableBalance(userId);

    if (available < dto.amount) {
      throw {
        statusCode: 400,
        code: ErrorCode.VALIDATION_ERROR,
        message: `Insufficient reward balance. Available: ₹${available}, Requested: ₹${dto.amount}`,
      };
    }

    const tx = await RewardsRepository.createTransaction({
      userId,
      type: 'REDEMPTION',
      status: 'COMPLETED',
      amount: -dto.amount, // Signed negative amount for debits (Step 27.4)
      referenceId: dto.bookingId ? `BOOKING_REDEMPTION:${dto.bookingId}` : `REDEMPTION:${Date.now()}`,
      description: dto.bookingId ? `Reward credit redeemed against booking ${dto.bookingId}` : `Reward platform credit redemption`,
    });

    return this.toDto(tx);
  }

  /**
   * Admin Adjustment (Step 27.19 & 27.20)
   */
  public static async adminAdjustment(dto: AdminAdjustmentDto, adminUserId: string): Promise<RewardTransactionItemDto> {
    const isCredit = dto.type === 'ADMIN_CREDIT';
    const signedAmount = isCredit ? dto.amount : -dto.amount;

    if (!isCredit) {
      const available = await RewardsRepository.calculateAvailableBalance(dto.userId);
      if (available < dto.amount) {
        throw {
          statusCode: 400,
          code: ErrorCode.VALIDATION_ERROR,
          message: `Cannot debit ₹${dto.amount}. User current available balance is ₹${available}`,
        };
      }
    }

    const tx = await RewardsRepository.createTransaction({
      userId: dto.userId,
      type: dto.type,
      status: 'COMPLETED',
      amount: signedAmount,
      referenceId: `ADMIN_ADJUSTMENT:${Date.now()}`,
      description: `Admin ${dto.type}: ${dto.reason}`,
      createdBy: adminUserId,
    });

    return this.toDto(tx);
  }

  public static async listAdminTransactions(): Promise<RewardTransactionItemDto[]> {
    const list = await RewardsRepository.findAll();
    return list.map(this.toDto);
  }

  private static toDto(t: LocalRewardTransactionRecord): RewardTransactionItemDto {
    return {
      id: t.id,
      transactionNumber: t.transactionNumber,
      userId: t.userId,
      type: t.type,
      status: t.status,
      amount: t.amount,
      referenceId: t.referenceId,
      description: t.description,
      createdAt: t.createdAt,
    };
  }
}
