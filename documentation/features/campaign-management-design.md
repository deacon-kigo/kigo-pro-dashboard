# Campaign Management - Complete Design Specification

**Created:** 2025-11-06
**Status:** Ready for Implementation
**Related BRD:** [campaign-management.md](../brd/campaign-management.md)

---

## Overview

This document provides the complete design specification for the Campaign Management feature in KigoPro, following established patterns from Ad Groups and Offer Manager.

---

## Architecture Overview

### File Structure

```
app/
└── campaign-management/
    ├── page.tsx                    # Campaign list/dashboard (main entry)
    ├── create/
    │   └── page.tsx                # Campaign creation wizard
    └── [campaignId]/
        ├── page.tsx                # Campaign details view
        └── edit/
            └── page.tsx            # Campaign edit view

components/features/campaign-management/
├── CampaignDashboard.tsx           # Main dashboard component
├── CampaignListView.tsx            # List with filters & search
├── CampaignCard.tsx                # Individual campaign card
├── CampaignCreationWizard.tsx      # Multi-step creation form
├── CampaignDetailsView.tsx         # View/Edit individual campaign
├── steps/
│   ├── BasicInfoStep.tsx           # Step 1: Name, Partner, Program, Type
│   ├── ConfigurationStep.tsx       # Step 2: Description, Dates, Active status
│   └── ReviewStep.tsx              # Step 3: Review & confirm
└── components/
    ├── CampaignFilters.tsx         # Search + filter controls
    ├── CampaignStats.tsx           # Quick stats cards
    ├── CampaignStatusBadge.tsx     # Status indicator
    └── ConfirmActionDialog.tsx     # Activation/deactivation confirmation

types/
└── campaign-management.ts          # TypeScript definitions

lib/redux/slices/
└── campaignManagementSlice.ts      # Redux state management

lib/api/
└── campaign-management.ts          # API integration
```

---

## Design Patterns Used

### 1. Layout Pattern: AppLayout Template

- **Reference:** Ad Groups page ([app/campaigns/ad-groups/page.tsx](../../app/campaigns/ad-groups/page.tsx))
- **Components:** AppLayout wrapper with breadcrumbs

### 2. List/Dashboard Pattern: Card-based Grid

- **Reference:** Offer Manager Dashboard ([components/features/offer-manager/OfferManagerDashboard.tsx](../../components/features/offer-manager/OfferManagerDashboard.tsx))
- **Components:** Card grid with filters, search, stats

### 3. Creation Flow Pattern: Vertical Stepper Wizard

- **Reference:** Offer Manager Creation ([components/features/offer-manager/OfferManagerView.tsx](../../components/features/offer-manager/OfferManagerView.tsx))
- **Components:** Stepper sidebar + form content area

### 4. State Management Pattern: Redux Slice

- **Reference:** offerManagerSlice ([lib/redux/slices/offerManagerSlice.ts](../../lib/redux/slices/offerManagerSlice.ts))
- **Pattern:** Centralized state with typed actions

---

## Page Designs

## 1. Campaign List/Dashboard Page

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ AppLayout Header                                            │
├─────────────────────────────────────────────────────────────┤
│ Breadcrumb: Home > Campaign Management                      │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Campaign Management                    [+ New Campaign]  │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Quick Stats Row                                         │ │
│ │ [Total: 24] [Active: 12] [Scheduled: 5] [Ended: 7]     │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Filters & Search                                        │ │
│ │ [Search...]  [Partner ▼]  [Program ▼]  [Status ▼]      │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Campaigns Table/Grid                                    │ │
│ │                                                         │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ Campaign Card 1                                     │ │ │
│ │ │ Name: "Summer Savings 2025"                         │ │ │
│ │ │ Partner: Acme Corp | Program: Rewards Plus          │ │ │
│ │ │ Type: Promotional | [Active] | Jun 1 - Aug 31      │ │ │
│ │ │ ⚠️ No products linked                    [...Menu]   │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │                                                         │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ Campaign Card 2                                     │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │                                                         │ │
│ │ [< Previous]  Page 1 of 3  [Next >]                   │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Key Features

- **Header:** Title + "New Campaign" button (primary blue)
- **Quick Stats:** 4 stat cards showing counts with trend indicators
- **Filters:** Search input + 3 dropdowns (Partner, Program, Status)
- **Campaign Cards:** Grid layout, 3 columns on desktop, responsive
- **Pagination:** 25 items per page, bottom navigation
- **Empty State:** When no campaigns, show CTA to create first campaign

### Campaign Card Structure

```tsx
<Card className="hover:shadow-lg transition-shadow">
  <CardHeader>
    <div className="flex justify-between items-start">
      <div>
        <CardTitle>{campaign.name}</CardTitle>
        <CardDescription>
          {campaign.partner_name} | {campaign.program_name}
        </CardDescription>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>⋮</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Badge>{campaign.type}</Badge>
        <CampaignStatusBadge status={campaign.status} />
      </div>
      <div className="text-sm text-gray-600">
        {formatDateRange(campaign.start_date, campaign.end_date)}
      </div>
      {!campaign.has_products && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No products linked</AlertDescription>
        </Alert>
      )}
    </div>
  </CardContent>
  <CardFooter>
    <div className="flex items-center justify-between w-full">
      <Switch
        checked={campaign.active}
        onCheckedChange={(checked) => handleStatusToggle(campaign.id, checked)}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(`/campaign-management/${campaign.id}`)}
      >
        View Details
      </Button>
    </div>
  </CardFooter>
</Card>
```

---

## 2. Campaign Creation Wizard

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ AppLayout Header                                            │
├─────────────────────────────────────────────────────────────┤
│ Breadcrumb: Home > Campaign Management > Create              │
├──────────────┬──────────────────────────────────────────────┤
│  Stepper     │  Form Content Area                           │
│  Sidebar     │                                              │
│              │  ┌────────────────────────────────────────┐  │
│ ● 1. Basic   │  │ Step 1: Basic Information              │  │
│   Info       │  │                                        │  │
│              │  │ Partner *                              │  │
│ ○ 2. Config  │  │ [Select Partner ▼]                    │  │
│              │  │                                        │  │
│ ○ 3. Review  │  │ Program *                              │  │
│              │  │ [Select Program ▼]                     │  │
│              │  │                                        │  │
│              │  │ Campaign Name *                        │  │
│              │  │ [Enter name...]                        │  │
│              │  │                                        │  │
│              │  │ Campaign Type *                        │  │
│              │  │ ○ Promotional                          │  │
│              │  │ ○ Targeted                             │  │
│              │  │ ○ Seasonal                             │  │
│              │  │                                        │  │
│              │  └────────────────────────────────────────┘  │
│              │                                              │
│              │  [Cancel]                    [Next Step →]  │
└──────────────┴──────────────────────────────────────────────┘
```

### Step 1: Basic Information

**Fields:**

- **Partner** (Dropdown, required)
  - Fetches from `/api/partners`
  - Filters programs in next dropdown
- **Program** (Dropdown, required)
  - Filtered by selected partner
  - Fetches from `/api/programs?partner_id={partnerId}`
- **Campaign Name** (Text input, required)
  - Max 100 characters
  - Must be unique within program
  - Real-time validation
- **Campaign Type** (Radio group, required)
  - Options: Promotional, Targeted, Seasonal
  - Single selection

**Validation:**

- All fields required before "Next"
- Campaign name uniqueness check via API
- Show error messages inline

### Step 2: Configuration

**Fields:**

- **Description** (Textarea, optional)
  - Max 256 characters
  - Character counter shown
  - Helper text: "Internal-facing only, not visible to customers"
- **Start Date** (Date picker, required)
  - Calendar modal
  - Default: Today
  - Timezone: CST (displayed)
  - Cannot be in the past
- **End Date** (Date picker, required)
  - Calendar modal
  - Must be after start date
  - Validation on both dates
- **Active Status** (Toggle, default: off)
  - Switch component
  - Label: "Activate immediately"
- **Auto-activate** (Checkbox)
  - Enabled only if active is off
  - Label: "Automatically activate on start date"
- **Auto-deactivate** (Checkbox)
  - Label: "Automatically deactivate on end date"

**Validation:**

- Start date required and cannot be past
- End date required and must be after start
- If active is on, disable auto-activate

### Step 3: Review & Confirm

**Layout:**

- Summary card with all entered data
- Sections: Basic Info, Configuration
- Edit buttons per section to go back to specific step
- Warning banner if no products linked (read-only, informational)
- Terms checkbox: "I confirm this information is correct"

**Actions:**

- **Cancel:** Confirm dialog → go back to list
- **Previous:** Go to step 2
- **Create Campaign:** Submit form
  - Show loading state
  - On success: Toast notification + redirect to campaign details
  - On error: Show error message, stay on page

---

## 3. Campaign Details/Edit View

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ AppLayout Header                                            │
├─────────────────────────────────────────────────────────────┤
│ Breadcrumb: Home > Campaign Management > {Campaign Name}    │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Summer Savings 2025              [Edit] [Delete] [...] │ │
│ │ [Active Badge]                                          │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────┬────────────────────────────────┐   │
│ │ Basic Information    │  Configuration                 │   │
│ │                      │                                │   │
│ │ Partner: Acme Corp   │  Start: Jun 1, 2025           │   │
│ │ Program: Rewards+    │  End: Aug 31, 2025            │   │
│ │ Type: Promotional    │  Status: Active               │   │
│ │ Name: Summer...      │  Auto-deactivate: Yes         │   │
│ │                      │                                │   │
│ │ Description:         │  Created: May 1, 2025         │   │
│ │ Lorem ipsum...       │  By: john@acme.com            │   │
│ │                      │  Updated: May 15, 2025        │   │
│ │                      │  By: jane@acme.com            │   │
│ └──────────────────────┴────────────────────────────────┘   │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Products                                                │ │
│ │ ⚠️ No products linked to this campaign                  │ │
│ │ [Link Products] (future feature)                       │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### View Mode

- Read-only display of all campaign data
- Edit button in header → switches to edit mode
- Delete button → confirmation dialog
- Status toggle with confirmation
- Audit trail section (created_by, updated_by, timestamps)

### Edit Mode

- Same fields as creation wizard (except Partner & Program locked)
- Inline editing without wizard steps
- Save/Cancel buttons
- Real-time validation
- Confirmation before activating/deactivating
- Track updated_by and updated_at on save

---

## Component Specifications

### CampaignStatusBadge Component

```tsx
type CampaignStatus = "draft" | "scheduled" | "active" | "paused" | "ended";

interface Props {
  status: CampaignStatus;
}

// Color mapping:
// - draft: gray
// - scheduled: blue
// - active: green
// - paused: yellow
// - ended: red
```

### CampaignFilters Component

```tsx
interface CampaignFiltersProps {
  onFilterChange: (filters: CampaignFilters) => void;
  partners: Partner[];
  programs: Program[];
}

interface CampaignFilters {
  search: string;
  partner_id?: string;
  program_id?: string;
  status?: CampaignStatus;
}
```

### CampaignStats Component

```tsx
interface CampaignStatsProps {
  total: number;
  active: number;
  scheduled: number;
  ended: number;
}

// Displays 4 stat cards in a grid
// Each card shows count with trend indicator (optional)
```

### ConfirmActionDialog Component

```tsx
interface ConfirmActionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string; // default: "Confirm"
  cancelText?: string; // default: "Cancel"
  variant?: "default" | "destructive";
}

// Used for:
// - Activate campaign confirmation
// - Deactivate campaign confirmation
// - Delete campaign confirmation
```

---

## State Management

### Redux Slice: campaignManagementSlice

```typescript
interface CampaignManagementState {
  // Wizard state
  isCreating: boolean;
  currentStep: "basic" | "configuration" | "review";
  formData: CreateCampaignFormData;

  // List state
  campaigns: Campaign[];
  filters: CampaignFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };

  // Loading & errors
  loading: boolean;
  error: string | null;

  // Selected campaign (for details view)
  selectedCampaign: Campaign | null;
}

interface CreateCampaignFormData {
  // Step 1: Basic Info
  partner_id: string;
  program_id: string;
  name: string;
  type: "promotional" | "targeted" | "seasonal";

  // Step 2: Configuration
  description?: string;
  start_date: string; // ISO string
  end_date: string; // ISO string
  active: boolean;
  auto_activate: boolean;
  auto_deactivate: boolean;
}

// Actions
const campaignManagementSlice = createSlice({
  name: "campaignManagement",
  initialState,
  reducers: {
    // Wizard actions
    startCampaignCreation: (state) => {
      /* ... */
    },
    setCurrentStep: (state, action: PayloadAction<Step>) => {
      /* ... */
    },
    updateFormData: (
      state,
      action: PayloadAction<Partial<CreateCampaignFormData>>
    ) => {
      /* ... */
    },
    resetWizard: (state) => {
      /* ... */
    },

    // List actions
    setCampaigns: (state, action: PayloadAction<Campaign[]>) => {
      /* ... */
    },
    setFilters: (state, action: PayloadAction<Partial<CampaignFilters>>) => {
      /* ... */
    },
    setPagination: (state, action: PayloadAction<Partial<Pagination>>) => {
      /* ... */
    },

    // Campaign actions
    setSelectedCampaign: (state, action: PayloadAction<Campaign>) => {
      /* ... */
    },
    updateCampaign: (state, action: PayloadAction<Campaign>) => {
      /* ... */
    },
    deleteCampaign: (state, action: PayloadAction<string>) => {
      /* ... */
    },

    // Loading & errors
    setLoading: (state, action: PayloadAction<boolean>) => {
      /* ... */
    },
    setError: (state, action: PayloadAction<string | null>) => {
      /* ... */
    },
  },
});
```

---

## Type Definitions

### Core Types (types/campaign-management.ts)

```typescript
// Campaign Management specific types
export type CampaignManagementStatus = "draft" | "active" | "paused" | "ended";
export type CampaignManagementType = "promotional" | "targeted" | "seasonal";

export interface CampaignManagement {
  id: string;
  partner_id: string;
  partner_name: string;
  program_id: string;
  program_name: string;
  name: string;
  type: CampaignManagementType;
  description?: string;
  start_date: string; // ISO datetime
  end_date: string; // ISO datetime
  active: boolean;
  auto_activate: boolean;
  auto_deactivate: boolean;
  has_products: boolean; // computed field
  status: CampaignManagementStatus; // computed from dates + active
  created_at: string;
  created_by: string;
  updated_at?: string;
  updated_by?: string;
}

export interface CreateCampaignManagementInput {
  partner_id: string;
  program_id: string;
  name: string;
  type: CampaignManagementType;
  description?: string;
  start_date: string;
  end_date: string;
  active: boolean;
  auto_activate: boolean;
  auto_deactivate: boolean;
}

export interface UpdateCampaignManagementInput {
  name?: string;
  type?: CampaignManagementType;
  description?: string;
  start_date?: string;
  end_date?: string;
  active?: boolean;
  auto_activate?: boolean;
  auto_deactivate?: boolean;
}

export interface CampaignManagementListParams {
  page?: number;
  limit?: number;
  search?: string;
  partner_id?: string;
  program_id?: string;
  status?: CampaignManagementStatus;
  sort_by?: "name" | "start_date" | "end_date" | "created_at";
  sort_order?: "asc" | "desc";
}

export interface CampaignManagementListResponse {
  campaigns: CampaignManagement[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface CampaignManagementStats {
  total: number;
  active: number;
  scheduled: number;
  ended: number;
  draft: number;
}

// Form state
export interface CampaignManagementFormData {
  partner_id: string;
  program_id: string;
  name: string;
  type: CampaignManagementType | "";
  description: string;
  start_date: Date | null;
  end_date: Date | null;
  active: boolean;
  auto_activate: boolean;
  auto_deactivate: boolean;
}

// Validation errors
export interface CampaignManagementFormErrors {
  partner_id?: string;
  program_id?: string;
  name?: string;
  type?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  general?: string;
}
```

---

## API Integration

### API Routes (lib/api/campaign-management.ts)

```typescript
const BASE_URL = "/api/v1/campaign-management";

export const campaignManagementApi = {
  // List campaigns
  list: async (
    params: CampaignManagementListParams
  ): Promise<CampaignManagementListResponse> => {
    const queryString = new URLSearchParams(params as any).toString();
    const response = await fetch(`${BASE_URL}?${queryString}`);
    return response.json();
  },

  // Get single campaign
  get: async (id: string): Promise<CampaignManagement> => {
    const response = await fetch(`${BASE_URL}/${id}`);
    return response.json();
  },

  // Create campaign
  create: async (
    data: CreateCampaignManagementInput
  ): Promise<CampaignManagement> => {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Update campaign
  update: async (
    id: string,
    data: UpdateCampaignManagementInput
  ): Promise<CampaignManagement> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Delete campaign
  delete: async (id: string): Promise<void> => {
    await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },

  // Get stats
  stats: async (): Promise<CampaignManagementStats> => {
    const response = await fetch(`${BASE_URL}/stats`);
    return response.json();
  },

  // Check name uniqueness
  checkNameUnique: async (
    programId: string,
    name: string,
    excludeId?: string
  ): Promise<boolean> => {
    const params = new URLSearchParams({
      program_id: programId,
      name,
      ...(excludeId && { exclude_id: excludeId }),
    });
    const response = await fetch(`${BASE_URL}/check-name?${params}`);
    const data = await response.json();
    return data.unique;
  },
};
```

---

## Validation Rules

### Field Validation

```typescript
export const validateCampaignForm = (
  data: CampaignManagementFormData,
  step: "basic" | "configuration"
): CampaignManagementFormErrors => {
  const errors: CampaignManagementFormErrors = {};

  if (step === "basic" || step === "configuration") {
    // Partner validation
    if (!data.partner_id) {
      errors.partner_id = "Partner is required";
    }

    // Program validation
    if (!data.program_id) {
      errors.program_id = "Program is required";
    }

    // Name validation
    if (!data.name.trim()) {
      errors.name = "Campaign name is required";
    } else if (data.name.length > 100) {
      errors.name = "Campaign name must be 100 characters or less";
    }

    // Type validation
    if (!data.type) {
      errors.type = "Campaign type is required";
    }
  }

  if (step === "configuration") {
    // Description validation
    if (data.description && data.description.length > 256) {
      errors.description = "Description must be 256 characters or less";
    }

    // Start date validation
    if (!data.start_date) {
      errors.start_date = "Start date is required";
    } else if (data.start_date < new Date() && !data.id) {
      // Only check for past dates on creation
      errors.start_date = "Start date cannot be in the past";
    }

    // End date validation
    if (!data.end_date) {
      errors.end_date = "End date is required";
    } else if (data.start_date && data.end_date <= data.start_date) {
      errors.end_date = "End date must be after start date";
    }
  }

  return errors;
};
```

---

## User Interactions & Feedback

### Toast Notifications

```typescript
// Success messages
toast.success("Campaign created successfully");
toast.success("Campaign updated successfully");
toast.success("Campaign activated");
toast.success("Campaign deactivated");
toast.success("Campaign deleted");

// Error messages
toast.error("Failed to create campaign");
toast.error("Failed to update campaign");
toast.error("Campaign name already exists in this program");
toast.error("Invalid date range");

// Warning messages
toast.warning("This campaign has no products linked");
```

### Confirmation Dialogs

**Activate Campaign:**

```
Title: "Activate Campaign?"
Message: "This campaign will become active immediately. Are you sure you want to continue?"
Buttons: Cancel | Activate
```

**Deactivate Campaign:**

```
Title: "Deactivate Campaign?"
Message: "This will stop the campaign from running. You can reactivate it later."
Buttons: Cancel | Deactivate
```

**Delete Campaign:**

```
Title: "Delete Campaign?"
Message: "This action cannot be undone. Are you sure you want to delete '{campaignName}'?"
Buttons: Cancel | Delete (red/destructive)
```

### Loading States

- **List page:** Skeleton cards while loading
- **Form submission:** Button shows spinner + disabled state
- **Status toggle:** Switch shows loading state
- **Details page:** Skeleton content while loading

### Empty States

**No Campaigns:**

```
Icon: Calendar or Campaign icon
Title: "No campaigns yet"
Description: "Create your first campaign to get started"
Button: "Create Campaign" (primary)
```

**No Results from Filter:**

```
Icon: Search icon
Title: "No campaigns found"
Description: "Try adjusting your filters"
Button: "Clear Filters"
```

---

## Accessibility Requirements

- All form inputs have associated labels
- Required fields marked with asterisk and aria-required
- Error messages linked with aria-describedby
- Keyboard navigation for all interactive elements
- Focus visible indicators
- ARIA labels for icon buttons
- Status badges have aria-label for screen readers
- Dialog/modal focus traps
- Color contrast meets WCAG 2.1 AA standards

---

## Responsive Design

### Desktop (≥1024px)

- 3-column grid for campaign cards
- Full filters visible
- Stepper sidebar 280px fixed width

### Tablet (768px - 1023px)

- 2-column grid for campaign cards
- Filters in collapsible panel
- Stepper sidebar 240px

### Mobile (<768px)

- 1-column stack for campaign cards
- Filters in slide-out drawer
- Horizontal stepper at top (progress dots)
- Full-width form inputs

---

## Performance Considerations

- Debounce search input (300ms)
- Virtualize long lists if >100 items
- Lazy load campaign details
- Optimize partner/program dropdown queries
- Cache filter options
- Prefetch next page on pagination hover
- Optimistic UI updates for toggles

---

## Future Enhancements (Out of V1 Scope)

- Bulk actions (activate/deactivate multiple)
- Campaign duplication
- Product association UI
- Advanced filtering (date ranges, custom fields)
- Campaign templates
- Analytics dashboard
- Export campaigns to CSV
- Campaign history/audit log UI
- Partner-facing access
- Notifications for campaign start/end
- AI-powered campaign suggestions

---

## Implementation Checklist

### Phase 1: Foundation

- [ ] Create type definitions
- [ ] Create Redux slice
- [ ] Create API integration layer
- [ ] Set up routing structure

### Phase 2: Components

- [ ] CampaignStatusBadge
- [ ] CampaignCard
- [ ] CampaignFilters
- [ ] CampaignStats
- [ ] ConfirmActionDialog

### Phase 3: List View

- [ ] CampaignListView component
- [ ] CampaignDashboard integration
- [ ] Filters & search functionality
- [ ] Pagination
- [ ] Empty states

### Phase 4: Creation Wizard

- [ ] CampaignCreationWizard shell
- [ ] BasicInfoStep component
- [ ] ConfigurationStep component
- [ ] ReviewStep component
- [ ] Wizard navigation logic
- [ ] Form validation

### Phase 5: Details/Edit

- [ ] CampaignDetailsView component
- [ ] Edit mode functionality
- [ ] Status toggle with confirmation
- [ ] Delete functionality

### Phase 6: Polish

- [ ] Toast notifications
- [ ] Loading states
- [ ] Error handling
- [ ] Accessibility audit
- [ ] Responsive testing
- [ ] Performance optimization

---

## Reference Files

### Key Components to Reference

- [AppLayout](../../components/templates/AppLayout/AppLayout.tsx)
- [Stepper](../../components/ui/stepper.tsx)
- [Ad Groups Page](../../app/campaigns/ad-groups/page.tsx)
- [Offer Manager View](../../components/features/offer-manager/OfferManagerView.tsx)
- [Offer Manager Dashboard](../../components/features/offer-manager/OfferManagerDashboard.tsx)

### Key Patterns to Follow

- [offerManagerSlice](../../lib/redux/slices/offerManagerSlice.ts)
- [Campaign Types](../../types/campaigns.ts)
- [Offer Types](../../types/offers.ts)

---

## Notes

- This design follows the exact patterns from Ad Groups and Offer Manager
- All components are reusable and follow the existing design system
- State management uses Redux for consistency
- API integration is placeholder - backend endpoints need to be implemented
- Partner & Program are locked after creation per BRD requirements
- Status computation happens backend-side based on dates and active flag
- Auto-activate/deactivate requires backend scheduler implementation
