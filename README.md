# SaveTogether

> **Society-based service aggregation and bulk-pricing platform.**

Residents in housing societies individually book home services (AC servicing, cleaning, pest control, etc.). SaveTogether automatically aggregates these individual bookings into community demand, unlocking progressively lower pricing tiers as more neighbors participate.

## Architecture

```text
┌──────────────────────────────────────────────┐
│               SAVETOGETHER                   │
│                                              │
│   Mobile App (Expo)     Admin Web (Vite)     │
│        │                     │               │
│        └──────────┬──────────┘               │
└───────────────────┼──────────────────────────┘
                    │
                    ▼
               API Server
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
    PostgreSQL    Redis       S3
                    │
                    ▼
                 BullMQ
```

## Project Structure

```text
savetogether/
├── backend/          # NestJS API Server
├── frontend/         # Expo Mobile App + Admin Web
├── docs/             # Architecture & Release Documentation
├── .gitignore
└── README.md
```

## Technology Stack

| Layer | Technology |
|:---|:---|
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL 16, Prisma ORM |
| Cache/Queue | Redis 7, BullMQ |
| Mobile | React Native, Expo |
| Admin | React, Vite |
| Auth | JWT + SMS OTP |
| Payments | Razorpay |
| Docs | Swagger / OpenAPI 3.0 |

## Pricing Tiers

| Quantity | Unit Price |
|:---|:---|
| 1–9 | ₹799 |
| 10–19 | ₹699 |
| 20–39 | ₹599 |
| 40–59 | ₹549 |
| 60+ | ₹499 |

## Quick Start

### Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Frontend (Mobile)

```bash
cd frontend
npm install
npx expo start
```

## Testing

```bash
cd backend
npm run test:critical    # 7 non-negotiable business invariants
npm run test             # E2E full system journey
npm run test:integration # Frontend ↔ Backend integration
npm run test:staging     # Staging smoke test
npm run test:production  # Production verification
npm run test:monitoring  # Observability suite
npm run test:recovery    # Disaster recovery drill
```

## License

Private — All rights reserved.
