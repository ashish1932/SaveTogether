import { ServiceCatalogRepository } from './service-catalog.repository';
import { toCategoryResponseDto, CategoryResponseDto } from './responses/category-response.dto';
import { toServiceResponseDto, ServiceResponseDto } from './responses/service-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ErrorCode } from '../common/types/error-codes.enum';

export class ServiceCatalogService {
  // ==========================================
  // CATEGORIES
  // ==========================================

  public static async listCategories(isAdmin = false): Promise<CategoryResponseDto[]> {
    const list = await ServiceCatalogRepository.findAllCategories(isAdmin);
    return list.map(toCategoryResponseDto);
  }

  public static async getCategoryById(id: string, isAdmin = false): Promise<CategoryResponseDto> {
    const cat = await ServiceCatalogRepository.findCategoryById(id, isAdmin);
    if (!cat) {
      throw {
        statusCode: 404,
        code: ErrorCode.SERVICE_NOT_FOUND,
        message: 'Service category not found',
      };
    }
    return toCategoryResponseDto(cat);
  }

  public static async createCategory(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const duplicate = await ServiceCatalogRepository.findCategoryBySlug(dto.slug || dto.name);
    if (duplicate) {
      throw {
        statusCode: 409,
        code: ErrorCode.VALIDATION_ERROR,
        message: `A category with slug '${dto.slug}' already exists`,
      };
    }

    const created = await ServiceCatalogRepository.createCategory(dto as any);
    return toCategoryResponseDto(created);
  }

  public static async updateCategory(id: string, dto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    const updated = await ServiceCatalogRepository.updateCategory(id, dto);
    if (!updated) {
      throw {
        statusCode: 404,
        code: ErrorCode.SERVICE_NOT_FOUND,
        message: 'Service category not found',
      };
    }
    return toCategoryResponseDto(updated);
  }

  // ==========================================
  // SERVICES
  // ==========================================

  public static async listServices(query: any, isAdmin = false) {
    const res = await ServiceCatalogRepository.findAllServices({
      categoryId: query.categoryId,
      search: query.search || query.q,
      isAdmin,
      page: parseInt(query.page as string, 10) || 1,
      limit: parseInt(query.limit as string, 10) || 20,
    });

    const items = res.items.map(toServiceResponseDto);
    return {
      items,
      total: res.total,
      page: res.page,
      limit: res.limit,
    };
  }

  public static async getServiceById(id: string, isAdmin = false): Promise<ServiceResponseDto> {
    const srv = await ServiceCatalogRepository.findServiceById(id, isAdmin);
    if (!srv) {
      throw {
        statusCode: 404,
        code: ErrorCode.SERVICE_NOT_FOUND,
        message: 'Service not found',
      };
    }
    return toServiceResponseDto(srv);
  }

  public static async createService(dto: CreateServiceDto): Promise<ServiceResponseDto> {
    const category = await ServiceCatalogRepository.findCategoryById(dto.categoryId, true);
    if (!category) {
      throw {
        statusCode: 400,
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Category does not exist or is inactive',
      };
    }

    const duplicate = await ServiceCatalogRepository.findServiceBySlug(dto.slug || dto.name);
    if (duplicate) {
      throw {
        statusCode: 409,
        code: ErrorCode.VALIDATION_ERROR,
        message: `A service with slug '${dto.slug}' already exists`,
      };
    }

    const created = await ServiceCatalogRepository.createService(dto as any);
    return toServiceResponseDto(created);
  }

  public static async updateService(id: string, dto: UpdateServiceDto): Promise<ServiceResponseDto> {
    const updated = await ServiceCatalogRepository.updateService(id, dto);
    if (!updated) {
      throw {
        statusCode: 404,
        code: ErrorCode.SERVICE_NOT_FOUND,
        message: 'Service not found',
      };
    }
    return toServiceResponseDto(updated);
  }

  public static async softDeleteService(id: string): Promise<boolean> {
    const success = await ServiceCatalogRepository.softDeleteService(id);
    if (!success) {
      throw {
        statusCode: 404,
        code: ErrorCode.SERVICE_NOT_FOUND,
        message: 'Service not found',
      };
    }
    return true;
  }
}
