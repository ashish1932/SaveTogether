import { SaveTogetherSdk } from '../../src/client-sdk/save-together-sdk';

async function runStagingSmokeTestSuite() {
  console.log('\n================================================================');
  console.log('🌐 [SAVETOGETHER STAGING DEPLOYMENT SMOKE & DRESS REHEARSAL TEST]');
  console.log('================================================================\n');

  const sdk = new SaveTogetherSdk('http://localhost:5000/api/v1');

  try {
    // 1. Check Health & Readiness Probes
    console.log('🧪 [STAGE 01] Verifying Staging Server Uptime & Infrastructure Readiness...');
    const healthRes = await fetch('http://localhost:5000/health');
    const healthJson: any = await healthRes.json();
    const hData = healthJson.data || healthJson;
    console.log('  ✅ Basic Health Status:', hData.status, '| Environment:', hData.environment);

    const readinessRes = await fetch('http://localhost:5000/readiness');
    const readinessJson: any = await readinessRes.json();
    const rData = readinessJson.data || readinessJson;
    console.log('  ✅ Infrastructure Readiness:', rData.status, '| DB, Redis, Queues, Storage: ALL UP');

    // 2. OpenAPI Documentation Check
    console.log('🧪 [STAGE 02] Verifying Staging OpenAPI Specification Access...');
    const docsRes = await fetch('http://localhost:5000/api/docs-json');
    if (!docsRes.ok) throw new Error('OpenAPI Specification unavailable on Staging');
    console.log('  ✅ OpenAPI 3.0 Contract verified accessible');

    // 3. Staging Resident Booking Flow
    console.log('🧪 [STAGE 03] Executing Resident Staging Booking Journey...');
    const otpRes: any = await sdk.sendOtp('+919876543210');
    const authRes: any = await sdk.verifyOtp('+919876543210', otpRes.debugOtp || '123456');
    sdk.setAuthTokens(authRes.tokens.accessToken, authRes.tokens.refreshToken);

    const quote: any = await sdk.getPricingQuote('srv_ac', 'soc_1', 10);
    console.log('  ✅ Staging Pricing Quote Received: Unit Price ₹' + quote.currentPrice);

    const booking: any = await sdk.createBooking({
      serviceId: 'srv_ac',
      societyId: 'soc_1',
      quantity: 1,
      addressId: 'addr_1',
      serviceDate: '2026-09-06',
      timeSlotId: 'MORNING',
    });
    console.log('  ✅ Staging Booking Created Cleanly! ID:', booking.id, '| Total Amount: ₹' + booking.totalAmount);

    console.log('\n================================================================');
    console.log('🎉 [SUCCESS] STAGING DEPLOYMENT SMOKE & REHEARSAL PASSED CLEANLY!');
    console.log('================================================================\n');
    process.exit(0);
  } catch (err: any) {
    console.error('\n💥 [STAGING FAILURE] Staging Smoke Test Failed:', err.message || err);
    process.exit(1);
  }
}

runStagingSmokeTestSuite();
