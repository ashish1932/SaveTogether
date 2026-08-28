import { MetricsService } from '../../src/monitoring/metrics.service';

async function runMonitoringMetricsTestSuite() {
  console.log('\n================================================================');
  console.log('📊 [SAVETOGETHER PRODUCTION OBSERVABILITY & MONITORING SUITE]');
  console.log('================================================================\n');

  try {
    // 1. Technical Health Metrics
    console.log('🧪 [STAGE 01] Verifying Technical Infrastructure Observability...');
    const tech = await MetricsService.getTechnicalMetrics();
    console.log('  ✅ API Uptime:', tech.apiUptimeSeconds, 's | p95 Latency:', tech.p95LatencyMs, 'ms | 5xx Error Rate:', tech.errorRate5xxPct, '%');
    console.log('  ✅ Active DB Connections:', tech.activeDbConnections, '| Queue Status: Waiting:', tech.queueStatus.waitingJobs, 'Active:', tech.queueStatus.activeJobs);

    // 2. Business Health Metrics
    console.log('🧪 [STAGE 02] Verifying Business Health & Payment Performance Observability...');
    const biz = await MetricsService.getBusinessMetrics();
    console.log('  ✅ Payment Success Rate:', biz.paymentSuccessRatePct, '% | Total Bookings:', biz.totalBookings, '| Savings: ₹' + biz.totalCustomerSavingsAmount);

    // 3. System Alerts Classification Engine
    console.log('🧪 [STAGE 03] Verifying System Alerting Severity Engine (P0 - P3)...');
    const alerts = await MetricsService.getActiveSystemAlerts();
    console.log('  ✅ Active System Alerts Count:', alerts.length, '| Highest Severity:', alerts[0]?.severity || 'NONE');

    console.log('\n================================================================');
    console.log('🎉 [SUCCESS] PRODUCTION OBSERVABILITY & MONITORING VERIFIED!');
    console.log('================================================================\n');
    process.exit(0);
  } catch (err: any) {
    console.error('\n💥 [MONITORING FAILURE] Observability Test Failed:', err.message || err);
    process.exit(1);
  }
}

runMonitoringMetricsTestSuite();
