# 🚀 SaveTogether Backend Services

Enterprise REST API Engine for SaveTogether — Bulk Service Booking & Society Demand Aggregation Platform.

---

## 🛠️ Technology Stack
- **Framework:** Node.js + Express / NestJS Architecture with TypeScript
- **Database ORM:** PostgreSQL + Prisma ORM (`prisma/schema.prisma`)
- **Cache & Queue:** Redis + BullMQ
- **Authentication:** JWT Access/Refresh Tokens & SMS OTP Provider
- **Storage & Push:** AWS S3 Compatible Object Storage & Firebase Cloud Messaging (FCM)
- **Deployment:** Docker & docker-compose

---

## 📂 Project Directory Structure

```text
backend/
├── src/
│   ├── auth/           # User & Admin OTP / 2FA Auth Handlers
│   ├── users/          # Resident User Profiles & Wallet
│   ├── societies/      # Master Societies & Address Mapping
│   ├── categories/     # Service Categories & Definition Catalog
│   ├── services/       # Services & Price Calculation Engine
│   ├── pricing/        # Dynamic Bulk Pricing Tier Calculator
│   ├── demand/         # Society Demand Aggregation Engine
│   ├── bookings/       # Order Lifecycle & State Machine
│   ├── payments/       # Gateway Integration & Refund Processing
│   ├── vendors/        # Vendor Management & Rate Assignment
│   ├── referrals/      # Growth Engine & Fraud Oversight
│   ├── notifications/  # Transactional Push Dispatch
│   ├── complaints/     # Support Ticket System & Chat
│   ├── analytics/      # Business Intelligence Reports
│   ├── settings/       # Platform Settings & Security Audit Logs
│   ├── common/         # Global Pipes, Filters, Interceptors
│   └── index.ts        # Server Entrypoint
├── prisma/
│   └── schema.prisma   # PostgreSQL Database Schema
├── Dockerfile          # Multi-stage Containerization
├── docker-compose.yml  # Local Infra Orchestration (PostgreSQL, Redis, API)
├── .env                # Environment Variables Config
└── package.json
```

---

## 🚦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env` and fill in credentials:
```bash
cp .env.example .env
```

### 3. Local Development Server
```bash
npm run dev
```
API running live at: **http://localhost:5000**
Health check endpoint: **http://localhost:5000/api/health**
