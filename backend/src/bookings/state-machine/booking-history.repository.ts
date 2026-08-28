import { BookingStatus, BookingActorType } from './booking-state-machine';

export interface BookingStatusHistoryRecord {
  id: string;
  bookingId: string;
  fromStatus: BookingStatus | null;
  toStatus: BookingStatus;
  actorType: BookingActorType;
  actorId: string | null;
  reason: string | null;
  createdAt: string;
}

const historyStore: BookingStatusHistoryRecord[] = [];

export class BookingHistoryRepository {
  public static async recordTransition(
    bookingId: string,
    fromStatus: BookingStatus | null,
    toStatus: BookingStatus,
    actorType: BookingActorType,
    actorId?: string | null,
    reason?: string | null
  ): Promise<BookingStatusHistoryRecord> {
    const rec: BookingStatusHistoryRecord = {
      id: `bkh_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      bookingId,
      fromStatus,
      toStatus,
      actorType,
      actorId: actorId || null,
      reason: reason || null,
      createdAt: new Date().toISOString(),
    };

    historyStore.push(rec);
    console.log(`📜 [STATUS HISTORY] Booking ${bookingId}: ${fromStatus} -> ${toStatus} (Actor: ${actorType}, Reason: ${reason || 'N/A'})`);
    return rec;
  }

  public static async getHistoryByBookingId(bookingId: string): Promise<BookingStatusHistoryRecord[]> {
    return historyStore.filter((h) => h.bookingId === bookingId);
  }
}
