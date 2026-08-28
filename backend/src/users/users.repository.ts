import { usersData } from '../data/mockDatabase';
import { User } from '../types';

export class UsersRepository {
  public static async findById(id: string): Promise<User | undefined> {
    return usersData.find((u) => u.id === id);
  }

  public static async findAll(): Promise<User[]> {
    return usersData;
  }

  public static async findByMobile(mobile: string): Promise<User | undefined> {
    return usersData.find((u) => u.phone === mobile);
  }

  public static async findByReferralCode(code: string): Promise<User | undefined> {
    return usersData.find((u) => u.referralCode === code);
  }

  public static async updateProfile(id: string, updates: { name?: string; email?: string }): Promise<User> {
    let user = usersData.find((u) => u.id === id);
    if (!user) {
      user = usersData[0];
    }

    if (updates.name !== undefined) {
      user.name = updates.name;
    }
    if (updates.email !== undefined) {
      user.email = updates.email;
    }

    return user;
  }

  public static async updateProfileImage(id: string, imageUrl: string | null): Promise<User> {
    let user = usersData.find((u) => u.id === id);
    if (!user) {
      user = usersData[0];
    }

    (user as any).profileImage = imageUrl;
    return user;
  }
}
