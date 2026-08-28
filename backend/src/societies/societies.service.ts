import { SocietiesRepository } from './societies.repository';
import { toSocietyResponseDto, SocietyResponseDto } from './responses/society-response.dto';
import { CreateSocietyDto } from './dto/create-society.dto';
import { UpdateSocietyDto } from './dto/update-society.dto';
import { ErrorCode } from '../common/types/error-codes.enum';

export class SocietiesService {
  /**
   * Retrieves paginated list of societies for Customer App / Admin Panel
   */
  public static async listSocieties(query: any, isAdmin = false) {
    const res = await SocietiesRepository.findAll({
      search: query.search || query.q,
      city: query.city,
      pincode: query.pincode,
      status: query.status,
      page: parseInt(query.page as string, 10) || 1,
      limit: parseInt(query.limit as string, 10) || 20,
      isAdmin,
    });

    const items = res.items.map((s) => toSocietyResponseDto(s, isAdmin));
    return {
      items,
      total: res.total,
      page: res.page,
      limit: res.limit,
    };
  }

  /**
   * Retrieves single society by ID
   */
  public static async getSocietyById(id: string, isAdmin = false): Promise<SocietyResponseDto> {
    const soc = await SocietiesRepository.findById(id, isAdmin);
    if (!soc) {
      throw {
        statusCode: 404,
        code: ErrorCode.SOCIETY_NOT_FOUND,
        message: 'Society not found or is currently inactive',
      };
    }
    return toSocietyResponseDto(soc, isAdmin);
  }

  /**
   * Creates new society (Admin operation)
   */
  public static async createSociety(dto: CreateSocietyDto): Promise<SocietyResponseDto> {
    // Step 11.17 Duplicate protection by name + city + pincode
    const duplicate = await SocietiesRepository.findDuplicate(dto.name, dto.city, dto.pincode);
    if (duplicate) {
      throw {
        statusCode: 409,
        code: ErrorCode.VALIDATION_ERROR,
        message: `A society named '${dto.name}' already exists in ${dto.city}.`,
      };
    }

    const created = await SocietiesRepository.create(dto);
    return toSocietyResponseDto(created, true);
  }

  /**
   * Updates society metadata (Admin operation)
   */
  public static async updateSociety(id: string, dto: UpdateSocietyDto): Promise<SocietyResponseDto> {
    const updated = await SocietiesRepository.update(id, dto);
    if (!updated) {
      throw {
        statusCode: 404,
        code: ErrorCode.SOCIETY_NOT_FOUND,
        message: 'Society not found',
      };
    }
    return toSocietyResponseDto(updated, true);
  }

  /**
   * Deactivates society (Step 11.5 & 11.20 Soft Delete)
   */
  public static async softDeleteSociety(id: string): Promise<boolean> {
    const success = await SocietiesRepository.softDelete(id);
    if (!success) {
      throw {
        statusCode: 404,
        code: ErrorCode.SOCIETY_NOT_FOUND,
        message: 'Society not found',
      };
    }
    return true;
  }
}
