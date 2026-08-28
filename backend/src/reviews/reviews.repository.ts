import { ReviewStatus } from './dto/update-review-status.dto';

export interface LocalReviewRecord {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  serviceId: string;
  serviceName: string;
  vendorId: string | null;
  vendorName: string | null;
  overallRating: number;
  serviceQuality: number;
  professionalism: number;
  valueForMoney: number;
  comment: string | null;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
}

const mockReviewsStore: LocalReviewRecord[] = [
  {
    id: 'rv_1001',
    bookingId: 'BK10245',
    userId: 'usr_1',
    userName: 'Ashish Kumar',
    serviceId: 'srv_ac',
    serviceName: 'AC General Service',
    vendorId: 'vnd_001',
    vendorName: 'CoolCare Services',
    overallRating: 5,
    serviceQuality: 5,
    professionalism: 5,
    valueForMoney: 5,
    comment: 'Punctual technician and thorough jet wash cleaning.',
    status: 'PUBLISHED',
    createdAt: '2026-08-27T14:00:00Z',
    updatedAt: '2026-08-27T14:00:00Z',
  },
];

export class ReviewsRepository {
  /**
   * Enforces UNIQUE(bookingId) constraint (Step 31.11 & 31.12)
   */
  public static async createReview(data: {
    bookingId: string;
    userId: string;
    userName: string;
    serviceId: string;
    serviceName: string;
    vendorId?: string | null;
    vendorName?: string | null;
    overallRating: number;
    serviceQuality: number;
    professionalism: number;
    valueForMoney: number;
    comment?: string;
  }): Promise<LocalReviewRecord> {
    const existing = mockReviewsStore.find((r) => r.bookingId === data.bookingId);
    if (existing) {
      throw new Error('REVIEW_ALREADY_EXISTS');
    }

    const id = `rv_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const record: LocalReviewRecord = {
      id,
      bookingId: data.bookingId,
      userId: data.userId,
      userName: data.userName,
      serviceId: data.serviceId,
      serviceName: data.serviceName,
      vendorId: data.vendorId || null,
      vendorName: data.vendorName || null,
      overallRating: data.overallRating,
      serviceQuality: data.serviceQuality,
      professionalism: data.professionalism,
      valueForMoney: data.valueForMoney,
      comment: data.comment || null,
      status: 'PUBLISHED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockReviewsStore.push(record);
    return record;
  }

  public static async findByBookingId(bookingId: string): Promise<LocalReviewRecord | undefined> {
    return mockReviewsStore.find((r) => r.bookingId === bookingId);
  }

  public static async findById(id: string): Promise<LocalReviewRecord | undefined> {
    return mockReviewsStore.find((r) => r.id === id);
  }

  public static async findByUserId(userId: string): Promise<LocalReviewRecord[]> {
    return mockReviewsStore.filter((r) => r.userId === userId);
  }

  public static async findAll(): Promise<LocalReviewRecord[]> {
    return mockReviewsStore;
  }

  public static async updateStatus(id: string, status: ReviewStatus): Promise<LocalReviewRecord | undefined> {
    const review = await this.findById(id);
    if (review) {
      review.status = status;
      review.updatedAt = new Date().toISOString();
    }
    return review;
  }
}
