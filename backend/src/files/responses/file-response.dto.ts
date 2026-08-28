import { FilePurpose, FileVisibility } from '../dto/presign-file.dto';

export type FileStatus = 'PENDING' | 'ACTIVE' | 'DELETED' | 'FAILED';

export interface PresignedUploadResponseDto {
  fileId: string;
  uploadUrl: string;
  objectKey: string;
  expiresAt: string;
}

export interface FileAccessResponseDto {
  fileId: string;
  originalName: string;
  objectKey: string;
  mimeType: string;
  sizeBytes: number;
  purpose: FilePurpose;
  visibility: FileVisibility;
  downloadUrl: string;
  expiresAt: string;
}

export interface FileObjectDto {
  id: string;
  originalName: string;
  objectKey: string;
  bucket: string;
  mimeType: string;
  sizeBytes: number;
  purpose: FilePurpose;
  visibility: FileVisibility;
  status: FileStatus;
  uploadedBy: string | null;
  createdAt: string;
  updatedAt: string;
}
