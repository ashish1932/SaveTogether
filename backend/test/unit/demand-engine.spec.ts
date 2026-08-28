import { DemandRepository } from '../../src/demand/demand.repository';

export async function runDemandEngineUnitTests() {
  console.log('🧪 [TEST] Running Demand Engine Unit Tests...');

  const campaignA = await DemandRepository.findOrCreateActiveCampaign('soc_1', 'ABC Residency', 'srv_ac', 'AC Service');
  const campaignB = await DemandRepository.findOrCreateActiveCampaign('soc_2', 'Green Meadows', 'srv_ac', 'AC Service');

  if (campaignA.id === campaignB.id) {
    throw new Error('Demand Test Failed: Campaign demand mixed between ABC Residency (soc_1) and Green Meadows (soc_2)');
  }

  console.log('✅ [TEST PASSED] Demand Engine Unit Tests (Society & Service Isolation)');
}
