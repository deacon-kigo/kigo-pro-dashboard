# Kigo PRO Offer Manager: Scalable Co-Pilot Design

**Document Owner**: Design & Engineering
**Date**: October 15, 2025
**Version**: 2.0 (Scalable Architecture)
**Status**: Design Specification

---

## Executive Summary

This document outlines a **production-ready, scalable Offer Manager architecture** that goes beyond the December 2025 pilot scope (John Deere + Yardi) to support the full range of Kigo's offer management capabilities, program types, and future partner needs.

### Key Design Principles

1. **Program-Agnostic Core**: Base architecture supports closed loop, open loop, and hybrid programs without hardcoding
2. **AI-First UX**: Every workflow step has intelligent assistance, not just automation
3. **Production Integration**: Direct API integration with kigo-core-server (Rust backend)
4. **Modular Components**: Reusable UI patterns that extend kigo-admin-tools design system
5. **Real-Time Collaboration**: Multi-user scenarios with state sync and conflict resolution

---

## 1. Current State Analysis

### ✅ What You've Built (Strong Foundation)

**Architecture**:

- LangGraph supervisor agent with offer_manager sub-agent
- CopiloKit integration for state management
- 5-phase workflow (goal_setting → offer_creation → campaign_setup → validation → approval)
- Human-in-the-loop approval gates

**UI Components**:

- OfferManagerView (main container)
- OfferProgressTracker (5-step visual)
- OfferCreationForm (interactive form)
- OfferRecommendations (AI suggestions sidebar)
- OfferApprovalDialog (approval interface)

**Tech Stack Alignment** ✅:

- Next.js 15 + React 19 + TypeScript (matches production)
- Tailwind CSS 4 (matches production)
- CopilotKit + LangGraph (new, not in production yet)

### ❌ Gaps Identified

**1. Dashboard is Empty**

- Only shows 3 stat cards with hardcoded "0" values
- No offer list/table view
- No search, filter, or sort capabilities
- No bulk actions or management tools

**2. Missing Production Integration**

- No actual API calls to kigo-core-server
- Simulated state management only
- No database persistence
- No real offer/campaign data

**3. Limited Scalability**

- Hardcoded program types (John Deere, Yardi)
- Single-offer focus (no multi-offer management)
- No template system
- No versioning or history

**4. Incomplete Workflows**

- Promo code management is basic (no bulk upload, validation)
- Location targeting is simplified (no dealer hierarchy)
- Campaign types are conceptual only (no Hub/Marketplace integration)
- No analytics or performance tracking

**5. Missing Enterprise Features**

- No role-based access control integration
- No approval workflows (just dialog)
- No collaboration tools (comments, notes)
- No audit trail

---

## 2. Production-Ready Architecture

### 2.1 Three-Tier System Design

```
┌─────────────────────────────────────────────────────────┐
│         PRESENTATION LAYER (Next.js Frontend)           │
│  ┌──────────────────┐  ┌────────────────────────────┐  │
│  │  Offer Manager   │  │   AI Co-Pilot Panel        │  │
│  │  Views (React)   │  │   (CopilotKit + LangGraph) │  │
│  └────────┬─────────┘  └──────────┬─────────────────┘  │
└───────────┼────────────────────────┼─────────────────────┘
            │                        │
            │ REST/GraphQL           │ Server-Sent Events
            ▼                        ▼
┌─────────────────────────────────────────────────────────┐
│          APPLICATION LAYER (Node.js/Python)             │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Next.js API Routes (TypeScript)                 │  │
│  │  - /api/offers (CRUD)                            │  │
│  │  - /api/campaigns (CRUD)                         │  │
│  │  - /api/promo-codes (Bulk Management)            │  │
│  │  - /api/validation (Brand Compliance)            │  │
│  └────────┬─────────────────────────────────────────┘  │
│  ┌────────▼─────────────────────────────────────────┐  │
│  │  LangGraph Agent Backend (Python)                │  │
│  │  - Supervisor (Intent Routing)                   │  │
│  │  - Offer Manager Agent (Workflows)               │  │
│  │  - Recommendation Engine (ML Models)             │  │
│  └────────┬─────────────────────────────────────────┘  │
└───────────┼──────────────────────────────────────────────┘
            │
            │ HTTP/REST
            ▼
┌─────────────────────────────────────────────────────────┐
│       DATA LAYER (kigo-core-server - Rust/Axum)         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Admin API Endpoints (NEW)                       │  │
│  │  POST   /admin/api/v1/offers                     │  │
│  │  PUT    /admin/api/v1/offers/:id                 │  │
│  │  DELETE /admin/api/v1/offers/:id                 │  │
│  │  POST   /admin/api/v1/campaigns                  │  │
│  │  POST   /admin/api/v1/campaigns/:id/airdrops     │  │
│  │  POST   /admin/api/v1/promo-codes/bulk           │  │
│  └────────┬─────────────────────────────────────────┘  │
│  ┌────────▼─────────────────────────────────────────┐  │
│  │  Domain Managers (Rust)                          │  │
│  │  - OfferManager (business logic)                 │  │
│  │  - CampaignManager (campaign orchestration)      │  │
│  │  - ValidationManager (compliance checks)         │  │
│  └────────┬─────────────────────────────────────────┘  │
│  ┌────────▼─────────────────────────────────────────┐  │
│  │  Database Layer (Diesel ORM)                     │  │
│  │  - ent_mom_db (Offers, Merchants)                │  │
│  │  - kigo_db (Programs, Partners)                  │  │
│  │  - Redis (Caching, Sessions)                     │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow for Offer Creation

```
User Action                    Frontend                   Agent Backend               Core Server
───────────────────────────────────────────────────────────────────────────────────────────────────
1. "Create offer" ────────────> OfferManagerView
                                     │
                                     │ setState()
                                     ▼
2. Enter goal ──────────────────> CoAgent Hook ──────────> Supervisor Agent
                                                                  │
                                                                  │ route to
                                                                  ▼
3. AI asks questions <────────── Offer Manager Agent
                                 (goal_setting)
                                      │
                                      │ LangGraph state
                                      ▼
4. Provide details ─────────────> CoAgent Hook ──────────> Offer Manager Agent
                                                            (offer_creation)
                                                                  │
                                                                  │ generate recommendations
                                                                  ▼
5. Review AI suggestions <────── Recommendation Engine
   (offer type, value,            (calls historical data)
    redemption method)                   │
                                         │ fetch benchmarks
                                         ▼
                                    POST /admin/api/v1​
                                    /offers/recommendations
                                         │
                                         ▼
                                    Domain: OfferManager
                                    (query similar campaigns)
                                         │
                                         ▼
                                    Database: ent_mom_db
                                    (aggregate redemption rates)

6. Approve offer config ────────> OfferApprovalDialog
                                      │
                                      │ useCopilotAction("launchOffer")
                                      ▼
7. Final approval ──────────────> Offer Manager Agent ────> POST /admin/api/v1/offers
                                  (validation phase)              │
                                                                  ▼
                                                             Domain: OfferManager
                                                             - validate business rules
                                                             - check brand compliance
                                                             - verify promo codes
                                                                  │
                                                                  ▼
                                                             Database: Insert offer
                                                             (offers table)
                                                                  │
                                                                  ▼
8. Campaign setup ──────────────> Campaign Sub-workflow ───> POST /admin/api/v1/campaigns
                                                                  │
                                                                  ▼
                                                             Domain: CampaignManager
                                                             - create campaign record
                                                             - link offer
                                                             - setup tracking
                                                                  │
                                                                  ▼
                                                             Database: Insert campaign
                                                             (program_campaigns table)

9. Deploy ──────────────────────> Status: "deployed" ──────> Publish to distribution
                                                             (Hub/Marketplace/Activation)
```

---

## 3. Comprehensive UI/UX Design

### 3.1 Navigation & Information Architecture

```
Kigo PRO (kigo-admin-tools)
├── Dashboard
├── Programs
├── Partners
├── Ad Manager
├── Catalog Filters
└── 🎁 Offer Manager ← NEW MODULE
    ├── Dashboard (List View)
    ├── Create Offer
    ├── Campaigns
    │   ├── Campaign List
    │   ├── Create Campaign
    │   └── Campaign Analytics
    ├── Templates
    │   ├── Offer Templates
    │   └── Campaign Templates
    └── Analytics
        ├── Performance Dashboard
        └── Program Reports
```

### 3.2 Wireframe: Offer Manager Dashboard (List View)

This is the **MAIN VIEW** when users navigate to Offer Manager.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← Kigo PRO            [🎁 Offer Manager]                        [User Menu] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  🎁 Offer Manager                                                     │  │
│  │  Manage promotional offers and campaigns across all programs          │  │
│  │                                                                         │  │
│  │  [+ Create Offer]  [+ Create Campaign]  [📚 Templates]  [📊 Analytics]│  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ All Offers  │ │  Active: 24 │ │  Draft: 8   │ │ Scheduled:5 │          │
│  │    156      │ │  ✓ Live     │ │  ⏱ Pending  │ │ 📅 Upcoming │          │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘          │
│                                                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Filters                                                                │  │
│  │ [Program: All Programs ▼] [Status: All ▼] [Type: All ▼] [🔍 Search]  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ ☑ SELECT ALL   ACTIONS: [Duplicate] [Archive] [Export]                │  │
│  ├───────────────────────────────────────────────────────────────────────┤  │
│  │ ☐ 🎁 20% Off Parts & Service            │ John Deere │ Active   │ 🔧  │  │
│  │   Dealer Network Promotion              │ Closed Loop│ 47 days  │ ⋮   │  │
│  │   Promo Code • 1,234 redemptions        │ 15% CTR    │          │     │  │
│  ├───────────────────────────────────────────────────────────────────────┤  │
│  │ ☐ 💰 $50 Tenant Welcome Bonus           │ Yardi      │ Active   │ 🔧  │  │
│  │   Property Portfolio Campaign           │ Open Loop  │ 12 days  │ ⋮   │  │
│  │   Hub Airdrop • 892 redemptions         │ 23% CTR    │          │     │  │
│  ├───────────────────────────────────────────────────────────────────────┤  │
│  │ ☐ ⚡ Lightning Deal: BOGO Tools         │ General    │ Draft    │ 🔧  │  │
│  │   Q4 Flash Sale                         │ Hybrid     │ —        │ ⋮   │  │
│  │   Show & Save • Not published           │ —          │          │     │  │
│  ├───────────────────────────────────────────────────────────────────────┤  │
│  │ ☐ 🎉 Summer Equipment Financing         │ John Deere │ Scheduled│ 🔧  │  │
│  │   National Campaign                     │ Closed Loop│ Starts:  │ ⋮   │  │
│  │   Online Link • 0 redemptions           │ Jun 1      │          │     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  Pagination: [← Previous]  Page 1 of 12  [Next →]                           │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key Features**:

- **Summary Cards**: Quick metrics at a glance
- **Advanced Filters**: Program, status, type, date range, search
- **Bulk Actions**: Select multiple offers for duplicate/archive/export
- **Rich Table**: Shows offer name, program, status, performance metrics
- **Quick Actions Menu** (⋮): Edit, Duplicate, View Analytics, Archive

---

### 3.3 Wireframe: Create Offer (Co-Pilot Experience)

This is the **CREATION FLOW** with AI assistance.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← Back to Offers      [Create New Offer]                       [Save Draft] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌───────────────────────────────────────┐  ┌──────────────────────────┐   │
│  │ OFFER CREATION WORKFLOW               │  │ 🤖 AI CO-PILOT           │   │
│  │                                        │  │                          │   │
│  │ ● Goal Setting       (Current)        │  │ Hi! I'm here to help you │   │
│  │ ○ Offer Details                       │  │ create a promotional     │   │
│  │ ○ Redemption Method                   │  │ offer. Let's start with  │   │
│  │ ○ Campaign Setup                      │  │ your business objective. │   │
│  │ ○ Review & Launch                     │  │                          │   │
│  │                                        │  │ 💬 What are you hoping   │   │
│  └───────────────────────────────────────┘  │ to achieve with this     │   │
│                                              │ promotion?               │   │
│  ┌─────────────────────────────────────────┐│                          │   │
│  │ STEP 1: GOAL SETTING                   ││ [Your response here...]  │   │
│  │                                          ││ [Send]                   │   │
│  │ Business Objective 💡 Ask AI             ││                          │   │
│  │ ┌────────────────────────────────────┐  ││ Recent suggestions:      │   │
│  │ │ Example: "Increase Q4 parts sales  │  ││ • Based on your          │   │
│  │ │ by 20% through seasonal promotion" │  ││   historical data...     │   │
│  │ └────────────────────────────────────┘  ││ • Consider targeting...  │   │
│  │                                          ││                          │   │
│  │ Program Type 💡 Ask AI                   ││ 📊 Performance Insights  │   │
│  │ ( ) John Deere - Closed Loop            ││ • Similar offers had     │   │
│  │     Dealer network only                 ││   15-25% redemption      │   │
│  │ ( ) Yardi - Open Loop                   ││ • Peak season is Q4      │   │
│  │     Tenant rewards + merchant catalog   ││                          │   │
│  │ (•) General - Flexible                  ││ 🎯 Quick Actions         │   │
│  │     Custom program configuration        ││ [Generate Offer Ideas]   │   │
│  │                                          ││ [Use Template]           │   │
│  │ Target Audience 💡 Ask AI                ││ [View Examples]          │   │
│  │ ☑ Existing Customers                    ││                          │   │
│  │ ☐ New Prospects                         ││                          │   │
│  │ ☐ Lapsed Customers (>90 days)           │└──────────────────────────┘   │
│  │                                          │                                │
│  │ Budget Constraints 💡 Ask AI             │                                │
│  │ Max Discount: [$____] or [_____%]       │                                │
│  │ Total Campaign Spend: [$____]           │                                │
│  │                                          │                                │
│  │ Timeline 💡 Ask AI                       │                                │
│  │ Start Date: [____/____/____] 📅         │                                │
│  │ End Date:   [____/____/____] 📅         │                                │
│  │                                          │                                │
│  │ [Cancel]        [Next: Offer Details →]│                                │
│  └─────────────────────────────────────────┘                                │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key Features**:

- **Left Panel**: Multi-step form with progress indicator
- **Right Panel**: AI Co-Pilot with conversational interface
- **"Ask AI 💡" Buttons**: Context-aware assistance on every field
- **Real-Time Suggestions**: AI provides recommendations as user types
- **Performance Insights**: Historical data from similar offers
- **Quick Actions**: Generate ideas, use templates, view examples

---

### 3.4 Wireframe: Offer Details Step (AI-Powered Recommendations)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← Back to Offers      [Create New Offer - Step 2/5]           [Save Draft]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌───────────────────────────────────────┐  ┌──────────────────────────┐   │
│  │ OFFER CREATION WORKFLOW               │  │ 🤖 AI RECOMMENDATIONS    │   │
│  │                                        │  │                          │   │
│  │ ✓ Goal Setting                        │  │ Based on your goal of    │   │
│  │ ● Offer Details      (Current)        │  │ increasing Q4 sales...   │   │
│  │ ○ Redemption Method                   │  │                          │   │
│  │ ○ Campaign Setup                      │  │ 🎯 Top Recommendations:  │   │
│  │ ○ Review & Launch                     │  │                          │   │
│  └───────────────────────────────────────┘  │ 1. Percentage Discount   │   │
│                                              │    15-20% off            │   │
│  ┌─────────────────────────────────────────┐│    High redemption rate  │   │
│  │ STEP 2: OFFER DETAILS                  ││    [Use This]            │   │
│  │                                          ││                          │   │
│  │ Your Goal: "Increase Q4 parts sales"    ││ 2. BOGO Offer            │   │
│  │ Program: General                         ││    Buy 1 Get 1 50% off   │   │
│  │                                          ││    Drives volume         │   │
│  │ ┌────────────────────────────────────┐  ││    [Use This]            │   │
│  │ │ AI-GENERATED RECOMMENDATIONS       │  ││                          │   │
│  │ │                                    │  ││ 3. Spend & Get           │   │
│  │ │ 🌟 Top Pick: 20% Off Parts        │  ││    Spend $100, get $20   │   │
│  │ │    • Expected redemption: 18%     │  ││    Higher basket value   │   │
│  │ │    • Estimated ROI: 3.2x          │  ││    [Use This]            │   │
│  │ │    • Best for: New customers      │  ││                          │   │
│  │ │    [Accept & Customize]           │  ││ 📊 Benchmarks:           │   │
│  │ │                                    │  ││ • Industry avg: 12%      │   │
│  │ │ Alternative: $50 Off $200+        │  ││ • Your best: 23%         │   │
│  │ │    • Higher basket value          │  ││ • Competitor: 15-18%     │   │
│  │ │    • Lower redemption: 12%        │  ││                          │   │
│  │ │    [View Details]                 │  ││ 💡 Tips:                 │   │
│  │ └────────────────────────────────────┘  ││ • Test multiple values   │   │
│  │                                          ││ • Start conservative     │   │
│  │ OR Customize Manually:                  ││ • Monitor performance    │   │
│  │                                          │└──────────────────────────┘   │
│  │ Offer Type 💡 Ask AI                     │                                │
│  │ [Percentage Discount  ▼]                │                                │
│  │   • Discount Percentage (X% off)        │                                │
│  │   • Discount Fixed ($X off)             │                                │
│  │   • BOGO (Buy One Get One)              │                                │
│  │   • Cashback                            │                                │
│  │   • Loyalty Points                      │                                │
│  │   • Spend & Get (requires receipt scan) │                                │
│  │   • Lightning Offer (limited quantity)  │                                │
│  │                                          │                                │
│  │ Offer Value 💡 Ask AI                    │                                │
│  │ Discount: [20] [%  ▼]                   │                                │
│  │ ├────────┬────────┬────────┬────────┤   │                                │
│  │ 10%     15%     20%     25%    30%       │                                │
│  │ Low              ↑            High       │                                │
│  │                                          │                                │
│  │ Offer Title                              │                                │
│  │ [20% Off All Parts & Service]            │                                │
│  │                                          │                                │
│  │ Offer Description 💡 Ask AI              │                                │
│  │ ┌────────────────────────────────────┐  │                                │
│  │ │ Save 20% on all parts and service  │  │                                │
│  │ │ this Q4. Valid on orders over $50. │  │                                │
│  │ │ Cannot be combined with other...   │  │                                │
│  │ └────────────────────────────────────┘  │                                │
│  │                                          │                                │
│  │ Terms & Conditions [Generate with AI]   │                                │
│  │ ┌────────────────────────────────────┐  │                                │
│  │ │ (Auto-populated legal boilerplate) │  │                                │
│  │ └────────────────────────────────────┘  │                                │
│  │                                          │                                │
│  │ [← Previous]             [Next: Redemption Method →]                     │
│  └─────────────────────────────────────────┘                                │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key Features**:

- **AI-Generated Recommendations Box**: Top pick with expected performance
- **Smart Defaults**: AI pre-fills optimal values based on goal
- **Visual Slider**: Interactive value selection with guidance
- **Performance Predictions**: Expected redemption rate, ROI, basket value
- **Benchmark Comparisons**: Industry avg, user's historical best, competitor data
- **Accept & Customize**: One-click to accept AI suggestion + edit
- **Auto-Generate Content**: AI writes offer descriptions and T&Cs

---

### 3.5 Wireframe: Redemption Method Step (Program-Aware)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← Back to Offers      [Create New Offer - Step 3/5]           [Save Draft]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌───────────────────────────────────────┐  ┌──────────────────────────┐   │
│  │ OFFER CREATION WORKFLOW               │  │ 🤖 AI GUIDANCE           │   │
│  │                                        │  │                          │   │
│  │ ✓ Goal Setting                        │  │ For your General program │   │
│  │ ✓ Offer Details                       │  │ all redemption methods   │   │
│  │ ● Redemption Method (Current)         │  │ are supported.           │   │
│  │ ○ Campaign Setup                      │  │                          │   │
│  │ ○ Review & Launch                     │  │ Based on your offer type │   │
│  └───────────────────────────────────────┘  │ (percentage discount), I │   │
│                                              │ recommend:               │   │
│  ┌─────────────────────────────────────────┐│                          │   │
│  │ STEP 3: REDEMPTION METHOD              ││ 🌟 Promo Code            │   │
│  │                                          ││ • Easy for merchants     │   │
│  │ Select how customers will redeem:       ││ • Works online + store   │   │
│  │                                          ││ • Track usage easily     │   │
│  │ (•) Promo Code                          ││                          │   │
│  │     Customer provides merchant-supplied ││ Show & Save              │   │
│  │     code (online, phone, or in-store)   ││ • Better UX              │   │
│  │     ✓ Easy implementation               ││ • Mobile-friendly        │   │
│  │     ✓ Works with POS systems            ││ • Lower fraud risk       │   │
│  │                                          ││                          │   │
│  │ ( ) Show & Save                         ││ [Ask more questions]     │   │
│  │     Customer displays QR/barcode/code   │└──────────────────────────┘   │
│  │     to staff                            │                                │
│  │     ✓ Mobile-optimized                  │                                │
│  │     ✓ Real-time tracking                │                                │
│  │                                          │                                │
│  │ ( ) Barcode Scan                        │                                │
│  │     Customer scans barcode at location  │                                │
│  │     ⚠ Requires barcode reader           │                                │
│  │                                          │                                │
│  │ ( ) Online Link                         │                                │
│  │     Redirect to merchant website with   │                                │
│  │     discount applied                    │                                │
│  │     ✓ Seamless for e-commerce           │                                │
│  │                                          │                                │
│  │ ┌────────────────────────────────────┐  │                                │
│  │ │ PROMO CODE CONFIGURATION           │  │                                │
│  │ │                                    │  │                                │
│  │ │ Code Type:                         │  │                                │
│  │ │ (•) Single Universal Code          │  │                                │
│  │ │     One code for all customers     │  │                                │
│  │ │     Example: SPRING20              │  │                                │
│  │ │                                    │  │                                │
│  │ │ ( ) Multiple Unique Codes          │  │                                │
│  │ │     Individual codes per customer  │  │                                │
│  │ │     [Upload CSV File]              │  │                                │
│  │ │                                    │  │                                │
│  │ │ Promo Code: [PARTS20___________]   │  │                                │
│  │ │ [Generate Random Code]             │  │                                │
│  │ │                                    │  │                                │
│  │ │ Usage Limits:                      │  │                                │
│  │ │ ☑ Limit per customer: [1] use(s)   │  │                                │
│  │ │ ☑ Total usage limit: [1000] uses   │  │                                │
│  │ │                                    │  │                                │
│  │ │ Location Scope 💡 Ask AI            │  │                                │
│  │ │ ☑ All participating locations      │  │                                │
│  │ │ ☐ Specific locations only          │  │                                │
│  │ │   [Select Locations...]            │  │                                │
│  │ └────────────────────────────────────┘  │                                │
│  │                                          │                                │
│  │ [← Previous]               [Next: Campaign Setup →]                      │
│  └─────────────────────────────────────────┘                                │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key Features**:

- **Method Comparison**: Pros/cons for each redemption type
- **AI Recommendations**: Based on offer type, program, and merchant capabilities
- **Configuration Cards**: Context-aware options (e.g., promo code settings only show when selected)
- **Bulk Code Upload**: CSV/Excel support for unique codes
- **Code Generation**: Auto-generate random codes
- **Usage Limits**: Per-customer and total caps
- **Location Scope**: All locations or specific selection

---

### 3.6 Wireframe: Campaign Setup Step (Multi-Channel)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← Back to Offers      [Create New Offer - Step 4/5]           [Save Draft]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌───────────────────────────────────────┐  ┌──────────────────────────┐   │
│  │ OFFER CREATION WORKFLOW               │  │ 🤖 MULTI-CHANNEL STRATEGY│   │
│  │                                        │  │                          │   │
│  │ ✓ Goal Setting                        │  │ For your offer, I        │   │
│  │ ✓ Offer Details                       │  │ recommend a mix of:      │   │
│  │ ✓ Redemption Method                   │  │                          │   │
│  │ ● Campaign Setup     (Current)        │  │ 🎯 Hub Airdrop (40%)     │   │
│  │ ○ Review & Launch                     │  │    Direct to 5,000 users │   │
│  └───────────────────────────────────────┘  │                          │   │
│                                              │ 📱 Activation Links (35%)│   │
│  ┌─────────────────────────────────────────┐│    Social + email        │   │
│  │ STEP 4: CAMPAIGN SETUP                 ││                          │   │
│  │                                          ││ 🔍 Organic Discovery(25%)│   │
│  │ Distribution Channels 💡 Ask AI          ││    Marketplace browse    │   │
│  │                                          ││                          │   │
│  │ Select delivery methods:                ││ Expected reach:          │   │
│  │                                          ││ 12,000-15,000 users      │   │
│  │ ☑ Hub Airdrops                          ││                          │   │
│  │   Direct delivery to user wallets       ││ [Use This Strategy]      │   │
│  │   ┌──────────────────────────────────┐  │└──────────────────────────┘   │
│  │   │ Audience Selection:              │  │                                │
│  │   │ (•) Upload Customer List         │  │                                │
│  │   │     [📎 Upload CSV/Excel]        │  │                                │
│  │   │     Expected: ~5,000 recipients  │  │                                │
│  │   │                                  │  │                                │
│  │   │ ( ) Engagement-Based Segmentation│  │                                │
│  │   │     Active users (30 days)       │  │                                │
│  │   │                                  │  │                                │
│  │   │ ( ) Redemption-Based Segmentation│  │                                │
│  │   │     Past offer redeemers         │  │                                │
│  │   └──────────────────────────────────┘  │                                │
│  │                                          │                                │
│  │ ☑ Activation Campaigns                  │                                │
│  │   Shareable partner-branded URLs        │                                │
│  │   ┌──────────────────────────────────┐  │                                │
│  │   │ Campaign URL:                    │  │                                │
│  │   │ https://offers.kigo.io/parts20   │  │                                │
│  │   │ [Copy Link] [Generate QR Code]   │  │                                │
│  │   │                                  │  │                                │
│  │   │ Landing Page Branding:           │  │                                │
│  │   │ [Upload Logo] [Select Colors]    │  │                                │
│  │   │ [Preview Landing Page]           │  │                                │
│  │   └──────────────────────────────────┘  │                                │
│  │                                          │                                │
│  │ ☐ Promoted Marketplace                  │                                │
│  │   Paid promotion for visibility         │                                │
│  │   [Configure Budget & Bidding]          │                                │
│  │                                          │                                │
│  │ ☑ Organic Marketplace                   │                                │
│  │   Natural discovery in catalog          │                                │
│  │   [Select Category & Keywords]          │                                │
│  │                                          │                                │
│  │ Campaign Timing 💡 Ask AI                │                                │
│  │ Deployment Date: [12/01/2025  ▼]        │                                │
│  │ (•) Deploy immediately                  │                                │
│  │ ( ) Schedule for later                  │                                │
│  │                                          │                                │
│  │ Campaign Duration:                       │                                │
│  │ Start: [12/01/2025] End: [12/31/2025]   │                                │
│  │ ⏱ Duration: 30 days                     │                                │
│  │                                          │                                │
│  │ [← Previous]                [Next: Review & Launch →]                    │
│  └─────────────────────────────────────────┘                                │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key Features**:

- **Multi-Channel Selection**: Choose multiple distribution methods
- **Audience Targeting**: Upload CSV or use ML-based segmentation
- **Activation Campaign URLs**: Auto-generated branded links
- **QR Code Generation**: For offline-to-online bridge
- **Landing Page Customization**: Brand colors, logo, messaging
- **Budget Configuration**: For promoted marketplace campaigns
- **Scheduling**: Immediate or future deployment
- **AI-Powered Recommendations**: Optimal channel mix based on offer type

---

### 3.7 Wireframe: Review & Launch (Validation + Approval)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← Back to Offers      [Create New Offer - Step 5/5]           [Save Draft]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌───────────────────────────────────────┐  ┌──────────────────────────┐   │
│  │ OFFER CREATION WORKFLOW               │  │ 🤖 FINAL CHECKS          │   │
│  │                                        │  │                          │   │
│  │ ✓ Goal Setting                        │  │ ✓ Offer validated        │   │
│  │ ✓ Offer Details                       │  │ ✓ Brand compliant        │   │
│  │ ✓ Redemption Method                   │  │ ✓ Budget within limits   │   │
│  │ ✓ Campaign Setup                      │  │ ✓ No conflicts detected  │   │
│  │ ● Review & Launch    (Current)        │  │                          │   │
│  └───────────────────────────────────────┘  │ Ready to launch! 🚀      │   │
│                                              │                          │   │
│  ┌─────────────────────────────────────────┐│ Expected Performance:    │   │
│  │ STEP 5: REVIEW & LAUNCH                ││                          │   │
│  │                                          ││ Reach: 12-15K users      │   │
│  │ ┌────────────────────────────────────┐  ││ Redemptions: 1,800-2,200 │   │
│  │ │ VALIDATION RESULTS                 │  ││ ROI: 3.2x                │   │
│  │ │                                    │  ││                          │   │
│  │ │ ✓ Offer Configuration              │  ││ [View Full Projection]   │   │
│  │ │   All required fields complete     │  │└──────────────────────────┘   │
│  │ │                                    │  │                                │
│  │ │ ✓ Brand Compliance                 │  │                                │
│  │ │   Meets program brand guidelines   │  │                                │
│  │ │                                    │  │                                │
│  │ │ ✓ Budget Validation                │  │                                │
│  │ │   Within approved spending limits  │  │                                │
│  │ │                                    │  │                                │
│  │ │ ✓ Code Validation                  │  │                                │
│  │ │   Promo code "PARTS20" available   │  │                                │
│  │ │                                    │  │                                │
│  │ │ ⚠ Warning: Peak Season             │  │                                │
│  │ │   Q4 is high-demand. Consider      │  │                                │
│  │ │   increasing inventory.            │  │                                │
│  │ │   [View Details]                   │  │                                │
│  │ └────────────────────────────────────┘  │                                │
│  │                                          │                                │
│  │ ┌────────────────────────────────────┐  │                                │
│  │ │ OFFER SUMMARY                      │  │                                │
│  │ │                                    │  │                                │
│  │ │ Offer: 20% Off Parts & Service     │  │                                │
│  │ │ Program: General                   │  │                                │
│  │ │ Type: Percentage Discount          │  │                                │
│  │ │ Value: 20% off                     │  │                                │
│  │ │ Redemption: Promo Code (PARTS20)   │  │                                │
│  │ │ Duration: Dec 1-31, 2025 (30 days) │  │                                │
│  │ │                                    │  │                                │
│  │ │ Distribution:                      │  │                                │
│  │ │ • Hub Airdrops (5,000 users)       │  │                                │
│  │ │ • Activation Campaign              │  │                                │
│  │ │ • Organic Marketplace              │  │                                │
│  │ │                                    │  │                                │
│  │ │ Budget:                            │  │                                │
│  │ │ Max discount per redemption: $50   │  │                                │
│  │ │ Estimated total spend: $90,000     │  │                                │
│  │ │ (1,800 redemptions × $50 avg)      │  │                                │
│  │ │                                    │  │                                │
│  │ │ [Edit Offer] [View Full Details]   │  │                                │
│  │ └────────────────────────────────────┘  │                                │
│  │                                          │                                │
│  │ ┌────────────────────────────────────┐  │                                │
│  │ │ APPROVAL & LAUNCH                  │  │                                │
│  │ │                                    │  │                                │
│  │ │ ☑ I confirm this offer meets brand │  │                                │
│  │ │   guidelines and business rules    │  │                                │
│  │ │                                    │  │                                │
│  │ │ Approval Notes (optional):         │  │                                │
│  │ │ ┌──────────────────────────────┐   │  │                                │
│  │ │ │ Approved by Marketing Director│   │  │                                │
│  │ │ │ for Q4 campaign.              │   │  │                                │
│  │ │ └──────────────────────────────┘   │  │                                │
│  │ │                                    │  │                                │
│  │ │ [← Previous]  [Save as Draft]      │  │                                │
│  │ │                                    │  │                                │
│  │ │ [🚀 Launch Offer]                  │  │                                │
│  │ │ (Primary action button)            │  │                                │
│  │ └────────────────────────────────────┘  │                                │
│  └─────────────────────────────────────────┘                                │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key Features**:

- **Validation Checklist**: Automated checks (✓ pass, ⚠ warnings, ✗ blockers)
- **Offer Summary Card**: Complete overview before launch
- **Performance Projections**: AI-predicted reach, redemptions, ROI
- **Edit Links**: Quick navigation back to specific steps
- **Approval Checkbox**: Human confirmation required
- **Approval Notes**: Optional comment trail for auditing
- **Dual Actions**: Save as Draft OR Launch immediately
- **Budget Preview**: Estimated total spend calculation

---

## 4. Agent Workflow Architecture

### 4.1 Enhanced LangGraph State Machine

```python
# Extended State Schema (beyond MVP)
class OfferManagerState(TypedDict):
    # Core Identification
    offer_id: Optional[str]
    campaign_id: Optional[str]
    user_id: str
    session_id: str

    # Workflow State
    workflow_phase: Literal[
        "initialization",
        "goal_setting",
        "offer_creation",
        "redemption_setup",
        "campaign_setup",
        "validation",
        "approval",
        "deployment",
        "completed"
    ]
    progress_percentage: int  # 0-100
    substep: Optional[str]  # For multi-part phases

    # Business Context
    business_objective: str
    program_type: Literal["closed_loop", "open_loop", "hybrid", "custom"]
    program_id: str
    partner_id: str
    target_audience: Dict[str, Any]
    budget_constraints: Dict[str, float]
    timeline: Dict[str, datetime]

    # Offer Configuration
    offer_config: Dict[str, Any]  # Type, value, title, description
    redemption_method: Dict[str, Any]  # Method, codes, limits
    brand_assets: Dict[str, str]  # Logo URLs, colors, etc.
    terms_conditions: str
    exclusions: List[str]

    # Campaign Configuration
    campaign_setup: Dict[str, Any]  # Channels, targeting, timing
    distribution_channels: List[str]
    audience_segments: List[Dict[str, Any]]
    deployment_schedule: Dict[str, datetime]

    # Validation & Compliance
    validation_results: List[Dict[str, Any]]
    compliance_checks: Dict[str, bool]
    warnings: List[str]
    blockers: List[str]

    # Approval & Launch
    requires_approval: bool
    approval_status: Optional[Literal["pending", "approved", "rejected"]]
    approval_notes: Optional[str]
    approver_id: Optional[str]
    pending_action: Optional[Dict[str, Any]]

    # AI Recommendations
    ai_recommendations: List[Dict[str, Any]]
    performance_predictions: Dict[str, float]

    # History & Audit
    conversation_history: List[Dict[str, Any]]
    edit_history: List[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime
```

### 4.2 Enhanced Agent Nodes

```python
# Supervisor Agent - Enhanced Intent Detection
def supervisor_agent(state: OfferManagerState) -> Command[Literal["__end__", "offer_manager_agent", ...]]:
    """
    Routes user intent to appropriate specialist agent.
    Enhanced with multi-intent detection and context carryover.
    """
    last_message = state["messages"][-1]

    # Multi-intent NLU
    intents = detect_intents(last_message, state)

    # Primary routing logic
    if "offer_management" in intents:
        return Command(
            goto="offer_manager_agent",
            update={
                "context": extract_offer_context(last_message, state),
                "intent_confidence": intents["offer_management"]["score"]
            }
        )

    # ... other routing logic

# Offer Manager Agent - Enhanced with Sub-Workflows
def offer_manager_agent(state: OfferManagerState) -> Command[Literal["__end__", "supervisor"]]:
    """
    Main offer creation orchestrator with intelligent sub-workflow management.
    """
    phase = state["workflow_phase"]

    # Route to appropriate sub-handler
    handlers = {
        "goal_setting": goal_setting_handler,
        "offer_creation": offer_creation_handler,
        "redemption_setup": redemption_setup_handler,
        "campaign_setup": campaign_setup_handler,
        "validation": validation_handler,
        "approval": approval_handler,
        "deployment": deployment_handler
    }

    handler = handlers.get(phase)
    if not handler:
        return Command(goto="supervisor")

    # Execute phase handler
    result = handler(state)

    # Determine next phase or completion
    return result

# Goal Setting Handler - Enhanced with Contextual Questioning
def goal_setting_handler(state: OfferManagerState) -> Command[Literal["__end__"]]:
    """
    Gathers business objective and context through intelligent questioning.
    """
    # Check what we already know
    missing_fields = identify_missing_context(state)

    if missing_fields:
        # Ask clarifying questions
        question = generate_contextual_question(
            missing_field=missing_fields[0],
            program_type=state.get("program_type"),
            historical_data=fetch_user_history(state["user_id"])
        )

        return Command(
            goto="__end__",
            update={
                "messages": state["messages"] + [{"role": "assistant", "content": question}],
                "pending_field": missing_fields[0],
                "progress_percentage": calculate_progress(state, phase="goal_setting")
            }
        )

    # All context gathered, move to next phase
    return Command(
        goto="__end__",
        update={
            "workflow_phase": "offer_creation",
            "progress_percentage": 20,
            "messages": state["messages"] + [{
                "role": "assistant",
                "content": "Great! Based on your goal, let me generate some offer recommendations..."
            }]
        }
    )

# Offer Creation Handler - Enhanced with ML Recommendations
def offer_creation_handler(state: OfferManagerState) -> Command[Literal["__end__"]]:
    """
    Generates AI-powered offer recommendations using ML models.
    """
    # Fetch historical performance data
    similar_offers = query_similar_campaigns(
        business_objective=state["business_objective"],
        program_type=state["program_type"],
        target_audience=state["target_audience"]
    )

    # Run recommendation engine
    recommendations = generate_offer_recommendations(
        context=state,
        historical_data=similar_offers,
        ml_model="offer_optimization_v2"
    )

    # Calculate performance predictions
    predictions = predict_performance(
        recommendations=recommendations,
        context=state,
        model="redemption_prediction_v1"
    )

    # Present to user
    return Command(
        goto="__end__",
        update={
            "ai_recommendations": recommendations,
            "performance_predictions": predictions,
            "progress_percentage": 40,
            "messages": state["messages"] + [{
                "role": "assistant",
                "content": format_recommendations_message(recommendations, predictions)
            }]
        }
    )

# Validation Handler - Enhanced with Brand Compliance AI
def validation_handler(state: OfferManagerState) -> Command[Literal["__end__"]]:
    """
    Performs automated validation and brand compliance checking.
    """
    results = []

    # 1. Configuration Completeness
    completeness = validate_configuration_completeness(state["offer_config"])
    results.append({
        "check": "configuration_completeness",
        "status": "pass" if completeness["complete"] else "fail",
        "details": completeness
    })

    # 2. Brand Compliance (AI-powered)
    if state.get("program_type") in ["closed_loop", "custom"]:
        brand_check = validate_brand_compliance(
            offer_title=state["offer_config"]["title"],
            offer_description=state["offer_config"]["description"],
            brand_assets=state.get("brand_assets", {}),
            program_id=state["program_id"],
            ml_model="brand_compliance_classifier_v1"
        )
        results.append({
            "check": "brand_compliance",
            "status": brand_check["compliant"],
            "confidence": brand_check["confidence"],
            "suggestions": brand_check.get("suggestions", [])
        })

    # 3. Budget Validation
    budget_check = validate_budget(
        offer_value=state["offer_config"]["value"],
        expected_redemptions=state["performance_predictions"]["redemptions"],
        budget_limit=state["budget_constraints"]["max_spend"]
    )
    results.append({
        "check": "budget_validation",
        "status": "pass" if budget_check["within_budget"] else "warning",
        "details": budget_check
    })

    # 4. Promo Code Validation
    if state["redemption_method"]["type"] == "promo_code":
        code_check = validate_promo_codes(
            codes=state["redemption_method"]["codes"],
            program_id=state["program_id"]
        )
        results.append({
            "check": "promo_code_validation",
            "status": code_check["status"],
            "details": code_check
        })

    # 5. Campaign Conflict Detection
    conflicts = detect_campaign_conflicts(
        start_date=state["deployment_schedule"]["start_date"],
        end_date=state["deployment_schedule"]["end_date"],
        program_id=state["program_id"],
        target_audience=state["target_audience"]
        )
    if conflicts:
        results.append({
            "check": "campaign_conflicts",
            "status": "warning",
            "conflicts": conflicts
        })

    # Determine if there are blockers
    blockers = [r for r in results if r["status"] == "fail"]
    warnings = [r for r in results if r["status"] == "warning"]

    if blockers:
        return Command(
            goto="__end__",
            update={
                "validation_results": results,
                "blockers": [b["check"] for b in blockers],
                "requires_approval": False,  # Can't approve with blockers
                "messages": state["messages"] + [{
                    "role": "assistant",
                    "content": format_validation_failure_message(blockers)
                }],
                "workflow_phase": "offer_creation"  # Go back to fix issues
            }
        )

    # All validations passed (or only warnings)
    return Command(
        goto="__end__",
        update={
            "validation_results": results,
            "warnings": [w["check"] for w in warnings],
            "requires_approval": True,
            "workflow_phase": "approval",
            "progress_percentage": 90,
            "messages": state["messages"] + [{
                "role": "assistant",
                "content": "✓ Validation complete! Ready for final approval."
            }]
        }
    )

# Approval Handler - Enhanced with Human-in-the-Loop
def approval_handler(state: OfferManagerState) -> Command[Literal["__end__", "deployment_handler"]]:
    """
    Manages human approval workflow with interrupt capability.
    """
    if state["approval_status"] == "approved":
        return Command(
            goto="deployment_handler",
            update={
                "workflow_phase": "deployment",
                "progress_percentage": 95
            }
        )

    elif state["approval_status"] == "rejected":
        return Command(
            goto="__end__",
            update={
                "workflow_phase": "offer_creation",  # Go back to edit
                "requires_approval": False,
                "messages": state["messages"] + [{
                    "role": "assistant",
                    "content": "No problem! What would you like to change?"
                }]
            }
        )

    # Approval pending - trigger interrupt for human decision
    return Command(
        goto="__end__",
        update={
            "pending_action": {
                "type": "approval_required",
                "offer_summary": generate_offer_summary(state),
                "validation_results": state["validation_results"],
                "performance_predictions": state["performance_predictions"]
            }
        }
    )

# Deployment Handler - Integration with Backend APIs
async def deployment_handler(state: OfferManagerState) -> Command[Literal["__end__"]]:
    """
    Deploys offer to production systems via kigo-core-server APIs.
    """
    try:
        # 1. Create offer in database
        offer_response = await create_offer_api_call(
            offer_config=state["offer_config"],
            redemption_method=state["redemption_method"],
            program_id=state["program_id"],
            created_by=state["user_id"]
        )
        offer_id = offer_response["offer_id"]

        # 2. Create campaign
        campaign_response = await create_campaign_api_call(
            offer_id=offer_id,
            campaign_setup=state["campaign_setup"],
            distribution_channels=state["distribution_channels"],
            program_id=state["program_id"],
            created_by=state["user_id"]
        )
        campaign_id = campaign_response["campaign_id"]

        # 3. Process airdrops (if applicable)
        if "hub_airdrops" in state["distribution_channels"]:
            await process_airdrop(
                campaign_id=campaign_id,
                audience=state["audience_segments"],
                delivery_schedule=state["deployment_schedule"]
            )

        # 4. Activate campaigns
        await activate_campaign(campaign_id=campaign_id)

        return Command(
            goto="__end__",
            update={
                "workflow_phase": "completed",
                "progress_percentage": 100,
                "offer_id": offer_id,
                "campaign_id": campaign_id,
                "messages": state["messages"] + [{
                    "role": "assistant",
                    "content": f"🎉 Success! Your offer is now live.\n\nOffer ID: {offer_id}\nCampaign ID: {campaign_id}\n\n[View Performance Dashboard →]"
                }]
            }
        )

    except Exception as e:
        # Handle deployment failures gracefully
        return Command(
            goto="__end__",
            update={
                "workflow_phase": "approval",
                "messages": state["messages"] + [{
                    "role": "assistant",
                    "content": f"⚠️ Deployment failed: {str(e)}\n\nPlease try again or contact support."
                }]
            }
        )
```

---

## 5. Implementation Roadmap

### Phase 1: Core Architecture (Weeks 1-4)

**Backend APIs** (kigo-core-server):

```rust
// New admin endpoints
POST   /admin/api/v1/offers
PUT    /admin/api/v1/offers/:id
DELETE /admin/api/v1/offers/:id
GET    /admin/api/v1/offers/:id/recommendations
POST   /admin/api/v1/offers/:id/validate

POST   /admin/api/v1/campaigns
PUT    /admin/api/v1/campaigns/:id
POST   /admin/api/v1/campaigns/:id/airdrops
POST   /admin/api/v1/campaigns/:id/activate

POST   /admin/api/v1/promo-codes/bulk
POST   /admin/api/v1/promo-codes/validate
```

**Frontend Components** (kigo-admin-tools):

- Migrate OfferManagerView → `src/app/(protected)/offer-manager/page.tsx`
- Create OfferListView (dashboard table)
- Enhance OfferCreationForm with production integration
- Add OfferTemplates component
- Add CampaignAnalytics component

### Phase 2: AI Enhancements (Weeks 5-8)

**Recommendation Engine**:

- Train ML model on historical redemption data
- Implement performance prediction API
- Build offer type classification model
- Add brand compliance AI

**Agent Improvements**:

- Enhanced intent detection (multi-intent)
- Contextual questioning engine
- Real-time validation feedback
- Approval workflow state machine

### Phase 3: Enterprise Features (Weeks 9-12)

**Multi-User Collaboration**:

- Offer comments/notes system
- Approval workflows (multi-level)
- Audit trail and version history
- Real-time co-editing (WebSockets)

**Advanced Management**:

- Bulk operations (duplicate, archive, export)
- Template library (offer + campaign)
- Performance analytics dashboard
- A/B testing framework

### Phase 4: Pilot Launch (Week 13)

**John Deere + Yardi Onboarding**:

- Program-specific customizations
- User training sessions
- Feedback collection system
- Performance monitoring

---

## 6. Success Metrics

### User Experience Metrics

- **Offer Creation Time**: < 5 minutes (vs. 30+ minutes manual)
- **AI Assistance Usage**: > 70% of users click "Ask AI" buttons
- **Completion Rate**: > 85% of started offers reach launch
- **User Satisfaction**: NPS > 8.5

### Business Impact Metrics

- **Offers Created**: 3x increase per merchant/month
- **Redemption Rate**: 25% improvement vs. non-AI offers
- **Revenue Per Campaign**: 15% increase
- **Time to Market**: 5x faster campaign deployment

### Technical Metrics

- **API Response Time**: < 200ms (p95)
- **Agent Response Time**: < 3 seconds for recommendations
- **System Uptime**: > 99.9%
- **Error Rate**: < 0.1%

---

## 7. Next Steps

1. **Review & Approve Design** with stakeholders
2. **Backend API Development** (kigo-core-server team)
3. **Frontend Migration** from kigo-pro-dashboard → kigo-admin-tools
4. **Agent Enhancement** (LangGraph workflows)
5. **Integration Testing** with staging environment
6. **Pilot Onboarding** (John Deere + Yardi)

---

**Document Status**: Ready for Technical Review
**Next Review Date**: October 22, 2025
**Owner**: Design & Engineering Team
