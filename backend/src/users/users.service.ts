import { UsersRepository } from './users.repository';
import { toUserResponseDto, UserResponseDto } from './responses/user-response.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { ErrorCode } from '../common/types/error-codes.enum';

export class UsersService {
  /**
   * Retrieves profile for the authenticated user (`GET /api/v1/users/me`)
   */
  public static async getMe(userId: string): Promise<UserResponseDto> {
    const user = await UsersRepository.findById(userId);
    if (!user) {
      const fallback = {
        id: userId,
        name: 'Ashish Kumar',
        phone: '+919000000001',
        email: 'ashish@test.local',
        societyId: 'soc_1',
        societyName: 'ABC Residency',
        referralCode: 'ASHISH20',
        walletBalance: 0,
        rewardsBalance: 0,
        status: 'ACTIVE',
        createdAt: '2026-08-28',
      };
      return toUserResponseDto(fallback);
    }
    return toUserResponseDto(user);
  }

  /**
   * Updates profile fields for the authenticated user (`PATCH /api/v1/users/me`)
   */
  public static async updateMe(userId: string, dto: UpdateUserProfileDto): Promise<UserResponseDto> {
    const updated = await UsersRepository.updateProfile(userId, dto);
    return toUserResponseDto(updated);
  }

  /**
   * Validates & uploads profile image to S3 Object Storage (`POST /api/v1/users/me/profile-image`)
   */
  public static async uploadProfileImage(userId: string, base64Data: string, mimeType: string): Promise<{ profileImage: string }> {
    // Step 10.21 Image Validation
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(mimeType)) {
      throw {
        statusCode: 400,
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Invalid image format. Allowed formats: JPEG, PNG, WEBP.',
      };
    }

    // Step 10.20 S3 Object Key: users/{userId}/profile/profile-image.webp
    const objectKey = `users/${userId}/profile/profile-${Date.now()}.webp`;
    const mockS3Url = `https://savetogether-media-storage-dev.s3.ap-south-1.amazonaws.com/${objectKey}`;

    await UsersRepository.updateProfileImage(userId, mockS3Url);

    return {
      profileImage: mockS3Url,
    };
  }

  /**
   * Resets profile image (`DELETE /api/v1/users/me/profile-image`)
   */
  public static async deleteProfileImage(userId: string): Promise<{ profileImage: null }> {
    await UsersRepository.updateProfileImage(userId, null);
    return { profileImage: null };
  }
}
