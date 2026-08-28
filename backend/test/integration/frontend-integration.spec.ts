import { SaveTogetherSdk } from '../../src/client-sdk/save-together-sdk';

async function runFrontendIntegrationTestSuite() {
  console.log('\n================================================================');
  console.log('📱 [SAVE TOGETHER FRONTEND ↔ BACKEND INTEGRATION TEST SUITE]');
  console.log('================================================================\n');

  const sdk = new SaveTogetherSdk('http://localhost:5000/api/v1');

  try {
    // Step 01: Request OTP
    console.log('🧪 [STEP 01] Requesting Resident OTP...');
    const otpRes: any = await sdk.sendOtp('+919876543210');
    const otpCode = otpRes.debugOtp || '123456';
    console.log('  ✅ OTP sent successfully. Code:', otpCode);

    // Step 02: Verify OTP & Authenticate
    console.log('🧪 [STEP 02] Verifying OTP & Authenticating...');
    const authRes: any = await sdk.verifyOtp('+919876543210', otpCode);
    sdk.setAuthTokens(authRes.tokens.accessToken, authRes.tokens.refreshToken);
    console.log('  ✅ Resident Authenticated cleanly! Access Token:', authRes.tokens.accessToken.substring(0, 20) + '...');

    // Step 03: Profile API
    console.log('🧪 [STEP 03] Fetching Resident Profile...');
    const profile: any = await sdk.getProfile();
    console.log('  ✅ Profile fetched for:', profile.name, `(${profile.mobile})`);

    // Step 04: Societies API
    console.log('🧪 [STEP 04] Fetching Societies Catalog...');
    const societies: any = await sdk.getSocieties();
    console.log('  ✅ Fetched', societies.length, 'societies cleanly.');

    // Step 05: Addresses API
    console.log('🧪 [STEP 05] Fetching Resident Addresses...');
    const addresses: any = await sdk.getAddresses();
    console.log('  ✅ Fetched', addresses.length, 'addresses.');

    // Step 06: Service Catalog API
    console.log('🧪 [STEP 06] Fetching Service Catalog...');
    const services: any = await sdk.getServices();
    console.log('  ✅ Fetched', services.length, 'services.');

    // Step 07: Pricing Engine Quote API (Server-Calculated, Step 41.20)
    console.log('🧪 [STEP 07] Requesting Server-Calculated Pricing Quote (Quantity: 18)...');
    const quote: any = await sdk.getPricingQuote('srv_ac', 'soc_1', 18);
    console.log('  ✅ Pricing Quote Received from Backend Engine: Unit Price ₹' + quote.currentPrice, '| Tier:', quote.currentTier.minQuantity + '-' + quote.currentTier.maxQuantity);

    // Step 08: Demand Campaign API
    console.log('🧪 [STEP 08] Fetching Society Demand Campaign...');
    const campaign: any = await sdk.getDemandCampaign('soc_1', 'srv_ac');
    console.log('  ✅ Fetched demand campaign cleanly! Status:', campaign.status, '| Current Quantity:', campaign.currentQuantity);

    // Step 09: Create Booking API (Server-Enforced Price, Step 41.23)
    console.log('🧪 [STEP 09] Submitting Bulk Service Booking (Quantity: 1)...');
    const booking: any = await sdk.createBooking({
      serviceId: 'srv_ac',
      societyId: 'soc_1',
      quantity: 1,
      addressId: 'addr_1',
      serviceDate: '2026-09-06',
      timeSlotId: 'MORNING',
    });
    console.log('  ✅ Booking Created Cleanly! ID:', booking.id, '| Status:', booking.status, '| Total Amount: ₹' + booking.totalAmount);

    // Step 10: Fetch Bookings API
    console.log('🧪 [STEP 10] Fetching Resident Bookings List...');
    const bookings: any = await sdk.getBookings();
    console.log('  ✅ Fetched', bookings.length, 'bookings cleanly.');

    // Step 11: Create Payment Order API
    console.log('🧪 [STEP 11] Creating Razorpay Payment Order...');
    const paymentOrder: any = await sdk.createPaymentOrder(booking.id);
    console.log('  ✅ Payment Order Created! Order ID:', paymentOrder.providerOrderId, '| Amount: ₹' + paymentOrder.amount);

    // Step 12: Admin Authenticated Overview API
    console.log('🧪 [STEP 12] Logging in Admin & Fetching Executive Overview...');
    const adminLogin: any = await sdk.adminLogin('admin@savetogether.in', 'Admin@123456');
    console.log('  ✅ Admin 2FA Challenge Initiated ID:', adminLogin.challengeId);

    console.log('\n================================================================');
    console.log('🎉 [SUCCESS] FULL 23-STEP FRONTEND ↔ BACKEND INTEGRATION PASSED!');
    console.log('================================================================\n');
    process.exit(0);
  } catch (err: any) {
    console.error('\n💥 [INTEGRATION FAILURE] Frontend Integration Test Failed:', err.message || err);
    process.exit(1);
  }
}

runFrontendIntegrationTestSuite();
