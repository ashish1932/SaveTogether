# 🔌 SaveTogether V1.0.0 — Frontend ↔ Staging Backend Integration Matrix

**Environment Target:** Staging (`https://api-staging.savetogether.in/api/v1`)  
**Status:** ✅ **VERIFIED & INTEGRATED**  
**Rule Enforced:** The backend is the single source of truth. Frontend displays server-calculated values and does not make financial decisions.

---

## 📱 Mobile App (Resident Portal) Integration Matrix

| Module | UI Component / Screen | Endpoint(s) | Staging Status | Verification Result |
|:---|:---|:---|:---|:---|
| **01. Auth** | PhoneInput, OtpInput | `POST /auth/send-otp`<br>`POST /auth/verify-otp`<br>`POST /auth/refresh`<br>`POST /auth/logout` | ✅ Pass | Phone OTP verification issues JWT + Refresh Tokens cleanly. |
| **02. Profile** | ProfileScreen | `GET /users/profile`<br>`PUT /users/profile`<br>`POST /users/profile/avatar` | ✅ Pass | Resident profile loaded and updated from backend. |
| **03. Society** | SocietySelectionScreen | `GET /societies`<br>`GET /societies/:id` | ✅ Pass | Society catalog populated from Staging PostgreSQL. |
| **04. Address** | AddressCard, DeleteAddressModal | `GET /addresses`<br>`POST /addresses`<br>`DELETE /addresses/:id` | ✅ Pass | User addresses loaded with object-level ownership protection. |
| **05. Services** | ServiceCard, HomeScreen | `GET /services/categories`<br>`GET /services`<br>`GET /services/:id` | ✅ Pass | Active categories and services returned from backend API. |
| **06. Pricing** | PricingLadder, PriceCard | `POST /pricing/quote`<br>`GET /pricing/tiers/:serviceId` | ✅ Pass | **Server-Authoritative:** Tier unit prices (9→₹799, 10→₹699) calculated exclusively by backend. |
| **07. Demand** | DemandProgressBar, DemandOpportunityCard | `GET /demand/opportunities`<br>`GET /demand/campaigns/:id` | ✅ Pass | Real-time aggregate demand rendered per Society + Service. |
| **08. Booking** | BookingTimeline, QuantitySelector | `POST /bookings`<br>`GET /bookings/:id` | ✅ Pass | Booking creation locks unitPrice snapshot in backend. |
| **09. Payment** | PaymentSummaryCard | `POST /payments/create-order`<br>`POST /payments/verify`<br>`POST /payments/webhook` | ✅ Pass | Razorpay sandbox order creation & HMAC webhook verification. |
| **10. Booking Mgmt** | BookingHistoryScreen | `GET /bookings`<br>`POST /bookings/:id/cancel`<br>`POST /bookings/:id/reschedule` | ✅ Pass | Booking status transitions enforced by backend state machine. |
| **11. Notifications** | NotificationList | `GET /notifications`<br>`POST /notifications/fcm-token` | ✅ Pass | Transactional push notifications triggered on booking state changes. |
| **12. Referral** | ShareReferralSheet, ReferralBanner | `GET /referrals`<br>`POST /referrals/attribute` | ✅ Pass | Unique referral code generation & attribution. |
| **13. Rewards** | WalletScreen | `GET /rewards/wallet`<br>`GET /rewards/transactions` | ✅ Pass | Immutable reward transaction ledger loaded from backend. |
| **14. Support** | ComplaintsScreen | `POST /support/complaints`<br>`GET /support/my-complaints` | ✅ Pass | Customer support complaints created & tracked. |
| **15. Reviews** | ReviewModal | `POST /reviews`<br>`GET /reviews/service/:serviceId` | ✅ Pass | **1-per-booking:** Review submission allowed only on COMPLETED bookings. |

---

## 🖥️ Admin Web (Console Portal) Integration Matrix

| Module | UI Component / Screen | Endpoint(s) | Staging Status | Verification Result |
|:---|:---|:---|:---|:---|
| **16. Admin Auth** | AdminLoginForm, TwoFactorModal | `POST /admin/auth/login`<br>`POST /admin/auth/2fa/verify` | ✅ Pass | Admin authentication with 2FA TOTP challenge. |
| **17. Overview** | ExecutiveDashboard | `GET /admin/overview` | ✅ Pass | Executive metrics aggregate live GMV, bookings, & savings. |
| **18. User Mgmt** | UserTable, UserDetailModal | `GET /admin/users` | ✅ Pass | Resident accounts list with block/unblock controls. |
| **19. Societies** | SocietyManagement | `GET /societies`<br>`POST /societies` | ✅ Pass | Society onboarding and flat capacity management. |
| **20. Services** | ServiceCatalogMgmt | `GET /services`<br>`POST /services` | ✅ Pass | Service pricing tier management. |
| **21. Demand Mgmt** | DemandCampaignTable | `GET /admin/demand/campaigns`<br>`POST /admin/demand/campaigns/:id/process` | ✅ Pass | Active campaign processing & threshold triggers. |
| **22. Vendors** | VendorDirectory | `GET /vendors`<br>`POST /vendors` | ✅ Pass | Vendor directory, services, and daily capacity allocation. |
| **23. Assignment** | VendorAssignmentModal | `GET /demand-campaigns/:id/vendor-options`<br>`POST /demand-campaigns/:id/assign-vendor` | ✅ Pass | Capacity-enforced job allocation to eligible vendors. |
| **24. Payments** | PaymentReconciliationTable | `GET /payments/:id` | ✅ Pass | Payment transactions audit & gateway reconciliation. |
| **25. Refunds** | RefundApprovalModal | `GET /admin/refunds`<br>`POST /admin/refunds/:id/retry` | ✅ Pass | **RBAC Guarded:** Refund approval restricted to FINANCE_ADMIN/SUPER_ADMIN. |
| **26. Referrals** | ReferralFraudTable | `GET /admin/referrals`<br>`POST /admin/referrals/:id/fraud-review` | ✅ Pass | Fraud detection review for flagged referrals. |
| **27. Reports** | AnalyticsReportsView | `GET /analytics/summary`<br>`GET /analytics/revenue` | ✅ Pass | Business performance, revenue, & savings reports. |
| **28. Settings & Audit** | SettingsForm, AuditLogTable | `GET /settings`<br>`PUT /settings`<br>`GET /audit/logs` | ✅ Pass | Immutable append-only audit trail logging all sensitive operations. |

---

## 🔒 Security, Error & Token Expiry Handling

1. **401 Access Token Expiration & Refresh Flow:**
   - Frontend HTTP client automatically intercepts `401 Unauthorized`.
   - Sends `POST /auth/refresh` with refresh token.
   - Retries original request with new access token seamlessly.
2. **Error Format Consistency:**
   - All backend errors return `{ success: false, error: { code, message, details }, requestId }`.
   - Frontend renders descriptive user messages based on error code.
3. **Idempotency Safeguards:**
   - Payment order creation and webhook calls include unique idempotency headers to prevent duplicate charges.

---

## 🎯 Acceptance Status: PASSED FOR STAGING QA

All 28 frontend-backend integration points verified against Staging API specifications. Proceed to **Step 5 — Business Logic & Security E2E QA**.
