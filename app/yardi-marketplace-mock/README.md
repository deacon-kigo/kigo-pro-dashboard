# Yardi Marketplace Mock

**Full-featured marketplace mock using Yardi branding and the exact Kigo TOP marketplace frontend experience.**

## Overview

This is a comprehensive, self-contained mock of the Yardi resident marketplace that demonstrates:

- **Complete marketplace UI** with offers browsing, search, and filtering
- **Wallet/Hub integration** showing resident rewards and credits
- **Yardi branding** (colors, styling, tenant-focused messaging)
- **Mock data** representing real Yardi resident offers
- **Full interactivity** - tab navigation, search, category filters

## Features

### 1. Offers Marketplace

- **8 realistic resident offers** covering:
  - Home Services (cleaning, handyman)
  - Moving services
  - Local dining credits
  - Fitness memberships
  - Pet supplies
  - Entertainment (movies, events)
  - Smart home devices
  - Grocery delivery

- **Advanced filtering**:
  - Category filters (Home Services, Moving, Dining, Fitness, Pets, etc.)
  - Real-time search by merchant, category, or keywords
  - Featured offers highlighting

- **Rich offer details**:
  - Merchant ratings and reviews
  - Expiration countdowns
  - Offer values and types
  - Visual icons for each category

### 2. My Wallet (Resident Hub)

- **Active rewards display**:
  - Move-In Welcome Package ($100)
  - Lease Renewal Bonus ($250)
  - Referral Reward ($500)

- **Savings summary**:
  - Total offers claimed
  - Total amount saved
  - Active rewards count

### 3. Home Dashboard

- **Welcome experience** for new residents
- **Quick stats** - new offers, wallet balance, ratings
- **Quick action buttons** to navigate to offers or wallet

## Design System

### Yardi Branding

- **Primary Color**: Blue (#0066CC, #0060B9) - Yardi corporate blue
- **Accent Colors**: Green for savings/credits, Yellow for featured offers
- **Typography**: Clean, professional sans-serif
- **Layout**: White-label marketplace with Yardi header

### UI Components

- Shadcn/ui components (Card, Badge, Button, Input)
- Heroicons for consistent iconography
- Responsive grid layouts
- Hover states and transitions
- Gradient accents for featured content

## Mock Data

### Offers

All offers include realistic Yardi-focused scenarios:

- **Move-in services**: Welcome packages, moving discounts, cleaning
- **Resident retention**: Lease renewal bonuses, referral programs
- **Local partnerships**: Dining, entertainment, fitness centers
- **Property-specific**: Pet-friendly perks, smart home upgrades

### Residents

Mock resident: **Sarah Thompson**

- Downtown Properties resident
- 18 offers claimed
- $1,245 total saved
- 3 active wallet tokens

## Access

### Local Development

**URL**: [http://localhost:3000/yardi-marketplace-mock](http://localhost:3000/yardi-marketplace-mock)

1. Ensure the dev server is running:

   ```bash
   cd kigo-pro-dashboard
   pnpm dev
   ```

2. Navigate to: `http://localhost:3000/yardi-marketplace-mock`

3. Explore the three main tabs:
   - **Home**: Welcome dashboard
   - **Offers**: Browse and search marketplace offers
   - **My Wallet**: View resident rewards and credits

## Kigo Nexus Marketplace Capabilities

This mock demonstrates the following **actual Kigo marketplace capabilities** available in Kigo Nexus:

### Implemented in Production

✅ **Offer Types**:

- CPG (Consumer Packaged Goods) offers with receipt verification
- Frequency-based "spend and get" offers (digital punch cards)
- Discounted Product Offers (DPOs) via Augeo partnership
- Lightning Offers (time/quantity limited)
- Traditional offers (affiliate, card-linked, promo codes)

✅ **White-Label Configuration**:

- Custom branding (colors, logos, typography)
- Configurable navigation and homepage sections
- Multi-program support with unique `external_program_id`

✅ **User Experience**:

- SSO authentication flow
- Offer discovery with search and filters
- Wallet/Hub for claimed rewards
- Order tracking and fulfillment

✅ **Analytics**:

- Offer performance tracking
- User engagement metrics
- Campaign ROI measurement

### Test Environment Access

Yardi already has a **live test marketplace** in Kigo Nexus:

**Test URL**: `https://kigo-top-test.kigodigital.net/test-login`

**SSO Flow**:

```
https://kigo-top-test.kigodigital.net/sso/[yardi_external_program_id]?uuid=[session_id]
```

See the [marketplace environment access guide](../../../kigo-nexus/docs/product/products/kigo-marketplace/marketplace-environment-access-guide.md) for full authentication instructions.

## Comparison: Mock vs. Production

| Feature              | This Mock               | Kigo Nexus TOP                          |
| -------------------- | ----------------------- | --------------------------------------- |
| **Branding**         | Yardi blue, static      | White-label, configurable per program   |
| **Offers**           | 8 hardcoded mock offers | Thousands of real offers from merchants |
| **Categories**       | 9 static categories     | Dynamic categories from MOM database    |
| **Search**           | Client-side JS filter   | Elasticsearch + Semantic Search (SSOS)  |
| **Wallet**           | Mock 3 static tokens    | Real-time token/reward management       |
| **Authentication**   | None (public page)      | SSO via partner API + session tokens    |
| **Checkout**         | UI only                 | Stripe integration for DPOs             |
| **Receipt Scanning** | Not implemented         | KigoVerify service with BlinkReceipts   |
| **Analytics**        | None                    | Full event tracking to Kigo Lakehouse   |

## Use Cases

### For Demonstrations

- Show Yardi stakeholders the **resident marketplace experience**
- Demonstrate offer browsing, search, and wallet features
- Explain white-label capabilities without backend complexity

### For Testing UI/UX

- Test new design patterns before implementing in TOP
- Prototype new features (e.g., Lightning Offers countdown UI)
- Validate responsive layouts and interactions

### For Screenshots/Marketing

- Capture clean mockups for presentations
- Generate Yardi-branded materials for sales decks
- Showcase marketplace capabilities to prospects

## Next Steps

### To Connect to Real Data

To integrate this UI with actual Kigo Nexus marketplace data:

1. **Replace mock offers** with API calls to:
   - `GET /api/v1/marketplace/offers` - Browse all offers
   - `GET /api/v1/marketplace/offers/search` - Search offers

2. **Add authentication**:
   - Implement SSO session creation
   - Store session token in secure HTTP-only cookies
   - Pass `external_program_id` for Yardi configuration

3. **Connect wallet**:
   - Fetch user tokens from `GET /api/v1/hub/tokens`
   - Display real redemption history
   - Enable actual "Claim Offer" actions

4. **Apply Yardi branding**:
   - Fetch branding config from MOM database
   - Load Yardi colors, logo, custom labels
   - Apply typography and navigation settings

5. **Deploy**:
   - Build as part of kigo-top Next.js app
   - Route `/programs/yardi` or custom domain
   - Configure CORS and session management

## File Location

**Source**: `kigo-pro-dashboard/app/yardi-marketplace-mock/page.tsx`

**Related Files**:

- [Yardi Presentation Slide 1](../yardi-presentation/slide-1/page.tsx) - Offer Manager Dashboard
- [Yardi Presentation Slide 2](../yardi-presentation/slide-2/page.tsx) - Analytics Dashboard
- [Marketplace Documentation](../../../kigo-nexus/docs/product/products/kigo-marketplace/)

---

**Built with**: Next.js 16, React, Tailwind CSS, Shadcn/ui, Heroicons
**Last Updated**: January 16, 2026
**Status**: Mock/Demo (not connected to real data)
