import { AddressesRepository } from './addresses.repository';
import { toAddressResponseDto, AddressResponseDto } from './responses/address-response.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { SocietiesRepository } from '../societies/societies.repository';
import { ErrorCode } from '../common/types/error-codes.enum';

export class AddressesService {
  /**
   * Retrieves all addresses owned by the authenticated user
   */
  public static async getUserAddresses(userId: string): Promise<AddressResponseDto[]> {
    const list = await AddressesRepository.findManyByUserId(userId);
    return list.map(toAddressResponseDto);
  }

  /**
   * Retrieves single address owned by userId (Returns 404 ADDRESS_NOT_FOUND on IDOR attempt!)
   */
  public static async getUserAddressById(userId: string, addressId: string): Promise<AddressResponseDto> {
    const addr = await AddressesRepository.findByIdAndUserId(addressId, userId);
    if (!addr) {
      throw {
        statusCode: 404,
        code: ErrorCode.ADDRESS_NOT_FOUND,
        message: 'Address not found',
      };
    }
    return toAddressResponseDto(addr);
  }

  /**
   * Creates address for userId (Step 12.11: Validates Society exists & is ACTIVE!)
   */
  public static async createAddress(userId: string, dto: CreateAddressDto): Promise<AddressResponseDto> {
    const society = await SocietiesRepository.findById(dto.societyId, false);
    if (!society) {
      throw {
        statusCode: 400,
        code: ErrorCode.SOCIETY_INACTIVE,
        message: 'Selected society does not exist or is currently inactive',
      };
    }

    const created = await AddressesRepository.create(userId, {
      societyId: society.id,
      societyName: society.name,
      flatNumber: dto.flatNumber,
      building: dto.building || 'Block A',
      street: dto.street || society.address || '',
      landmark: dto.landmark || '',
      city: dto.city || society.city,
      state: dto.state || 'Tamil Nadu',
      pincode: dto.pincode || (society as any).pincode || '600001',
      isDefault: Boolean(dto.isDefault),
    });

    return toAddressResponseDto(created);
  }

  /**
   * Updates address owned by userId
   */
  public static async updateAddress(userId: string, addressId: string, dto: UpdateAddressDto): Promise<AddressResponseDto> {
    if (dto.societyId) {
      const society = await SocietiesRepository.findById(dto.societyId, false);
      if (!society) {
        throw {
          statusCode: 400,
          code: ErrorCode.SOCIETY_INACTIVE,
          message: 'Selected society does not exist or is currently inactive',
        };
      }
    }

    const updated = await AddressesRepository.updateByIdAndUserId(addressId, userId, dto);
    if (!updated) {
      throw {
        statusCode: 404,
        code: ErrorCode.ADDRESS_NOT_FOUND,
        message: 'Address not found',
      };
    }
    return toAddressResponseDto(updated);
  }

  /**
   * Sets default address for userId (Step 12.20)
   */
  public static async setDefaultAddress(userId: string, addressId: string): Promise<AddressResponseDto> {
    const updated = await AddressesRepository.setDefaultAddress(addressId, userId);
    if (!updated) {
      throw {
        statusCode: 404,
        code: ErrorCode.ADDRESS_NOT_FOUND,
        message: 'Address not found',
      };
    }
    return toAddressResponseDto(updated);
  }

  /**
   * Soft-deletes address owned by userId (Step 12.25 & 12.27)
   */
  public static async deleteAddress(userId: string, addressId: string): Promise<boolean> {
    const success = await AddressesRepository.softDeleteByIdAndUserId(addressId, userId);
    if (!success) {
      throw {
        statusCode: 404,
        code: ErrorCode.ADDRESS_NOT_FOUND,
        message: 'Address not found',
      };
    }
    return true;
  }
}
