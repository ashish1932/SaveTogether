import { ApiClient } from './api-client';

export class SaveTogetherSdk {
  private client: ApiClient;

  constructor(baseUrl = 'http://localhost:5000/api/v1') {
    this.client = new ApiClient({ baseUrl });
  }

  public setAuthTokens(accessToken: string, refreshToken: string) {
    this.client.setTokens(accessToken, refreshToken);
  }

  // 1. Auth APIs
  public async sendOtp(mobile: string) {
    return this.client.request('/auth/send-otp', { method: 'POST', body: JSON.stringify({ mobile }) });
  }

  public async verifyOtp(mobile: string, otp: string) {
    return this.client.request('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ mobile, otp }) });
  }

  // 2. Profile APIs
  public async getProfile() {
    return this.client.request('/users/me', { method: 'GET' });
  }

  // 3. Society APIs
  public async getSocieties() {
    return this.client.request('/societies', { method: 'GET' });
  }

  // 4. Address APIs
  public async getAddresses() {
    return this.client.request('/addresses', { method: 'GET' });
  }

  // 5. Service Catalog APIs
  public async getServices() {
    return this.client.request('/services', { method: 'GET' });
  }

  // 6. Pricing APIs (Server-Calculated Quote, Step 41.20)
  public async getPricingQuote(serviceId: string, societyId: string, quantity: number) {
    return this.client.request(`/pricing/quote?serviceId=${serviceId}&societyId=${societyId}&quantity=${quantity}`, { method: 'GET' });
  }

  // 7. Demand APIs
  public async getDemandCampaign(societyId: string, serviceId: string) {
    return this.client.request(`/demand/campaign?societyId=${societyId}&serviceId=${serviceId}`, { method: 'GET' });
  }

  // 8. Booking APIs (Server-Enforced Booking Creation, Step 41.23)
  public async createBooking(data: { serviceId: string; societyId: string; quantity: number; addressId: string; serviceDate: string; timeSlotId: string }) {
    return this.client.request('/bookings', { method: 'POST', body: JSON.stringify(data) });
  }

  public async getBookings() {
    return this.client.request('/bookings', { method: 'GET' });
  }

  // 9. Payment APIs
  public async createPaymentOrder(bookingId: string) {
    return this.client.request('/payments/create-order', { method: 'POST', body: JSON.stringify({ bookingId }) });
  }

  // 10. Referrals & Rewards APIs
  public async getReferralInfo() {
    return this.client.request('/referrals', { method: 'GET' });
  }

  public async getRewardTransactions() {
    return this.client.request('/rewards/transactions', { method: 'GET' });
  }

  // 11. Admin APIs
  public async adminLogin(email: string, password: string) {
    return this.client.request('/admin/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  }

  public async adminVerify2FA(challengeId: string, code: string) {
    return this.client.request('/admin/auth/verify-2fa', { method: 'POST', body: JSON.stringify({ challengeId, code }) });
  }

  public async getAdminOverview() {
    return this.client.request('/admin/analytics/overview', { method: 'GET' });
  }
}
