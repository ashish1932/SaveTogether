import { SettingsRepository, LocalSettingRecord } from './settings.repository';
import { UpdateSettingsDto, SettingCategory } from './dto/update-settings.dto';
import { SettingRecordResponseDto, SettingsSummaryResponseDto } from './responses/setting-response.dto';
import { AuditRepository } from '../admin/audit/audit.repository';
import { ErrorCode } from '../common/types/error-codes.enum';

export class SettingsService {
  /**
   * Fetches active configurations across all 7 domain categories
   */
  public static async getAllSettings(): Promise<SettingsSummaryResponseDto> {
    const list = await SettingsRepository.getAllActive();

    const getCategoryConfig = (cat: SettingCategory) => {
      const rec = list.find((s) => s.category === cat);
      return rec ? rec.configuration : {};
    };

    return {
      general: getCategoryConfig('GENERAL'),
      business: getCategoryConfig('BUSINESS'),
      pricing: getCategoryConfig('PRICING'),
      payment: getCategoryConfig('PAYMENT'),
      refund: getCategoryConfig('REFUND'),
      referral: getCategoryConfig('REFERRAL'),
      notification: getCategoryConfig('NOTIFICATION'),
    };
  }

  /**
   * Fetches active configuration record for a specific category
   */
  public static async getSettingsByCategory(category: SettingCategory): Promise<SettingRecordResponseDto> {
    const record = await SettingsRepository.getActiveByCategory(category);
    if (!record) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: `No active setting found for category '${category}'`,
      };
    }
    return this.toDto(record);
  }

  /**
   * Updates category settings by creating a new versioned record (Step 35.6, 35.7 & 35.28)
   */
  public static async updateCategorySettings(adminUserId: string, adminName: string, dto: UpdateSettingsDto): Promise<SettingRecordResponseDto> {
    const previous = await SettingsRepository.getActiveByCategory(dto.category);
    const beforeConfig = previous ? previous.configuration : null;

    const newRecord = await SettingsRepository.createNewVersion({
      category: dto.category,
      configuration: dto.configuration,
      effectiveFrom: dto.effectiveFrom,
      createdBy: adminUserId,
    });

    // Step 35.27 & 35.28: Detailed Audit Log with before / after diffs
    await AuditRepository.logAction({
      adminId: adminUserId,
      adminName,
      action: `${dto.category}_SETTINGS_UPDATED`,
      targetEntity: 'PlatformSetting',
      targetId: newRecord.id,
      metadata: {
        category: dto.category,
        version: newRecord.version,
        reason: dto.reason || 'Admin configuration update',
        before: beforeConfig,
        after: newRecord.configuration,
      },
    });

    console.log(`⚙️ [SETTINGS UPDATED] Category ${dto.category} updated to v${newRecord.version} by ${adminName}`);
    return this.toDto(newRecord);
  }

  /**
   * Fetches complete version history for a category (Step 35.7)
   */
  public static async getCategoryVersions(category: SettingCategory): Promise<SettingRecordResponseDto[]> {
    const list = await SettingsRepository.findCategoryVersions(category);
    return list.map(this.toDto);
  }

  private static toDto(s: LocalSettingRecord): SettingRecordResponseDto {
    return {
      id: s.id,
      category: s.category,
      version: s.version,
      configuration: s.configuration,
      effectiveFrom: s.effectiveFrom,
      effectiveTo: s.effectiveTo,
      isActive: s.isActive,
      createdBy: s.createdBy,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    };
  }
}
