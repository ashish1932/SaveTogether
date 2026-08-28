# 🌍 SaveTogether — Multi-Environment Infrastructure Architecture & Isolation Reference

> **This document defines the strict resource isolation, environment parameters, safety guards, and credential separation rules for Local, Staging, and Production environments.**

---

## 🔒 Non-Negotiable Environment Isolation Matrix

| Resource | Local (Development) | Staging | Live Production |
|:---|:---|:---|:---|
| **Target Audience** | Developers / Local QA | Pre-release QA / E2E Integration | Real Customers / Vendors |
| **Node Environment** | `development` | `staging` | `production` |
| **Database Instance** | `savetogether_dev` | `savetogether_staging` | `savetogether_production` |
| **Database Host** | `localhost:5432` | `staging-db.internal:5432` | `prod-db-cluster.internal:5432` (SSL Required) |
| **Database Credentials** | Local Dev Credentials | Dedicated Staging Credentials | Dedicated High-Entropy Prod Credentials |
| **Redis Instance** | Local Redis (`localhost:6379`) | Staging Redis (`staging-redis.internal:6379`) | Prod Redis Cluster (`prod-redis.internal:6379`) |
| **S3 Storage Bucket** | `savetogether-media-storage-dev` | `savetogether-media-storage-staging` | `savetogether-media-storage-production` |
| **AWS Credentials** | Mock / IAM Dev User | Staging IAM User | Production IAM Restricted User |
| **Firebase FCM** | `savetogether-dev-fcm` | `savetogether-staging-fcm` | `savetogether-prod-fcm` |
| **Payment Gateway** | Razorpay Sandbox (`rzp_test_*`) | Razorpay Sandbox (`rzp_test_*`) | Razorpay LIVE (`rzp_live_*`) |
| **OTP SMS Gateway** | Mock / Sandbox Gateway | Staging Test SMS Gateway | Live SMS Provider (MSG91) |
| **JWT Secrets** | Dev Secret Key | Dedicated Staging Secret Key | High-Entropy Production Secret Key (≥64 chars) |
| **API Domain** | `http://localhost:5000/api/v1` | `https://api-staging.savetogether.in/api/v1` | `https://api.savetogether.in/api/v1` |
| **Admin Web Domain** | `http://localhost:3000` | `https://admin-staging.savetogether.in` | `https://admin.savetogether.in` |

---

## 🛡️ Production Safety Guards & Enforcement Mechanisms

To guarantee that accidental data mutation or cross-environment resource contamination can never happen:

### 1. Database Seed Safety Guard (`prisma/seed.ts`)
- Execution against `NODE_ENV=production` is strictly **blocked** by default.
- Will fail with `⛔ SEED SAFETY GUARD BLOCKED EXECUTION` unless `ALLOW_PRODUCTION_SEED=true` is explicitly provided.

### 2. Environment Startup Validation (`src/config/env.validation.ts`)
- When running in `production` or `staging`, the backend verifies:
  1. `DATABASE_URL` does NOT contain `savetogether_db` or `localhost`.
  2. `JWT_SECRET` does NOT use default development fallback strings.
  3. All required production secrets (`AWS_ACCESS_KEY_ID`, `PAYMENT_KEY_ID`, etc.) are explicitly present.
- If any check fails, startup immediately aborts with exit code 1.

### 3. Redis Queue Isolation (BullMQ)
- Each environment connects to its own isolated Redis instance.
- Prevents Staging worker processes from accidentally popping or executing jobs from Production queues.

### 4. FCM Push Notification Isolation
- Separate Firebase projects per environment ensure test push notifications are never sent to real app users.

---

## 📂 Environment File Templates

- **Local:** [`backend/.env.development.example`](file:///home/ashish-kumar/Videos/MULTI%20SERVICE%20/backend/.env.development.example)
- **Staging:** [`backend/.env.staging.example`](file:///home/ashish-kumar/Videos/MULTI%20SERVICE%20/backend/.env.staging.example)
- **Production:** [`backend/.env.production.example`](file:///home/ashish-kumar/Videos/MULTI%20SERVICE%20/backend/.env.production.example)

---

## 🚀 Environment Switch Quick-Reference

### Running Local Development:
```bash
cd backend
NODE_ENV=development npm run dev
```

### Running Staging Smoke & Verification:
```bash
cd backend
NODE_ENV=staging npm run test:staging
```

### Running Production Verification:
```bash
cd backend
NODE_ENV=production npm run test:production
```
