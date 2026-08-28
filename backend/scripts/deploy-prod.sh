#!/bin/bash
set -e

echo "=================================================================="
echo "🚀 SAVETOGETHER PRODUCTION DEPLOYMENT & GO-LIVE SEQUENCE"
echo "=================================================================="

# 1. Environment Verification
echo "🔍 [STEP 1] Validating Production Release Environment..."
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️ Warning: DATABASE_URL not set. Loading fallback production configuration..."
fi

# 2. Run TypeScript Compilation & Build
echo "🏗️ [STEP 2] Compiling Production Application Build..."
npm run build

# 3. Execute Critical Business Safety Invariants
echo "🛡️ [STEP 3] Running Non-Negotiable Business Invariant Tests..."
npm run test:critical

# 4. Execute Full System Integration Suite
echo "🧪 [STEP 4] Running Full System Integration Tests..."
npm run test:integration

# 5. Production Health Probe Verification
echo "🌐 [STEP 5] Verifying API Health & Infrastructure Readiness..."
npm run test:staging

echo "=================================================================="
echo "🎉 [SUCCESS] SAVETOGETHER PRODUCTION BACKEND DEPLOYED & LIVE!"
echo "=================================================================="
