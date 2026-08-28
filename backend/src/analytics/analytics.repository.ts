import { BookingsRepository } from '../bookings/bookings.repository';
import { PaymentsRepository } from '../payments/payments.repository';
import { RefundsRepository } from '../refunds/refunds.repository';
import { DemandRepository } from '../demand/demand.repository';
import { VendorsRepository } from '../vendors/vendors.repository';
import { SocietiesRepository } from '../societies/societies.repository';
import { UsersRepository } from '../users/users.repository';
import { ReviewsRepository } from '../reviews/reviews.repository';

export class AnalyticsRepository {
  public static async getRawSnapshotData() {
    const bookings = await BookingsRepository.findAll();
    const payments = await PaymentsRepository.findAll();
    const refunds = await RefundsRepository.findAll();
    const campaigns = await DemandRepository.findAllCampaigns();
    const vendors = await VendorsRepository.findAll();
    const societiesResult = await SocietiesRepository.findAll({});
    const users = await UsersRepository.findAll();
    const reviews = await ReviewsRepository.findAll();

    return {
      bookings,
      payments,
      refunds,
      campaigns,
      vendors,
      societies: societiesResult.items,
      users,
      reviews,
    };
  }
}
