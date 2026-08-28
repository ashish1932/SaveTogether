export interface UserResponseDto {
  id: string;
  name: string | null;
  mobile: string;
  email: string | null;
  profileImage: string | null;
  societyId: string | null;
  societyName: string | null;
  referralCode: string;
  walletBalance: number;
  rewardsBalance: number;
  status: string;
  createdAt: string;
}

export function toUserResponseDto(user: any): UserResponseDto {
  return {
    id: user.id,
    name: user.name || null,
    mobile: user.phone || user.mobile,
    email: user.email || null,
    profileImage: user.profileImage || null,
    societyId: user.societyId || 'soc_1',
    societyName: user.societyName || 'ABC Residency',
    referralCode: user.referralCode,
    walletBalance: user.walletBalance || 0,
    rewardsBalance: user.rewardsBalance || 0,
    status: user.status || 'ACTIVE',
    createdAt: user.createdAt || new Date().toISOString().split('T')[0],
  };
}
