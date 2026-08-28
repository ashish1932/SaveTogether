import { FileStatus } from './responses/file-response.dto';
import { FilePurpose, FileVisibility } from './dto/presign-file.dto';

export interface LocalFileObjectRecord {
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

const mockFilesStore: LocalFileObjectRecord[] = [
  {
    id: 'file_1001',
    originalName: 'ac_service_photo.jpg',
    objectKey: 'complaints/usr_1/ac_service_photo.jpg',
    bucket: 'savetogether-uploads-dev',
    mimeType: 'image/jpeg',
    sizeBytes: 245678,
    purpose: 'COMPLAINT_ATTACHMENT',
    visibility: 'PRIVATE',
    status: 'ACTIVE',
    uploadedBy: 'usr_1',
    createdAt: '2026-08-27T10:00:00Z',
    updatedAt: '2026-08-27T10:00:00Z',
  },
];

export class FilesRepository {
  public static async createFile(data: {
    originalName: string;
    objectKey: string;
    bucket: string;
    mimeType: string;
    sizeBytes: number;
    purpose: FilePurpose;
    visibility: FileVisibility;
    uploadedBy: string | null;
  }): Promise<LocalFileObjectRecord> {
    const id = `file_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const record: LocalFileObjectRecord = {
      id,
      originalName: data.originalName,
      objectKey: data.objectKey,
      bucket: data.bucket,
      mimeType: data.mimeType,
      sizeBytes: data.sizeBytes,
      purpose: data.purpose,
      visibility: data.visibility,
      status: 'PENDING',
      uploadedBy: data.uploadedBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockFilesStore.push(record);
    return record;
  }

  public static async findById(id: string): Promise<LocalFileObjectRecord | undefined> {
    return mockFilesStore.find((f) => f.id === id);
  }

  public static async findByObjectKey(objectKey: string): Promise<LocalFileObjectRecord | undefined> {
    return mockFilesStore.find((f) => f.objectKey === objectKey);
  }

  public static async updateStatus(id: string, status: FileStatus): Promise<LocalFileObjectRecord | undefined> {
    const file = await this.findById(id);
    if (file) {
      file.status = status;
      file.updatedAt = new Date().toISOString();
    }
    return file;
  }

  public static async findAll(): Promise<LocalFileObjectRecord[]> {
    return mockFilesStore;
  }
}
