# 🛡️ SAVETOGETHER DISASTER RECOVERY RUNBOOK & PLAYBOOK (Phase 45)

---

## 1. RECOVERY TARGETS (RPO & RTO)

| Metric | Planning Target | Description |
| :--- | :--- | :--- |
| **RPO (Recovery Point Objective)** | $\le$ 15 Minutes | Maximum allowable data loss window in emergency recovery scenarios. |
| **RTO (Recovery Time Objective)** | $\le$ 1 Hour | Target time to restore full platform availability following major outages. |

---

## 2. AUTOMATED BACKUP ARCHITECTURE

```text
                        PRODUCTION SYSTEM
                                │
          ┌─────────────────────┼─────────────────────┐
          ▼                     ▼                     ▼
     PostgreSQL               Redis                 S3 Bucket
   (savetogether_prod)   (Queue State / Cache) (savetogether-production)
          │                     │                     │
          ▼                     ▼                     ▼
    Automated WAL           Snapshot DB          S3 Versioning &
   Archiving (PITR)          Dump (rdb)          Cross-Region Sync
          │                     │                     │
          └─────────────────────┼─────────────────────┘
                                ▼
                       SECURE BACKUP STORAGE
```

---

## 3. 12 DISASTER RECOVERY PLAYBOOKS

### Scenario 01: Database Corruption / Hardware Crash
1. Trigger failover to hot standby PostgreSQL replica or restore from latest daily dump.
2. Replay Write-Ahead Logs (WAL) to target PITR timestamp prior to corruption event.
3. Validate relational integrity (`Bookings ↔ Payments`, `Referrals ↔ RewardTransactions`).
4. Execute `npm run test:critical` to confirm business invariants.

### Scenario 02: Accidental Data Deletion
1. Restore database snapshot to temporary isolated recovery database (`savetogether_recovery`).
2. Extract targeted deleted rows (`Bookings`, `Users`, or `RewardTransaction` records).
3. Import extracted rows back into production using transactional insert scripts.

### Scenario 03: Failed Database Migration
1. Immediately halt deployment rollout via CI/CD.
2. Rollback backend application code to previous stable release tag (`v1.0.X`).
3. Run backward-compatible schema repair script or restore pre-migration database snapshot.

### Scenario 04: Server / Container Host Crash
1. Provision replacement cloud instance via automated Docker orchestration.
2. Pull latest production image: `docker pull savetogether/api:latest`.
3. Launch container with secrets loaded from Cloud Secret Manager.
4. Run health & readiness checks (`/health`, `/readiness`).

### Scenario 05: Redis Outage
1. Provision new Redis instance; PostgreSQL remains authoritative source of truth.
2. Restart worker containers to re-establish BullMQ queue connections.
3. Rebuild transient application caches.

### Scenario 06: Object Storage (S3) Failure
1. Enable cross-region failover bucket replica (`savetogether-production-backup`).
2. Verify database image URLs match restored storage paths.

### Scenario 07: Payment Gateway Outage (Razorpay)
1. Flag payment Gateway status as `DEGRADED` in Admin Settings.
2. Keep existing bookings safely in `PENDING_PAYMENT` state with extended timeout window.
3. Run payment reconciliation worker once gateway recovers.

### Scenario 08: Secret / Key Compromise
1. Revoke compromised keys immediately in payment/storage provider consoles.
2. Rotate `JWT_SECRET`, `JWT_REFRESH_SECRET`, and gateway keys in Cloud Secret Manager.
3. Force global logout across all active resident sessions (`POST /auth/logout-all`).

### Scenario 09: Bad Application Code Release
1. Revert production container to previous version tag (`docker rollback`).
2. Verify system health via live smoke test suite (`npm run test:production`).

### Scenario 10: Queue Worker Backlog / Stall
1. Scale worker node pool horizontally (`docker-compose up -d --scale worker=3`).
2. Clear dead-letter queue locks and re-enqueue unacknowledged jobs idempotently.

### Scenario 11: DNS Outage
1. Switch primary DNS nameservers to secondary provider fallback.

### Scenario 12: Regional Data Center Outage
1. Execute multi-region failover playbook; point `api.savetogether.in` to secondary region infrastructure.

---

## 4. SECRETS ROTATION & RECOVERY

Secrets must never be stored in code or ordinary backup dumps.
- **JWT Key Rotation:** Rotate `JWT_SECRET` -> invalidates active sessions cleanly -> users re-authenticate via SMS OTP.
- **Payment Keys:** Update Razorpay API & Webhook secrets in backend runtime environment variables.
