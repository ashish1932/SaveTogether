import { FilesRepository, LocalFileObjectRecord } from './files.repository';
import { PresignFileDto, FileVisibility } from './dto/presign-file.dto';
import { PresignedUploadResponseDto, FileAccessResponseDto, FileObjectDto } from './responses/file-response.dto';
import { ErrorCode } from '../common/types/error-codes.enum';

export class FilesService {
  private static S3_BUCKET = 'savetogether-uploads-dev';
  private static S3_BASE_URL = 'http://localhost:5000/api/v1/files/download-simulated';

  /**
   * Generates a presigned upload URL and registers PENDING FileObject metadata (Step 32.8)
   */
  public static async generatePresignedUpload(userId: string | null, dto: PresignFileDto): Promise<PresignedUploadResponseDto> {
    const visibility: FileVisibility = dto.purpose === 'SERVICE_IMAGE' ? 'PUBLIC' : 'PRIVATE';
    const folder = dto.purpose.toLowerCase().replace('_', '-');
    const uniqueId = `file_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const sanitizedFileName = dto.fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const objectKey = `${folder}/${userId || 'system'}/${uniqueId}_${sanitizedFileName}`;

    const record = await FilesRepository.createFile({
      originalName: dto.fileName,
      objectKey,
      bucket: this.S3_BUCKET,
      mimeType: dto.mimeType,
      sizeBytes: dto.sizeBytes,
      purpose: dto.purpose,
      visibility,
      uploadedBy: userId,
    });

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes TTL
    const uploadUrl = `http://localhost:5000/api/v1/files/upload-simulated/${record.id}?expires=${encodeURIComponent(expiresAt)}`;

    return {
      fileId: record.id,
      uploadUrl,
      objectKey: record.objectKey,
      expiresAt,
    };
  }

  /**
   * Confirms upload completion and activates FileObject (Step 32.9)
   */
  public static async completeUpload(fileId: string, userId: string | null, isAdmin = false): Promise<FileObjectDto> {
    const file = await FilesRepository.findById(fileId);
    if (!file) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'File record not found',
      };
    }

    if (!isAdmin && userId && file.uploadedBy && file.uploadedBy !== userId) {
      throw {
        statusCode: 403,
        code: ErrorCode.AUTH_UNAUTHORIZED,
        message: 'You are not authorized to modify this file',
      };
    }

    const updated = await FilesRepository.updateStatus(file.id, 'ACTIVE');
    return this.toDto(updated!);
  }

  /**
   * Returns authorized signed download URL for a file (Step 32.18 & 32.27)
   */
  public static async getFileAccess(fileId: string, userId: string | null, isAdmin = false): Promise<FileAccessResponseDto> {
    const file = await FilesRepository.findById(fileId);
    if (!file || file.status === 'DELETED') {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'File object not found or deleted',
      };
    }

    // Step 32.27: Access Control for Private Files
    if (file.visibility === 'PRIVATE' && !isAdmin) {
      if (!userId || (file.uploadedBy && file.uploadedBy !== userId)) {
        throw {
          statusCode: 403,
          code: ErrorCode.AUTH_UNAUTHORIZED,
          message: 'Access denied. Private file ownership required.',
        };
      }
    }

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour TTL
    const downloadUrl = `${this.S3_BASE_URL}/${file.id}?expires=${encodeURIComponent(expiresAt)}&key=${encodeURIComponent(file.objectKey)}`;

    return {
      fileId: file.id,
      originalName: file.originalName,
      objectKey: file.objectKey,
      mimeType: file.mimeType,
      sizeBytes: file.sizeBytes,
      purpose: file.purpose,
      visibility: file.visibility,
      downloadUrl,
      expiresAt,
    };
  }

  /**
   * Soft deletes file object (Step 32.39)
   */
  public static async deleteFile(fileId: string, userId: string | null, isAdmin = false): Promise<{ success: boolean; message: string }> {
    const file = await FilesRepository.findById(fileId);
    if (!file) {
      throw {
        statusCode: 404,
        code: ErrorCode.BOOKING_NOT_FOUND,
        message: 'File object not found',
      };
    }

    if (!isAdmin && userId && file.uploadedBy && file.uploadedBy !== userId) {
      throw {
        statusCode: 403,
        code: ErrorCode.AUTH_UNAUTHORIZED,
        message: 'You are not authorized to delete this file',
      };
    }

    await FilesRepository.updateStatus(file.id, 'DELETED');
    return { success: true, message: 'File object marked for deletion' };
  }

  private static toDto(f: LocalFileObjectRecord): FileObjectDto {
    return {
      id: f.id,
      originalName: f.originalName,
      objectKey: f.objectKey,
      bucket: f.bucket,
      mimeType: f.mimeType,
      sizeBytes: f.sizeBytes,
      purpose: f.purpose,
      visibility: f.visibility,
      status: f.status,
      uploadedBy: f.uploadedBy,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
    };
  }
}
