# ⭐ SAVETOGETHER — BACKEND DEVELOPER GUIDE & MASTER REFERENCE

> **This document is the single source of truth for the SaveTogether backend architecture, development sequence, and business rules.**

---

## 🎯 Platform Overview

SaveTogether is a **society-based service aggregation and bulk-pricing platform**. Residents in housing societies individually book home services (AC servicing, cleaning, pest control, etc.). The backend automatically aggregates these individual bookings into community demand, unlocking progressively lower pricing tiers as more neighbors participate.

```text
USER A → 2 AC        ┐
USER B → 1 AC        │
USER C → 3 AC        ├─→ ABC Residency + AC = 8 ACs → ₹799/unit
USER D → 2 AC        ┘

USER E → 2 AC        ─→ Total = 10 ACs → ₹699/unit (TIER UNLOCKED!)
```

---

## 🔧 Technology Stack

| Layer | Technology |
|:---|:---|
| Runtime | Node.js 20+ |
| Framework | NestJS / Express |
| Language | TypeScript (strict) |
| Database | PostgreSQL 16 |
| ORM | Prisma |
| Cache / Queue | Redis 7 + BullMQ |
| Authentication | JWT + Refresh Tokens + SMS OTP |
| API Documentation | Swagger / OpenAPI 3.0 |
| Testing | Jest / ts-node test runners |
| Containerization | Docker (multi-stage) |
| API Base Path | `/api/v1` |

---

## 🏗️ Modular Source Architecture

```text
src/
├── auth/                 # SMS OTP, JWT, Refresh Token Rotation, Session Security
├── users/                # User Profile CRUD
├── societies/            # Society Catalog & Validation
├── addresses/            # User Address CRUD with Ownership Guards
├── services/             # Service Category & Catalog
├── pricing/              # Server-Authoritative Tiered Pricing Engine
├── demand/               # Demand Aggregation Engine (Society + Service + Date)
├── demand-campaign/      # Demand Campaign Lifecycle Management
├── bookings/             # Booking Creation, State Machine, Price Snapshots
├── payments/             # Razorpay Order Creation & HMAC Webhook Verification
├── refunds/              # Refund Processing & Reconciliation
├── vendor/               # Vendor Profiles, Rates, & Performance
├── vendor-availability/  # Vendor Schedule & Daily Capacity Management
├── vendor-negotiation/   # Campaign Rate Negotiation Engine
├── vendor-assignment/    # Capacity-Enforced Job Allocation
├── referrals/            # Referral Code Generation & Qualification
├── rewards/              # Immutable Reward Transaction Ledger
├── notifications/        # Push Notification Queue (FCM + BullMQ)
├── complaints/           # Customer Support Ticket System
├── reviews/              # Post-Completion Review & Rating Engine
├── admin/                # RBAC-Guarded Admin Console
├── admin-auth/           # Admin Authentication with 2FA
├── analytics/            # Executive Dashboard & Report Aggregation
├── settings/             # Versioned Platform Configuration
├── audit/                # Immutable Append-Only Audit Trail
├── security/             # Rate Limiting, CORS, Helmet, Input Sanitization
├── monitoring/           # Technical & Business Observability Metrics
├── staging/              # Health & Readiness Probes
├── common/               # Interceptors, Filters, Guards, DTOs, Error Codes
├── config/               # Environment Configuration & Validation
├── database/             # Prisma Client & Transaction Helpers
├── client-sdk/           # Frontend API Client SDK
└── index.ts              # Application Bootstrap
```

---

## 🔥 STRICT DEVELOPMENT DEPENDENCY ORDER

Build in this exact sequence. Do not skip ahead.

### PHASE 1 — Foundation

```text
01  Database Schema (Prisma) → Migration → Indexes → Seed
02  Environment Configuration & Validation
03  Common API Infrastructure (Error Handling, Logging, Validation)
```

### PHASE 2 — Authentication & Core Data

```text
04  User Authentication (OTP → JWT → Refresh → Logout)
05  Society Catalog
06  Address Management (with Ownership Guards)
07  Service Category & Catalog
```

### PHASE 3 — Business Engine (Design Together)

> ⚠️ **Pricing + Demand + Booking must be designed together** because they affect each other's state and concurrency.

```text
08  Pricing Engine (Server-Authoritative Tier Calculation)
09  Demand Aggregation Engine (Atomic, Concurrency-Safe)
10  Booking Engine (State Machine + Price Snapshot)
```

### PHASE 4 — Financial Engine

```text
11  Payment Order Creation
12  Payment Webhook Verification (HMAC SHA-256)
13  Booking Confirmation via Verified Payment
14  Cancellation & Refund Engine
```

### PHASE 5 — Vendor Operations

```text
15  Vendor Profile & Rate Management
16  Vendor Availability & Capacity
17  Vendor Rate Negotiation
18  Vendor Job Assignment (Capacity-Enforced)
```

### PHASE 6 — Engagement & Support

```text
19  Referral Engine
20  Reward Transaction Ledger
21  Notification Queue (BullMQ + FCM)
22  Background Workers
23  Customer Complaints
24  Post-Completion Reviews
```

### PHASE 7 — Administration

```text
25  Admin Authentication & 2FA
26  Admin RBAC
27  Admin Console APIs
28  Analytics & Reports
29  Versioned Settings
30  Audit Logging
```

### PHASE 8 — Production Readiness

```text
31  Security Hardening
32  OpenAPI / Swagger Documentation
33  Multi-Tier Test Suites
34  Frontend API Integration Layer
35  Staging Deployment & Smoke Tests
36  Production Dockerization & Health Probes
37  Monitoring & Alerting
38  Backup & Disaster Recovery
```

---

## 💰 Pricing Engine Specification

Server-authoritative. Client price values are **always ignored**.

| Quantity Range | Unit Price |
|:---|:---|
| 1 – 9 | ₹799 |
| 10 – 19 | ₹699 |
| 20 – 39 | ₹599 |
| 40 – 59 | ₹549 |
| 60+ | ₹499 |

**Input:** `serviceId`, `societyId`, `quantity`

**Output:** `currentTier`, `currentPrice`, `nextTier`, `nextPrice`, `remainingQuantity`, `potentialSavings`

---

## 📊 Demand Engine Specification

Aggregation key: **Society + Service + Service Date**

```text
User A → 2 AC ┐
User B → 1 AC │→ Society ABC + AC Service + Sep 6 = 8 ACs
User C → 3 AC │
User D → 2 AC ┘
```

Must be **concurrency-safe** using PostgreSQL transactions with appropriate locking.

---

## 📋 Booking State Machine

```text
PENDING_PAYMENT → CONFIRMED → DEMAND_AGGREGATING → ADMIN_PROCESSING
→ VENDOR_ASSIGNED → SCHEDULED → IN_PROGRESS → COMPLETED

Cancellation branch:
Any eligible state → CANCELLED → REFUND_PENDING → REFUNDED
```

Frontend **cannot** arbitrarily modify booking status.

---

## 🚨 18 NON-NEGOTIABLE BUSINESS RULES

```text
01  PostgreSQL is the business source of truth.
02  Frontend never decides the final price.
03  Frontend never decides payment success.
04  Frontend cannot change booking status arbitrarily.
05  Frontend cannot bypass RBAC.
06  Users can access only their own protected resources.
07  Payment webhooks must be verified (HMAC SHA-256).
08  Financial operations must be idempotent.
09  Rewards must use an auditable ledger.
10  Demand aggregation must be concurrency-safe.
11  Vendor capacity must be enforced by backend.
12  Historical booking prices must not change when settings change.
13  Every sensitive Admin operation must be audited.
14  Production and staging databases must be separate.
15  Production secrets must never be stored in frontend code.
16  Every production database must have a tested recovery path.
17  Every critical background job must be observable.
18  Don't mark a feature "complete" just because its API works.
    Test the complete business flow.
```

---

## 🧪 Required Test Scenarios

### Pricing Tests
- 9 AC → ₹799
- 10 AC → ₹699
- 20 AC → ₹599
- 40 AC → ₹549
- 60 AC → ₹499

### Demand Tests
- 18 AC + 2 AC = 20 AC (tier transition verified)

### Payment Safety Tests
- Payment failed → Booking NOT confirmed
- Payment webhook verified → Booking confirmed
- Duplicate webhook → No duplicate financial effect

### Security Tests
- User A cannot access User B's booking/address
- SUPPORT_ADMIN cannot approve financial refunds

### Concurrency Tests
- 19 AC demand + two simultaneous +1 bookings → Final demand = 21

### Vendor Capacity Tests
- Vendor capacity = 30, assignment of 31 → Backend rejects

---

## ✅ Golden Path Definition of Done

The backend is complete when this end-to-end flow works against real PostgreSQL:

```text
User → OTP → Profile → Society → Service → Quantity
→ Server Pricing → Demand Aggregation → Booking → Price Snapshot
→ Payment → Verified Webhook → Booking Confirmed
→ Admin Demand → Vendor Selection → Negotiation → Assignment
→ Schedule → Service → Completed → Review
→ Referral Reward → Notification → Analytics
```
