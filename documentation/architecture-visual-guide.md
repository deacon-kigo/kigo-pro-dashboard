# Modular Architecture Visual Guide

## System Overview

```
┌────────────────────────────────────────────────────────────────┐
│                     KIGO PRO DASHBOARD                          │
│                   Modular Architecture                          │
└────────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
    ┌───▼────┐         ┌────▼───┐         ┌────▼────┐
    │MERCHANTS│         │ OFFERS │         │CAMPAIGNS│
    │ Module  │────────▶│ Module │────────▶│ Module  │
    └─────────┘         └────────┘         └─────────┘
        │                   │                    │
        │                   │                    │
    Data flows left to right, but each module  │
    │ can operate independently                 │
    └───────────────────────────────────────────┘
```

## Module Relationships

```
                    ┌──────────────────────────────┐
                    │   STANDALONE USAGE           │
                    │  (CRUD Operations)           │
                    └──────────────────────────────┘
                              │
                              │
            ┌─────────────────┼─────────────────┐
            │                 │                 │
            │                 │                 │
    ┌───────▼────────┐ ┌──────▼──────┐ ┌───────▼────────┐
    │   MERCHANTS    │ │   OFFERS    │ │   CAMPAIGNS    │
    │                │ │             │ │                │
    │ • List         │ │ • List      │ │ • List         │
    │ • Create       │ │ • Create    │ │ • Create       │
    │ • Edit         │ │ • Edit      │ │ • Edit         │
    │ • Delete       │ │ • Delete    │ │ • Delete       │
    │ • Locations    │ │ • Duplicate │ │ • Publish      │
    │ • Contracts    │ │ • Templates │ │ • Pause/End    │
    └────────────────┘ └─────────────┘ └────────────────┘
            │                 │                 │
            │                 │                 │
            └─────────────────┼─────────────────┘
                              │
                              │
                    ┌─────────▼──────────┐
                    │  WIZARD COMPOSITION  │
                    │  (Combined Workflows)│
                    └──────────────────────┘
```

## Data Layer Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                          │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │  Merchants  │  │   Offers    │  │  Campaigns  │          │
│  │    View     │  │    View     │  │    View     │          │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘          │
│         │                │                 │                  │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐          │
│  │  Merchant   │  │   Offer     │  │  Campaign   │          │
│  │   Manager   │  │   Manager   │  │   Manager   │          │
│  │    Slice    │  │    Slice    │  │    Slice    │          │
│  │   (Redux)   │  │   (Redux)   │  │   (Redux)   │          │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘          │
│         │                │                 │                  │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐          │
│  │  Merchants  │  │   Offers    │  │  Campaigns  │          │
│  │   Service   │  │   Service   │  │   Service   │          │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘          │
│         │                │                 │                  │
└─────────┼────────────────┼─────────────────┼──────────────────┘
          │                │                 │
          ▼                ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER (REST)                        │
├─────────────────────────────────────────────────────────────┤
│  /dashboard/merchants  /dashboard/offers  /dashboard/campaigns│
└─────────────────────────────────────────────────────────────┘
          │                │                 │
          ▼                ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND LAYER                             │
│              (kigo-core-server - Rust/Axum)                  │
├─────────────────────────────────────────────────────────────┤
│  Merchants Controller  |  Offers Controller  |  Campaigns    │
│  Merchants Service     |  Offers Service     |  Service      │
│  Merchants Repository  |  Offers Repository  |  Repository   │
└─────────────────────────────────────────────────────────────┘
          │                │                 │
          ▼                ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATABASE LAYER                           │
│                  (PostgreSQL + Redis)                        │
├─────────────────────────────────────────────────────────────┤
│  merchants table    |    offers table    |   campaigns table│
│  locations table    |                    |   targeting table│
└─────────────────────────────────────────────────────────────┘
```

## Wizard Composition Patterns

### Pattern 1: Quick Campaign Launch

```
┌──────────┐        ┌──────────┐
│ SELECT   │        │  CREATE  │
│ EXISTING │───────▶│ CAMPAIGN │
│  OFFER   │        │          │
└──────────┘        └──────────┘

User Flow:
1. Start at Offers module
2. Select existing offer
3. Jump to Campaign creation
4. Campaign pre-filled with offer data
```

### Pattern 2: Full New Launch

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  CREATE  │     │  CREATE  │     │  CREATE  │
│ MERCHANT │────▶│  OFFER   │────▶│ CAMPAIGN │
│          │     │          │     │          │
└──────────┘     └──────────┘     └──────────┘

User Flow:
1. Onboard new merchant with locations
2. Create offer for that merchant
3. Launch campaign with that offer
4. Each step inherits context from previous
```

### Pattern 3: Merchant Expansion

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  SELECT  │     │ DUPLICATE│     │  UPDATE  │
│ EXISTING │────▶│  OFFER   │────▶│ EXISTING │
│ MERCHANT │     │          │     │ CAMPAIGN │
└──────────┘     └──────────┘     └──────────┘

User Flow:
1. Select existing merchant
2. Add new locations
3. Duplicate existing offer for new locations
4. Update existing campaigns to include new locations
```

## Navigation Flow

```
┌────────────────────────────────────────────────────────────┐
│                        SIDEBAR                              │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  🏠 Dashboard                                               │
│  📢 Ad Manager                                              │
│                                                             │
│  ┌──────────────── NEW MODULAR SECTION ─────────────────┐  │
│  │                                                         │ │
│  │  🏪 Merchants ──────▶ /merchants                       │ │
│  │     └─ List, Create, Edit, Locations, Contracts       │ │
│  │                                                         │ │
│  │  🎁 Offers ──────────▶ /offers                         │ │
│  │     └─ List, Create, Edit, Duplicate, Templates       │ │
│  │                                                         │ │
│  │  📢 Campaigns ───────▶ /campaigns-module               │ │
│  │     └─ List, Create, Edit, Publish, Analytics         │ │
│  │                                                         │ │
│  └─────────────────────────────────────────────────────────┘  │
│                                                             │
│  ✨ AI Insights                                             │
│  📊 Analytics                                               │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

## State Management Structure

```
Redux Store
│
├── merchantManager
│   ├── isCreatingMerchant: boolean
│   ├── currentStep: "profile" | "locations" | "contract" | "images"
│   ├── merchants: Merchant[]
│   ├── selectedMerchant?: Merchant
│   └── formData: { ... }
│
├── offerManager (UNCHANGED - existing)
│   ├── isCreatingOffer: boolean
│   ├── currentStep: "selection" | "goal" | "details" | ...
│   ├── offers: Offer[]
│   ├── selectedOffer?: Offer
│   └── formData: { ... }
│
└── campaignManager
    ├── isCreatingCampaign: boolean
    ├── currentStep: "targeting" | "schedule" | "delivery" | "review"
    ├── campaigns: Campaign[]
    ├── selectedCampaign?: Campaign
    └── formData: { ... }
```

## API Service Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                   API SERVICE LAYER                           │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  merchantsService                                             │
│  ├── listMerchants(params)        → GET /merchants           │
│  ├── getMerchantById(id)          → GET /merchants/:id       │
│  ├── createMerchant(data)         → POST /merchants          │
│  ├── updateMerchant(id, data)     → PATCH /merchants/:id     │
│  ├── deleteMerchant(id)           → DELETE /merchants/:id    │
│  ├── getMerchantLocations(id)     → GET /merchants/:id/...   │
│  ├── addLocation(data)            → POST /merchants/:id/...  │
│  ├── bulkUploadLocations(data)    → POST /merchants/:id/...  │
│  └── detectClosures(id)           → POST /merchants/:id/...  │
│                                                               │
│  offersService (UNCHANGED)                                    │
│  ├── listOffers(params)           → GET /offers              │
│  ├── getOfferById(id)             → GET /offers/:id          │
│  ├── createOffer(data)            → POST /offers             │
│  ├── updateOffer(id, data)        → PATCH /offers/:id        │
│  ├── deleteOffer(id)              → DELETE /offers/:id       │
│  └── duplicateOffer(id)           → POST /offers/:id/...     │
│                                                               │
│  campaignsService                                             │
│  ├── listCampaigns(params)        → GET /campaigns           │
│  ├── getCampaignById(id)          → GET /campaigns/:id       │
│  ├── createCampaign(data)         → POST /campaigns          │
│  ├── updateCampaign(id, data)     → PATCH /campaigns/:id     │
│  ├── deleteCampaign(id)           → DELETE /campaigns/:id    │
│  ├── publishCampaign(id)          → POST /campaigns/:id/...  │
│  ├── pauseCampaign(id)            → POST /campaigns/:id/...  │
│  ├── endCampaign(id)              → POST /campaigns/:id/...  │
│  └── getCampaignPerformance(id)   → GET /campaigns/:id/...   │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## Future: Workflow Builder

```
┌────────────────────────────────────────────────────────────┐
│             WORKFLOW BUILDER INTERFACE                      │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  Available Modules (Drag Source):                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │🏪        │  │🎁        │  │📢        │               │
│  │MERCHANTS │  │ OFFERS   │  │CAMPAIGNS │               │
│  └──────────┘  └──────────┘  └──────────┘               │
│                                                             │
│  ─────────────────────────────────────────────────────     │
│                                                             │
│  Wizard Canvas (Drop Target):                              │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                        │ │
│  │   ┌──────┐      ┌──────┐      ┌──────┐             │ │
│  │   │  🏪  │  →   │  🎁  │  →   │  📢  │             │ │
│  │   │  M   │      │  O   │      │  C   │             │ │
│  │   └──────┘      └──────┘      └──────┘             │ │
│  │                                                        │ │
│  │   Wizard Name: "Full Launch Workflow"                 │ │
│  │   Description: Onboard merchant, create offer,        │ │
│  │                launch campaign                         │ │
│  │                                                        │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
│  [Save Wizard]  [Test Workflow]  [Cancel]                  │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

## Module Communication

```
 Scenario: Creating a campaign for a new offer

┌──────────────┐     Event: "offer_created"     ┌──────────────┐
│              │────────────────────────────────▶│              │
│    OFFERS    │     { offerId, merchantId }     │  CAMPAIGNS   │
│    MODULE    │◀────────────────────────────────│    MODULE    │
│              │   Response: "campaign_started"  │              │
└──────────────┘                                 └──────────────┘
        │                                               │
        │         Redux State Sharing                   │
        │     (both modules can access                  │
        │      each other's state)                      │
        │                                               │
        └───────────────────┬───────────────────────────┘
                            │
                      ┌─────▼──────┐
                      │   REDUX    │
                      │   STORE    │
                      └────────────┘
```

## Responsive Design

```
Desktop View (≥1024px):
┌─────────────────────────────────────────────────────────┐
│ [Sidebar] │  [Main Content Area]                        │
│           │                                              │
│ Merchants │  ┌────────┐  ┌────────┐  ┌────────┐       │
│ Offers    │  │Card 1  │  │Card 2  │  │Card 3  │       │
│ Campaigns │  └────────┘  └────────┘  └────────┘       │
│           │                                              │
└─────────────────────────────────────────────────────────┘

Tablet View (768px-1023px):
┌─────────────────────────────────────────────────────────┐
│ [☰] [Header]                                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐  ┌──────────────────┐           │
│  │Card 1            │  │Card 2            │           │
│  └──────────────────┘  └──────────────────┘           │
│  ┌──────────────────┐                                  │
│  │Card 3            │                                  │
│  └──────────────────┘                                  │
│                                                          │
└─────────────────────────────────────────────────────────┘

Mobile View (<768px):
┌──────────────────────┐
│ [☰] [Header]         │
├──────────────────────┤
│                      │
│  ┌────────────────┐ │
│  │Card 1          │ │
│  └────────────────┘ │
│  ┌────────────────┐ │
│  │Card 2          │ │
│  └────────────────┘ │
│  ┌────────────────┐ │
│  │Card 3          │ │
│  └────────────────┘ │
│                      │
└──────────────────────┘
```

---

This visual guide complements the main architecture document and provides a clear understanding of how the modular system is structured and how components interact with each other.
