export type FilePurpose = 'PROFILE_PHOTO' | 'COMPLAINT_ATTACHMENT' | 'SERVICE_IMAGE' | 'VENDOR_DOCUMENT';
export type FileVisibility = 'PUBLIC' | 'PRIVATE';

export interface PresignFileDto {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  purpose: FilePurpose;
}

export function validatePresignFileDto(body: any): { isValid: boolean; data?: PresignFileDto; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request body' };
  }

  if (!body.fileName || typeof body.fileName !== 'string') {
    return { isValid: false, error: 'fileName is required' };
  }

  if (!body.mimeType || typeof body.mimeType !== 'string') {
    return { isValid: false, error: 'mimeType is required' };
  }

  const sizeBytes = Number(body.sizeBytes);
  if (isNaN(sizeBytes) || sizeBytes <= 0) {
    return { isValid: false, error: 'sizeBytes must be a positive integer' };
  }

  const validPurposes: FilePurpose[] = ['PROFILE_PHOTO', 'COMPLAINT_ATTACHMENT', 'SERVICE_IMAGE', 'VENDOR_DOCUMENT'];
  const purpose = body.purpose ? String(body.purpose).toUpperCase() as any : undefined;

  if (!purpose || !validPurposes.includes(purpose)) {
    return { isValid: false, error: `purpose must be one of: ${validPurposes.join(', ')}` };
  }

  // Purpose-specific MIME & Size limits
  const limits: Record<FilePurpose, { maxBytes: number; allowedMimeTypes: string[] }> = {
    PROFILE_PHOTO: {
      maxBytes: 5 * 1024 * 1024, // 5 MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    },
    COMPLAINT_ATTACHMENT: {
      maxBytes: 10 * 1024 * 1024, // 10 MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    },
    SERVICE_IMAGE: {
      maxBytes: 10 * 1024 * 1024, // 10 MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    },
    VENDOR_DOCUMENT: {
      maxBytes: 15 * 1024 * 1024, // 15 MB
      allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    },
  };

  const policy = limits[purpose];
  if (sizeBytes > policy.maxBytes) {
    return { isValid: false, error: `File size exceeds max limit of ${policy.maxBytes / (1024 * 1024)}MB for ${purpose}` };
  }

  if (!policy.allowedMimeTypes.includes(body.mimeType.toLowerCase())) {
    return { isValid: false, error: `Invalid MIME type '${body.mimeType}'. Allowed: ${policy.allowedMimeTypes.join(', ')}` };
  }

  return {
    isValid: true,
    data: {
      fileName: body.fileName.trim(),
      mimeType: body.mimeType.toLowerCase().trim(),
      sizeBytes,
      purpose,
    },
  };
}
