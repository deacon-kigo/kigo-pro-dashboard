# Offer Manager - Production Data Flow & Endpoints Mapping

**Purpose**: Map out data flow from kigo-pro-dashboard UI to kigo-core-server production APIs
**Status**: 🟡 Partially Implemented (Read APIs exist, Admin Write APIs needed)
**Last Updated**: October 16, 2025

---

## 🎯 Overview

This document maps the Offer Manager UI requirements from the BRD to actual production endpoints, data models, and database layers in the Kigo ecosystem.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│             kigo-pro-dashboard (Next.js 15)                     │
│  ┌────────────────────┐      ┌──────────────────────────────┐  │
│  │  Offer Manager UI  │ ───► │  CopilotKit CoAgent          │  │
│  │  - Forms           │      │  - Natural language input    │  │
│  │  - Conversation    │      │  - LangGraph workflow        │  │
│  └────────────────────┘      └──────────────────────────────┘  │
│                │                        │                       │
│                └────────────────────────┘                       │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            │ HTTP/REST
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│           kigo-core-server (Rust + Axum + Diesel)               │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Handlers (API Layer)                   │  │
│  │  /dashboard/offers/   (Admin APIs)                       │  │
│  │  /api/v1/offers/      (Public APIs - Read Only)          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                   │
│                            ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  Domain Layer                             │  │
│  │  kigo-domains/offers_manager/                            │  │
│  │  - Business logic orchestration                          │  │
│  │  - Message passing between layers                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                   │
│                            ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Database Layer (Diesel ORM)                  │  │
│  │  kigo-databases/                                          │  │
│  │  - entertainment_mom models                              │  │
│  │  - kigo_db models                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────── │
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL Databases                          │
│                                                                 │
│  ┌───────────────────────┐    ┌──────────────────────────┐    │
│  │   ent_mom_db          │    │     kigo_db              │    │
│  │                       │    │                          │    │
│  │  • offers             │    │  • programs              │    │
│  │  • offer_types        │    │  • program_campaigns     │    │
│  │  • merchants          │    │  • partners              │    │
│  │  • redemptions        │    │                          │    │
│  │  • promo_codes        │    │                          │    │
│  └───────────────────────┘    └──────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Models & Endpoints

### 1. Offer Creation Flow

#### BRD Requirement

User needs to create an offer with:

- Business objective
- Program type (Closed Loop / Open Loop / Hybrid)
- Offer details (type, value, title, description)
- Redemption method (Promo Code / Show & Save / Barcode / Online Link)
- Distribution channels (Hub Airdrops / Marketplace / Activation Links / Promo Code Redemption)

#### Production Endpoints

**✅ Existing: Get Offers (List)**

```
GET /dashboard/offers
Auth: Admin session required
```

**Handler**: `repositories/kigo-core-server/src/handlers/dashboard/offers/offers/get_offers.rs`

**Query Parameters**:

```typescript
interface GetOffersInput {
  merchant_owner?: number; // Filter by merchant
  offer_status?: string; // "active" | "inactive" | "expired"
  short_text?: string; // Search by offer title/description
  limit: number; // Max 100
  offset: number; // For pagination
}
```

**Response**:

```typescript
interface OfferListPayload {
  offers: OfferWithDescriptivePayload[];
  total_count: number;
  limit: number;
  offset: number;
}

interface OfferWithDescriptivePayload {
  offer_id: number;
  merchant_owner: number;
  version_active_from: string; // ISO date
  default_language: string; // "en", "es", etc.
  external_reference?: string;
  offer_expiry_date?: string;
  offer_status: string;
  offer_type: string;
  offer_redemption_methods: string[];
  edition_exclusivity?: string;
  code_type: string; // Single character
  clickthru_url?: string;
  classification?: string;

  // Descriptive data (from offer_descriptives table)
  short_text?: string;
  long_text?: string;
  terms_conditions?: string;
  image_url?: string;
  savings_amount?: string;
  savings_type?: string; // "percentage" | "fixed"
}
```

---

**✅ Existing: Create Offer**

```
POST /dashboard/offers
Auth: Admin session required
Content-Type: application/json
```

**Handler**: `repositories/kigo-core-server/src/handlers/dashboard/offers/offers/create_offer.rs`

**Request Body**:

```typescript
interface CreateOfferInput {
  version_active_from: string; // ISO date (required)
  merchant_owner: number; // Merchant ID (required)
  default_language: string; // Language code (required)
  external_reference?: string; // External system reference
  offer_expiry_date?: string; // ISO date (optional)
  offer_status?: string; // "active" | "inactive"
  offer_type?: string; // Type identifier
  offer_redemption_methods: string[]; // ["promo_code", "show_save", etc.]
  edition_exclusivity?: string;
  code_type: string; // MUST be single character
  clickthru_url?: string; // URL for online redemption
  classification?: string;
}
```

**Response**: `201 Created`

```typescript
interface OfferPayload {
  offer_id: number;
  merchant_owner: number;
  // ... same fields as CreateOfferInput
  created_at: string;
  updated_at: string;
}
```

**Error Responses**:

- `400`: Invalid code_type (must be single character)
- `500`: Internal server error

---

**✅ Existing: Update Offer**

```
PUT /dashboard/offers/{offer_id}
Auth: Admin session required
```

**Handler**: `repositories/kigo-core-server/src/handlers/dashboard/offers/offers/update_offer.rs`

---

**✅ Existing: Get Offer By ID**

```
GET /dashboard/offers/{offer_id}
Auth: Admin session required
```

**Handler**: `repositories/kigo-core-server/src/handlers/dashboard/offers/offers/get_offer_by_id.rs`

---

**✅ Existing: Delete Offer**

```
DELETE /dashboard/offers/{offer_id}
Auth: Admin session required
```

**Handler**: `repositories/kigo-core-server/src/handlers/dashboard/offers/offers/delete_offer.rs`

---

### 2. Offer Types Management

**✅ Existing: Get Offer Types**

```
GET /dashboard/offers/types
Auth: Admin session required
```

**Handler**: `repositories/kigo-core-server/src/handlers/dashboard/offers/types/get_offer_types.rs`

**Response**:

```typescript
interface OfferType {
  offer_type_id: number;
  type_name: string; // "discount", "cashback", "bogo", etc.
  type_description?: string;
  is_active: boolean;
}
```

---

**✅ Existing: Create Offer Type**

```
POST /dashboard/offers/types
```

**✅ Existing: Update Offer Type**

```
PUT /dashboard/offers/types/{type_id}
```

**✅ Existing: Delete Offer Type**

```
DELETE /dashboard/offers/types/{type_id}
```

---

### 3. Redemption Controls

**✅ Existing: Get Redemption Controls**

```
GET /dashboard/offers/redemption-controls
Auth: Admin session required
```

**Handler**: `repositories/kigo-core-server/src/handlers/dashboard/offers/redemption_controls/get_redemption_controls.rs`

**Purpose**: Manage usage limits, location restrictions, and redemption rules

---

**✅ Existing: Create Redemption Control**

```
POST /dashboard/offers/redemption-controls
```

**✅ Existing: Update Redemption Control**

```
PUT /dashboard/offers/redemption-controls/{control_id}
```

**✅ Existing: Delete Redemption Control**

```
DELETE /dashboard/offers/redemption-controls/{control_id}
```

---

### 4. Promo Codes Management

**✅ Existing: Promo Codes Endpoints**

```
GET /dashboard/promo-codes
POST /dashboard/promo-codes
PUT /dashboard/promo-codes/{code_id}
DELETE /dashboard/promo-codes/{code_id}
```

**Handler**: `repositories/kigo-core-server/src/handlers/dashboard/promo_codes.rs`

---

### 5. Campaign Management (Programs)

**🟡 Partially Implemented: Programs in kigo_db**

**Database**: `kigo_db.programs`
**Schema**: `docs/tech/data/dictionary/redshift/postgres-kigo/programs-schema.md`

**Key Fields**:

```sql
programs (
  program_id BIGSERIAL PRIMARY KEY,
  program_name VARCHAR,
  program_type VARCHAR,              -- "closed_loop" | "open_loop" | "hybrid"
  program_status VARCHAR,
  partner_id BIGINT,                 -- FK to partners table
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

**⚠️ Missing Endpoints**:

- `GET /dashboard/programs` - List programs
- `POST /dashboard/programs` - Create program
- `GET /dashboard/programs/{id}/campaigns` - Get campaigns for program

---

### 6. Merchants Management

**✅ Existing: Merchant data in ent_mom_db**

**Database**: `ent_mom_db.merchants`
**Schema**: `docs/tech/data/dictionary/redshift/postgres-mom/merchant-schema.md`

**Key Tables**:

```sql
merchants (
  merchant_id BIGSERIAL PRIMARY KEY,
  merchant_name VARCHAR,
  merchant_type VARCHAR,
  status VARCHAR,
  primary_category_id INT
)

merchant_locations (
  location_id BIGSERIAL PRIMARY KEY,
  merchant_id BIGINT,
  address_line1 VARCHAR,
  city VARCHAR,
  state VARCHAR,
  postal_code VARCHAR,
  latitude DECIMAL,
  longitude DECIMAL
)
```

**⚠️ Missing Admin Endpoints**:

- Currently only public `/api/v1/merchants` exists
- Need `/dashboard/merchants` for admin CRUD

---

## 🔄 Data Flow: Creating an Offer (End-to-End)

### Step 1: User Input (UI Layer)

```typescript
// User fills form in kigo-pro-dashboard
const formData = {
  businessObjective: "Increase Q4 sales by 20%",
  programType: "closed_loop", // John Deere
  targetAudience: ["dealers", "fleet"],
  maxDiscount: "20",
  maxDiscountUnit: "%",
  totalBudget: "50000",
  startDate: "2025-12-01",
  endDate: "2025-12-31",

  // Offer details
  offerType: "percentage_discount",
  offerValue: "20",
  offerTitle: "Q4 Dealer Incentive",
  offerDescription: "20% off all equipment purchases",
  termsConditions: "Valid for authorized dealers only",

  // Redemption
  redemptionMethod: "promo_code",
  promoCode: "DEALER20",
  usageLimitPerCustomer: "3",
  totalUsageLimit: "1000",
};
```

### Step 2: AI Agent Processing (LangGraph)

```python
# Backend: offer_manager.py

async def handle_goal_setting(state):
    # Extract business objective
    # Detect program type
    # Return recommendations

async def handle_offer_creation(state):
    # AI suggests offer type and value
    # Based on industry benchmarks

async def handle_validation(state):
    # Check budget limits
    # Validate promo code format
    # Check brand guidelines
```

### Step 3: API Call (kigo-pro-dashboard → kigo-core-server)

```typescript
// Frontend makes API call
const response = await fetch("https://api.kigo.io/dashboard/offers", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${adminToken}`,
  },
  body: JSON.stringify({
    version_active_from: formData.startDate,
    merchant_owner: merchantId,
    default_language: "en",
    external_reference: `PROMO_${Date.now()}`,
    offer_expiry_date: formData.endDate,
    offer_status: "active",
    offer_type: formData.offerType,
    offer_redemption_methods: [formData.redemptionMethod],
    code_type: "P", // "P" for promo code
    clickthru_url: null,
    classification: formData.programType,
  }),
});
```

### Step 4: Domain Layer Processing

```rust
// kigo-core-server Handler
pub async fn create_offer(
    State(state): State<Arc<AppState>>,
    Extension(admin): Extension<AdminAuthMiddlewarePayload>,
    Json(input): Json<CreateOfferInput>,
) -> Response {
    // Validate input
    if input.code_type.len() != 1 {
        return error!("Code type must be single character");
    }

    // Send to domain layer
    let msg = CreateOffer { /* ... */ };
    let offer = state.domains.offers_manager.send_message(msg).await?;

    // Return created offer
    http_response!(StatusCode::CREATED, OfferPayload::from(offer))
}
```

### Step 5: Database Persistence

```rust
// kigo-domains/offers_manager
impl OffersManager {
    async fn create_offer(&self, msg: CreateOffer) -> Result<Offer> {
        // Insert into ent_mom_db.offers table
        let offer = diesel::insert_into(offers::table)
            .values(&new_offer)
            .get_result(&mut conn)?;

        // Create descriptive entry
        diesel::insert_into(offer_descriptives::table)
            .values(&descriptive)
            .execute(&mut conn)?;

        // Create promo code if needed
        if msg.offer_redemption_methods.contains("promo_code") {
            create_promo_code(&offer).await?;
        }

        Ok(offer)
    }
}
```

### Step 6: Database Tables Updated

```sql
-- ent_mom_db.offers
INSERT INTO offers (
  merchant_owner,
  version_active_from,
  offer_status,
  offer_type,
  code_type,
  -- ...
) VALUES (123, '2025-12-01', 'active', 'percentage_discount', 'P');

-- ent_mom_db.offer_descriptives
INSERT INTO offer_descriptives (
  offer_id,
  language_code,
  short_text,
  long_text,
  terms_conditions
) VALUES (456, 'en', 'Q4 Dealer Incentive', '20% off...', 'Valid for...');

-- ent_mom_db.promo_codes
INSERT INTO promo_codes (
  promo_code,
  offer_id,
  code_type,
  usage_limit,
  redemption_count
) VALUES ('DEALER20', 456, 'single', 1000, 0);

-- kigo_db.program_campaigns (if linked to campaign)
INSERT INTO program_campaigns (
  program_id,
  campaign_name,
  campaign_type,
  start_date,
  end_date
) VALUES (789, 'Q4 Dealer Incentive', 'offer_based', '2025-12-01', '2025-12-31');
```

---

## 🚧 Missing Endpoints & Gaps

### Critical Gaps for MVP

#### 1. Program Management

**Status**: ⚠️ **Not Implemented**

```
POST /dashboard/programs
GET /dashboard/programs
GET /dashboard/programs/{id}
PUT /dashboard/programs/{id}
```

**Workaround**: For MVP, hardcode program mappings in UI or use classification field

#### 2. Offer Descriptives Management

**Status**: ⚠️ **Partial** (created with offer, but no separate CRUD)

```
PUT /dashboard/offers/{id}/descriptives
POST /dashboard/offers/{id}/descriptives  # Add translations
```

**Current**: Descriptives created automatically when offer is created
**Gap**: Can't update title/description separately

#### 3. Campaign-Offer Linking

**Status**: ⚠️ **Not Implemented**

```
POST /dashboard/campaigns
POST /dashboard/campaigns/{id}/offers   # Link offer to campaign
GET /dashboard/campaigns/{id}/offers
```

**Workaround**: Use external_reference field to track campaign association

#### 4. Customer List Upload (BRD Requirement)

**Status**: ❌ **Not Implemented**

```
POST /dashboard/offers/{id}/customer-lists
  Body: { customers: [email, phone, user_id, ...] }
```

**Gap**: No API to upload target customer list for closed-loop offers

#### 5. Offer Analytics

**Status**: ⚠️ **Partial** (redemption data exists, no aggregated endpoints)

```
GET /dashboard/offers/{id}/analytics
  Response: {
    total_redemptions: number,
    unique_users: number,
    revenue_generated: number,
    conversion_rate: number,
    redemptions_by_day: []
  }
```

**Gap**: Analytics exist in database but no aggregated endpoints

---

## 📋 Complete Endpoint Inventory

### ✅ Fully Implemented (Production Ready)

| Endpoint                                | Method              | Purpose                 | Handler                    |
| --------------------------------------- | ------------------- | ----------------------- | -------------------------- |
| `/dashboard/offers`                     | GET                 | List offers             | `get_offers.rs`            |
| `/dashboard/offers`                     | POST                | Create offer            | `create_offer.rs`          |
| `/dashboard/offers/{id}`                | GET                 | Get offer details       | `get_offer_by_id.rs`       |
| `/dashboard/offers/{id}`                | PUT                 | Update offer            | `update_offer.rs`          |
| `/dashboard/offers/{id}`                | DELETE              | Delete offer            | `delete_offer.rs`          |
| `/dashboard/offers/types`               | GET/POST/PUT/DELETE | Manage offer types      | `types/*.rs`               |
| `/dashboard/offers/redemption-controls` | GET/POST/PUT/DELETE | Manage redemption rules | `redemption_controls/*.rs` |
| `/dashboard/promo-codes`                | GET/POST/PUT/DELETE | Manage promo codes      | `promo_codes.rs`           |

### 🟡 Partially Implemented (Data exists, endpoints partial)

| Endpoint                           | Status  | Notes                                           |
| ---------------------------------- | ------- | ----------------------------------------------- |
| `/dashboard/programs`              | Missing | Data in kigo_db.programs, no admin endpoints    |
| `/dashboard/merchants`             | Partial | Only public `/api/v1/merchants` exists          |
| `/dashboard/campaigns`             | Missing | Data in kigo_db.program_campaigns, no endpoints |
| `/dashboard/offers/{id}/analytics` | Missing | Redemption data exists, needs aggregation       |

### ❌ Not Implemented (BRD Requirements)

| Endpoint                                | Purpose                          | Priority |
| --------------------------------------- | -------------------------------- | -------- |
| `/dashboard/offers/{id}/customer-lists` | Upload target customers          | High     |
| `/dashboard/offers/{id}/preview`        | Preview offer in Hub/Marketplace | Medium   |
| `/dashboard/offers/bulk-create`         | Create multiple offers           | Low      |
| `/dashboard/offers/{id}/duplicate`      | Duplicate existing offer         | Medium   |

---

## 🎯 Recommended Implementation Priority

### Phase 1: MVP (Now - December 2025)

Focus on existing endpoints + minimal new ones

1. **Use existing offer creation endpoint** ✅
2. **Add program lookup helper** (client-side mapping)
3. **Build UI around current API shape**
4. **Workaround**: Use `external_reference` for campaign tracking
5. **Workaround**: Use `classification` field for program type

### Phase 2: Enhanced Features (Q1 2026)

Add missing admin endpoints

1. Implement `/dashboard/programs` CRUD
2. Add `/dashboard/campaigns` endpoints
3. Build customer list upload
4. Add analytics aggregation endpoints

### Phase 3: Advanced Features (Q2 2026)

Power user features

1. Bulk operations
2. Offer templates
3. A/B testing support
4. Advanced analytics

---

## 🔑 Key Takeaways for UI Development

1. **✅ Core offer CRUD works today** - Use POST `/dashboard/offers`
2. **⚠️ Program association is manual** - Use `classification` field or external_reference
3. **✅ Redemption methods fully supported** - promo_code, show_save, barcode, online_link
4. **⚠️ No customer list upload yet** - Document manually or use external system
5. **✅ All data models exist** - Just some admin endpoints missing

---

## 📚 Related Documentation

- [Offer Schema](../../nexus/docs/tech/data/dictionary/redshift/postgres-mom/offer-schema.md)
- [Programs Schema](../../nexus/docs/tech/data/dictionary/redshift/postgres-kigo/programs-schema.md)
- [Kigo Offers API](../../nexus/docs/tech/technical-documentation/kigo-offers-api/introduction.md)
- [BRD: Offer Manager](./brd/offer-manager.md)

---

**Next Steps**:

1. Build UI against existing POST `/dashboard/offers` endpoint
2. Use classification field to track program type
3. File tickets for missing endpoints (programs, campaigns, customer lists)
4. Document workarounds for MVP launch
