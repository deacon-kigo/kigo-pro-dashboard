# Modular Architecture: Merchants, Offers, and Campaigns

## Overview

This document outlines the modular architecture designed to support three interconnected but independent modules: **Merchants**, **Offers**, and **Campaigns**. Each module can operate standalone or be combined into custom wizards via a future Workflow Builder feature.

## Architecture Principles

### 1. Module Independence

Each module is self-contained with its own:

- Redux state slice
- API service layer
- TypeScript type definitions
- UI views and components
- Route handlers

### 2. Data Flow

```
Merchants (source)
    ↓ provides merchant data to
Offers (uses merchant context)
    ↓ provides offer data to
Campaigns (distributes offers from merchants)
```

### 3. Flexible Composition

- **Standalone Usage**: Each module can be used independently for CRUD operations
- **Wizard Composition**: Modules can be combined into custom workflows
- **Multiple Entry Points**: Users can start from any module depending on their needs

## Module Structure

### Merchants Module

**Purpose**: Merchant onboarding, location management, and contract handling (V1 Scope)

**Routes**:

- `/merchants` - Main dashboard and list view
- `/merchants/[id]` - Individual merchant details (future)
- `/merchants/create` - Merchant creation wizard (future)

**State**: `merchantManager` slice

- Profile data
- Locations
- Contract information
- Image/logo assets

**API Endpoints** (via `merchantsService.ts`):

- `GET /dashboard/merchants` - List merchants
- `POST /dashboard/merchants` - Create merchant
- `PATCH /dashboard/merchants/:id` - Update merchant
- `DELETE /dashboard/merchants/:id` - Delete merchant
- `GET /dashboard/merchants/:id/locations` - Get locations
- `POST /dashboard/merchants/:id/locations/bulk` - Bulk upload locations
- `POST /dashboard/merchants/:id/detect-closures` - Run closure detection

### Offers Module

**Purpose**: Offer creation and management (existing, unchanged)

**Routes**:

- `/offers` - Main dashboard and list view (new URL)
- `/offer-manager` - Legacy URL (still works, redirects to `/offers`)

**State**: `offerManager` slice (existing, unchanged)

- Offer selection mode
- Selected offer
- Form data
- Workflow phase

**API Endpoints** (via `offersService.ts`):

- `GET /dashboard/offers` - List offers
- `POST /dashboard/offers` - Create offer
- `PATCH /dashboard/offers/:id` - Update offer
- `DELETE /dashboard/offers/:id` - Delete offer
- Existing functionality remains intact

### Campaigns Module

**Purpose**: Campaign targeting, scheduling, and distribution (Future Vision Scope)

**Routes**:

- `/campaigns-module` - Main dashboard and list view
- `/campaigns-module/[id]` - Individual campaign details (future)
- `/campaigns-module/create` - Campaign creation wizard (future)

**State**: `campaignManager` slice

- Targeting configuration
- Schedule information
- Delivery channels
- Performance data

**API Endpoints** (via `campaignsService.ts`):

- `GET /dashboard/campaigns` - List campaigns
- `POST /dashboard/campaigns` - Create campaign
- `PATCH /dashboard/campaigns/:id` - Update campaign
- `DELETE /dashboard/campaigns/:id` - Delete campaign
- `POST /dashboard/campaigns/:id/publish` - Publish campaign
- `POST /dashboard/campaigns/:id/pause` - Pause campaign
- `POST /dashboard/campaigns/:id/end` - End campaign
- `GET /dashboard/campaigns/:id/performance` - Get performance metrics

## Implementation Status

### ✅ Completed

1. **Type Definitions** (`types/`)

   - `merchants.ts` - Complete merchant and location types
   - `campaigns.ts` - Complete campaign and targeting types
   - `offers.ts` - Existing, unchanged

2. **Redux State Management** (`lib/redux/slices/`)

   - `merchantManagerSlice.ts` - Full state management for merchants
   - `campaignManagerSlice.ts` - Full state management for campaigns
   - `offerManagerSlice.ts` - Existing, unchanged
   - All slices integrated into Redux store

3. **API Services** (`lib/services/`)

   - `merchantsService.ts` - Complete CRUD + location management
   - `campaignsService.ts` - Complete CRUD + lifecycle management
   - `offersService.ts` - Existing, unchanged

4. **Placeholder Views** (`components/features/`)

   - `merchant-manager/MerchantManagerView.tsx` - Dashboard placeholder
   - `campaign-manager/CampaignManagerView.tsx` - Dashboard placeholder
   - `offer-manager/OfferManagerView.tsx` - Existing, fully functional

5. **Routing** (`app/`)
   - `/merchants/page.tsx` - Merchants module route
   - `/offers/page.tsx` - Offers module route (new URL)
   - `/campaigns-module/page.tsx` - Campaigns module route
   - `/offer-manager/page.tsx` - Legacy route (still works)

### 🚧 Pending (Manual Update Required)

**Sidebar Navigation** (`components/organisms/Sidebar/Sidebar.tsx`):

The sidebar has multiple role-based navigation structures. The following navigation items need to be added for the "merchant" role section (approximately line 276-322):

```tsx
// Replace the existing "Offer Manager" link with three modular links:
<li className="nav-item px-3 py-1">
  <SidebarLabel
    href="/merchants"
    icon={BuildingStorefrontIcon}
    title="Merchants"
    isActive={isLinkActive("/merchants")}
    isCollapsed={sidebarCollapsed}
  />
</li>
<li className="nav-item px-3 py-1">
  <SidebarLabel
    href="/offers"
    icon={GiftIcon}
    title="Offers"
    isActive={isLinkActive("/offers")}
    isCollapsed={sidebarCollapsed}
  />
</li>
<li className="nav-item px-3 py-1">
  <SidebarLabel
    href="/campaigns-module"
    icon={MegaphoneIcon}
    title="Campaigns"
    isActive={isLinkActive("/campaigns-module")}
    isCollapsed={sidebarCollapsed}
  />
</li>
```

**Note**: The icon for Campaigns uses `MegaphoneIcon`, which is the same as "Ad Manager". Consider using a different icon like `RocketLaunchIcon` or `BoltIcon` to differentiate the two features.

## Future Enhancements

### Workflow Builder (V2+)

A drag-and-drop interface to create custom wizards by combining modules:

```
┌─────────────────────────────────────┐
│ Workflow Builder                    │
├─────────────────────────────────────┤
│ Module Palette (Drag Source):       │
│  ┌──────────┐ ┌──────────┐         │
│  │Merchants │ │  Offers  │         │
│  └──────────┘ └──────────┘         │
│  ┌──────────┐                       │
│  │Campaigns │                       │
│  └──────────┘                       │
├─────────────────────────────────────┤
│ Wizard Canvas (Drop Target):        │
│  ┌─────┐    ┌──────┐    ┌────────┐│
│  │  M  │ -> │  O   │ -> │   C    ││
│  └─────┘    └──────┘    └────────┘│
│  Full Launch Wizard                 │
└─────────────────────────────────────┘
```

**Predefined Wizard Templates**:

1. **Quick Campaign**: Offers → Campaigns
2. **Full Launch**: Merchants → Offers → Campaigns
3. **Merchant Onboarding**: Merchants only
4. **Offer Creation**: Offers only

## Integration with Existing Features

### Offer Manager (Unchanged)

- The existing Offer Manager feature at `/offer-manager` is **fully preserved**
- New `/offers` route added as the canonical URL going forward
- All existing functionality, wizards, and AI agent integration remains intact
- Redux state (`offerManager` slice) unchanged
- API service (`offersService.ts`) unchanged

### Backward Compatibility

- `/offer-manager` route continues to work
- All existing bookmarks, links, and integrations remain functional
- Gradual migration to `/offers` can happen over time

## File Structure

```
kigo-pro-dashboard/
├── app/
│   ├── merchants/
│   │   └── page.tsx ✅
│   ├── offers/
│   │   └── page.tsx ✅
│   ├── campaigns-module/
│   │   └── page.tsx ✅
│   └── offer-manager/
│       └── page.tsx (existing, unchanged)
│
├── components/
│   └── features/
│       ├── merchant-manager/
│       │   └── MerchantManagerView.tsx ✅
│       ├── offer-manager/
│       │   ├── OfferManagerView.tsx (existing)
│       │   ├── steps/ (existing)
│       │   └── components/ (existing)
│       └── campaign-manager/
│           └── CampaignManagerView.tsx ✅
│
├── lib/
│   ├── redux/
│   │   ├── store.ts ✅ (updated)
│   │   └── slices/
│   │       ├── merchantManagerSlice.ts ✅
│   │       ├── offerManagerSlice.ts (existing)
│   │       └── campaignManagerSlice.ts ✅
│   └── services/
│       ├── merchantsService.ts ✅
│       ├── offersService.ts (existing)
│       └── campaignsService.ts ✅
│
└── types/
    ├── merchants.ts ✅
    ├── offers.ts (existing)
    └── campaigns.ts ✅
```

## Usage Examples

### Standalone Module Usage

```tsx
// Navigate to any module independently
<Link href="/merchants">Manage Merchants</Link>
<Link href="/offers">Manage Offers</Link>
<Link href="/campaigns-module">Manage Campaigns</Link>
```

### State Access

```tsx
// In any component
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";

const { merchants, isCreatingMerchant } = useAppSelector(
  (state) => state.merchantManager
);
const { selectedOffer, offerSelectionMode } = useAppSelector(
  (state) => state.offerManager
);
const { campaigns, isCreatingCampaign } = useAppSelector(
  (state) => state.campaignManager
);
```

### API Service Usage

```tsx
import { merchantsService } from "@/lib/services/merchantsService";
import { offersService } from "@/lib/services/offersService";
import { campaignsService } from "@/lib/services/campaignsService";

// Fetch data
const { data: merchants, error } = await merchantsService.listMerchants();
const { data: offers, error } = await offersService.listOffers();
const { data: campaigns, error } = await campaignsService.listCampaigns();
```

## Next Steps

1. **Update Sidebar Navigation** (manual edit required - see Pending section)
2. **Implement Merchant Manager Wizard** (following V1 requirements)
3. **Implement Campaign Manager Wizard** (following Future Vision requirements)
4. **Build Workflow Builder** (drag-and-drop composer for custom wizards)
5. **Add Inter-Module Navigation** (quick links between related entities)

## Notes

- The existing Offer Manager feature is completely untouched and continues to work as before
- The new modular architecture extends around the existing functionality
- All three modules use consistent patterns for state management, API services, and routing
- Backend endpoints need to be implemented to match the API service contracts
- The sidebar manual update is the only remaining task to complete the frontend architecture
