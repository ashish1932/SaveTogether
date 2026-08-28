import { SettingCategory } from '../dto/update-settings.dto';

export interface SettingRecordResponseDto {
  id: string;
  category: SettingCategory;
  version: number;
  configuration: Record<string, any>;
  effectiveFrom: string;
  effectiveTo: string | null;
  isActive: boolean;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SettingsSummaryResponseDto {
  general: Record<string, any>;
  business: Record<string, any>;
  pricing: Record<string, any>;
  payment: Record<string, any>;
  refund: Record<string, any>;
  referral: Record<string, any>;
  notification: Record<string, any>;
}
