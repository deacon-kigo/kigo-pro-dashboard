# Campaign Management - Quick Start Guide

**For Developers** | **Created:** 2025-11-06

---

## 🚀 TL;DR

Complete design for Campaign Management feature is ready. Follow existing patterns from Ad Groups and Offer Manager. All foundation code (types, Redux, API service) is done.

---

## 📁 What's Been Created

| File                                                                                                                  | Status   | Description                             |
| --------------------------------------------------------------------------------------------------------------------- | -------- | --------------------------------------- |
| [types/campaign-management.ts](../../types/campaign-management.ts)                                                    | ✅ Ready | All TypeScript types (500+ lines)       |
| [lib/services/campaignManagementService.ts](../../lib/services/campaignManagementService.ts)                          | ✅ Ready | Complete API service layer (460+ lines) |
| [lib/redux/slices/campaignManagementSlice.ts](../../lib/redux/slices/campaignManagementSlice.ts)                      | ✅ Ready | Redux state management (420+ lines)     |
| [documentation/brd/campaign-management.md](../brd/campaign-management.md)                                             | ✅ Ready | Business requirements                   |
| [documentation/features/campaign-management-design.md](campaign-management-design.md)                                 | ✅ Ready | Detailed design spec (1,100+ lines)     |
| [documentation/features/campaign-management-implementation-summary.md](campaign-management-implementation-summary.md) | ✅ Ready | Implementation guide                    |

---

## 🎯 What You Need to Build

### Components (10 total)

**Core UI Components:**

1. `CampaignStatusBadge` - Status indicator with colors
2. `CampaignCard` - Individual campaign in grid
3. `CampaignFilters` - Search + filter controls
4. `CampaignStats` - Dashboard stat cards
5. `ConfirmActionDialog` - Confirmation modals

**Step Components:** 6. `BasicInfoStep` - Partner, Program, Name, Type 7. `ConfigurationStep` - Description, Dates, Settings 8. `ReviewStep` - Summary and confirmation

**Page Components:** 9. `CampaignListView` - Main list page 10. `CampaignCreationWizard` - Multi-step wizard

### Pages (3 total)

1. `app/campaign-management/page.tsx` - Campaign list
2. `app/campaign-management/create/page.tsx` - Creation wizard
3. `app/campaign-management/[campaignId]/page.tsx` - Details/Edit

---

## 🔧 Setup Steps

### 1. Add Redux Reducer (2 minutes)

```typescript
// lib/redux/store.ts
import campaignManagementReducer from "./slices/campaignManagementSlice";

export const store = configureStore({
  reducer: {
    // ... existing reducers
    campaignManagement: campaignManagementReducer,
  },
});
```

### 2. Review Existing Patterns (10 minutes)

Copy patterns from:

- **List View:** [app/campaigns/ad-groups/page.tsx](../../app/campaigns/ad-groups/page.tsx)
- **Wizard:** [components/features/offer-manager/OfferManagerView.tsx](../../components/features/offer-manager/OfferManagerView.tsx)
- **Dashboard:** [components/features/offer-manager/OfferManagerDashboard.tsx](../../components/features/offer-manager/OfferManagerDashboard.tsx)

### 3. Start Building (See checklist below)

---

## ✅ Build Checklist

```
Phase 1: Foundation ✅ DONE
├─ [x] Types
├─ [x] Redux slice
├─ [x] API service
└─ [x] Documentation

Phase 2: Core Components (Start Here!)
├─ [ ] CampaignStatusBadge
├─ [ ] CampaignCard
├─ [ ] CampaignFilters
├─ [ ] CampaignStats
└─ [ ] ConfirmActionDialog

Phase 3: List Page
├─ [ ] app/campaign-management/page.tsx
├─ [ ] Connect Redux
├─ [ ] Add filters
└─ [ ] Add pagination

Phase 4: Creation Wizard
├─ [ ] app/campaign-management/create/page.tsx
├─ [ ] BasicInfoStep
├─ [ ] ConfigurationStep
├─ [ ] ReviewStep
└─ [ ] Wire up submission

Phase 5: Details Page
├─ [ ] app/campaign-management/[campaignId]/page.tsx
├─ [ ] View mode
├─ [ ] Edit mode
└─ [ ] Delete function

Phase 6: Polish
├─ [ ] Toasts
├─ [ ] Loading states
├─ [ ] Error handling
└─ [ ] Responsive design
```

---

## 🎨 Key Design Decisions

| Decision             | Rationale                     |
| -------------------- | ----------------------------- |
| **3-step wizard**    | Simple, focused steps         |
| **Vertical stepper** | Consistent with Offer Manager |
| **Card-based list**  | Better UX, responsive         |
| **Redux state**      | Centralized, debuggable       |
| **CST timezone**     | BRD requirement               |

---

## 📊 Data Models Quick Reference

### Campaign Object

```typescript
{
  id: string;
  partner_id: string;
  partner_name: string;
  program_id: string;
  program_name: string;
  name: string; // unique within program
  type: 'promotional' | 'targeted' | 'seasonal';
  description?: string; // max 256 chars
  start_date: string; // ISO datetime
  end_date: string;
  active: boolean;
  auto_activate: boolean;
  auto_deactivate: boolean;
  has_products: boolean; // computed
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'ended'; // computed
  created_at: string;
  created_by: string;
  updated_at?: string;
  updated_by?: string;
}
```

### Status Colors

```typescript
{
  draft: 'gray',
  scheduled: 'blue',
  active: 'green',
  paused: 'yellow',
  ended: 'red',
}
```

---

## 🔌 API Endpoints

**Base:** `/api/v1/campaign-management`

| Method | Endpoint         | Purpose         |
| ------ | ---------------- | --------------- |
| GET    | `/`              | List campaigns  |
| POST   | `/`              | Create campaign |
| GET    | `/:id`           | Get details     |
| PATCH  | `/:id`           | Update campaign |
| DELETE | `/:id`           | Delete campaign |
| GET    | `/stats`         | Get stats       |
| GET    | `/check-name`    | Validate name   |
| GET    | `/export`        | Export CSV      |
| POST   | `/:id/duplicate` | Duplicate       |

**Also needed:**

- `GET /api/v1/partners`
- `GET /api/v1/programs?partner_id={id}`

---

## 🎯 Validation Rules

| Field           | Rules                                      |
| --------------- | ------------------------------------------ |
| **Partner**     | Required                                   |
| **Program**     | Required, filtered by partner              |
| **Name**        | Required, max 100 chars, unique in program |
| **Type**        | Required                                   |
| **Description** | Optional, max 256 chars                    |
| **Start Date**  | Required, can't be past (on create)        |
| **End Date**    | Required, must be after start              |

---

## 💡 Usage Examples

### Using Redux Actions

```typescript
import { useDispatch, useSelector } from "react-redux";
import {
  startCampaignCreation,
  updateFormData,
} from "@/lib/redux/slices/campaignManagementSlice";

const dispatch = useDispatch();
const { formData, currentStep } = useSelector(
  (state) => state.campaignManagement
);

// Start wizard
dispatch(startCampaignCreation());

// Update form
dispatch(updateFormData({ name: "Summer Sale" }));
```

### Using API Service

```typescript
import { campaignManagementService } from "@/lib/services/campaignManagementService";

// List campaigns
const { data, success } = await campaignManagementService.listCampaigns({
  status: "active",
  limit: 25,
});

// Create campaign
const { data: newCampaign } = await campaignManagementService.createCampaign({
  partner_id: "partner-123",
  program_id: "program-456",
  name: "Summer Sale",
  type: "promotional",
  start_date: "2025-06-01T00:00:00Z",
  end_date: "2025-08-31T23:59:59Z",
  active: false,
  auto_activate: true,
  auto_deactivate: true,
});
```

### Using Types

```typescript
import type {
  CampaignManagement,
  CampaignManagementFormData,
  CampaignManagementStatus,
} from "@/types/campaign-management";

const campaign: CampaignManagement = {
  // ... fully typed
};
```

---

## 🎨 Component Templates

### CampaignStatusBadge

```tsx
import { Badge } from "@/components/ui/badge";

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  scheduled: "bg-blue-100 text-blue-800",
  active: "bg-green-100 text-green-800",
  paused: "bg-yellow-100 text-yellow-800",
  ended: "bg-red-100 text-red-800",
};

export function CampaignStatusBadge({ status }) {
  return <Badge className={statusColors[status]}>{status}</Badge>;
}
```

### CampaignCard

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CampaignStatusBadge } from "./CampaignStatusBadge";

export function CampaignCard({ campaign, onEdit, onDelete }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{campaign.name}</CardTitle>
        <p className="text-sm text-gray-600">
          {campaign.partner_name} | {campaign.program_name}
        </p>
      </CardHeader>
      <CardContent>
        <CampaignStatusBadge status={campaign.status} />
        {!campaign.has_products && (
          <Alert variant="warning">No products linked</Alert>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## 📚 Documentation Links

- **Business Requirements:** [BRD](../brd/campaign-management.md)
- **Detailed Design:** [Design Spec](campaign-management-design.md)
- **Implementation Guide:** [Implementation Summary](campaign-management-implementation-summary.md)
- **This Guide:** You are here!

---

## 🎓 Learning Resources

### Existing Code to Study

1. **Ad Groups Page** - List view pattern

   - File: [app/campaigns/ad-groups/page.tsx](../../app/campaigns/ad-groups/page.tsx)
   - Learn: Filters, search, card layout

2. **Offer Manager** - Wizard pattern

   - File: [components/features/offer-manager/OfferManagerView.tsx](../../components/features/offer-manager/OfferManagerView.tsx)
   - Learn: Stepper, multi-step form, navigation

3. **Offer Manager Slice** - Redux pattern

   - File: [lib/redux/slices/offerManagerSlice.ts](../../lib/redux/slices/offerManagerSlice.ts)
   - Learn: State management, actions

4. **Offers Service** - API pattern
   - File: [lib/services/offersService.ts](../../lib/services/offersService.ts)
   - Learn: API calls, error handling

---

## ⏱️ Estimated Time

| Phase     | Components        | Time             |
| --------- | ----------------- | ---------------- |
| Setup     | Redux integration | 30 min           |
| Phase 2   | 5 core components | 4-6 hours        |
| Phase 3   | List page         | 4-6 hours        |
| Phase 4   | Creation wizard   | 8-10 hours       |
| Phase 5   | Details page      | 4-6 hours        |
| Phase 6   | Polish & testing  | 6-8 hours        |
| **Total** |                   | **~30-40 hours** |

---

## 🐛 Common Pitfalls to Avoid

1. ❌ Don't fetch partners/programs on every render

   - ✅ Fetch once and cache

2. ❌ Don't allow partner/program edit after creation

   - ✅ Lock these fields in edit mode

3. ❌ Don't forget to reset wizard state on cancel

   - ✅ Call `resetWizard()` action

4. ❌ Don't skip confirmation for activate/deactivate

   - ✅ Always show confirmation dialog

5. ❌ Don't forget CST timezone indication
   - ✅ Show "(CST)" label on date inputs

---

## 🎉 You're Ready!

Everything you need is documented. Start with Phase 2 (Core Components) and follow the checklist.

**Questions?** Check the detailed design doc or implementation summary.

**Happy coding!** 🚀

---

**Last Updated:** 2025-11-06
