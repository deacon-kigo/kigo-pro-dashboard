# Member CRM v1 - Architecture & Feature Scope

**Version:** 1.0
**Date:** January 19, 2025
**Status:** In Development
**Module:** Points Management (Core Foundation)

---

## Executive Summary

Member CRM is a **modular feature** designed to grow incrementally. **V1 focuses exclusively on Points Management**, establishing the architectural foundation for future tabs (Profile, Communications, Rewards, etc.).

The design prioritizes:

- **Modularity**: Easy to add new tabs without refactoring
- **Consistency**: Follows Kigo Pro design system and patterns
- **Scalability**: Architecture supports complex future features
- **Data Flexibility**: Type system accommodates various member data

---

## V1 Scope: Points Management

### What's Included in V1

#### 1. **Member Table (List View)**

**Purpose**: Browse, search, and filter members

**Features**:

- ✅ Searchable table with real-time filtering
- ✅ Sortable columns (Member Name, Points Balance, Status, Member Since)
- ✅ Status filter (Active, Inactive, Suspended)
- ✅ Click to view member details
- ✅ Pagination support via DataTable component
- ✅ Row highlighting for recently updated members

**Components**:

- `MemberCRMView.tsx` - Main orchestrator
- `MemberCatalogTable.tsx` - Table wrapper
- `memberColumns.tsx` - Column definitions

**Data Points Shown**:
| Column | Description | Sortable |
|--------|-------------|----------|
| Member Name | Full name + email | ✅ |
| Points Balance | Current points + USD value | ✅ |
| Status | Active/Inactive/Suspended badge | ✅ |
| Member Since | Join date | ✅ |
| Actions | "View Details" button | ❌ |

---

#### 2. **Member Detail View (Two-Panel Layout)**

**Purpose**: Detailed member information with analytics

**Layout**:

- **Left Panel (60% width)**: Tabbed content (Profile, Points, History)
- **Right Panel (40% width)**: Fixed analytics panel
- **Side Navigation (64px)**: Tab switcher + Back button

**Features**:

- ✅ Three tabs: Profile, Points Management, Transaction History
- ✅ Real-time analytics dashboard
- ✅ Modular design: easy to add more tabs
- ✅ Persistent analytics across tab changes

**Components**:

- `MemberDetailView.tsx` - Layout + tab orchestration
- `PointsAnalyticsPanel.tsx` - Analytics (right panel)
- Tab content components (see below)

---

#### 3. **Profile Tab** (Read-Only in V1)

**Purpose**: View member account information

**Features**:

- ✅ Account Information: Name, Email, Phone, Member Since, Status
- ✅ Enrolled Programs: List of loyalty programs with status
- ⚠️ **V1 Limitation**: No editing capabilities (view-only)

**Data Points**:

- Full Name
- Account ID
- Email Address
- Phone Number
- Member Since Date
- Account Status (badge with color coding)
- Programs: Name, Partner, Active/Inactive status

**Future Enhancements** (V2+):

- Edit contact information
- Change account status
- Manage program enrollments
- View activity log

---

#### 4. **Points Management Tab** (Core V1 Feature)

**Purpose**: Adjust points and view balance details

**Features**:

- ✅ **Current Balance Card**: Prominent display with USD value
- ✅ **Lifetime Summary**: Total Earned, Total Redeemed, Adjustments
- ✅ **Adjustment Guidelines**: Best practices reminder
- ✅ **Adjust Points Button**: Opens modal for manual adjustments
- ✅ **Points Adjustment Modal**: Add/Subtract with validation
  - Reason selection (9 predefined reasons)
  - Amount input with balance preview
  - Notes field for audit trail
  - Administrator tracking
  - Prevents over-subtraction

**Data Points**:

- **Current Balance**: Points + USD value + program name
- **Total Earned**: Lifetime earnings
- **Total Redeemed**: Lifetime redemptions
- **Adjustments**: Net manual adjustments
- **Per-Transaction**: Type, Amount, Date, Balance After, Description

**Validation Rules**:

- Cannot subtract more than current balance
- Amount must be positive integer
- Reason is required for all adjustments
- Notes are optional but recommended

---

#### 5. **Transaction History Tab**

**Purpose**: Audit trail of all points activity

**Features**:

- ✅ **Filter by Type**: All, Earned, Redeemed, Adjustments
- ✅ **Auto-Refresh Toggle**: Real-time updates option
- ✅ **Transaction Cards**: Detailed transaction info
  - Type badge (color-coded)
  - Points amount with +/- indicator
  - Date/time stamp
  - Balance after transaction
  - Source details (receipt, redemption, manual)
- ✅ **Receipt Viewer**: Click to view receipt images
- ✅ **Adjustment Details**: Shows admin, reason, notes
- ✅ **Promotion Info**: Displays associated promotions

**Transaction Types**:

1. **Earn**: Receipt-based points earning
   - Shows merchant, receipt total, promotion
   - "View Receipt" button
2. **Redeem**: Points redemption
   - Shows reward type and value
3. **Adjust**: Manual adjustments
   - Shows admin name, reason, notes
   - Warning badge for visibility

**Data Points Per Transaction**:

- Transaction ID
- Type (Earn/Redeem/Adjust)
- Points Amount
- Balance After
- Date/Time
- Description
- Source Type (receipt, redemption, manual)
- Receipt ID (if applicable)
- Merchant Name (for receipts)
- Promotion Name (if applicable)
- Admin Name (for adjustments)
- Adjustment Reason + Notes (for adjustments)

---

#### 6. **Member Analytics Panel** (Right Side, Always Visible)

**Purpose**: Real-time insights and trends

**Features**:

- ✅ **Summary Stats**: Total Earned + Total Redeemed
- ✅ **Points Distribution**: Pie chart (Earned, Redeemed, Current)
- ✅ **Points Balance History**: Line chart of balance over time
- ✅ **Activity by Source**: Bar chart (Receipt, Manual, Redemption)
- ✅ **Active Program Details**: Current program info
- ✅ **Empty States**: Helpful messages when no data

**Charts Included**:

1. **Points Distribution** (Pie Chart)
   - Breakdown: Earned, Redeemed, Current Balance
   - Legend with formatted values
   - Hover tooltips
   - Color-coded segments

2. **Points Balance History** (Line Chart)
   - Last 10 transactions
   - X-Axis: Date
   - Y-Axis: Balance After
   - Shows balance trend over time

3. **Activity by Source** (Bar Chart)
   - Groups transactions by source type
   - Shows transaction count + total points per source
   - Dual bars: Transactions (purple), Points (cyan)

**Empty State Handling**:

- Shows icon + message when no data available
- Encourages member to earn/redeem points

---

## Modular Architecture

### Component Structure

```
components/features/member-crm/
├── MemberCRMView.tsx           # Main orchestrator
├── MemberDetailView.tsx         # Two-panel layout + tab switcher
├── PointsAnalyticsPanel.tsx     # Analytics (right panel)
├── components/
│   ├── MemberCatalogTable.tsx  # Table wrapper
│   ├── memberColumns.tsx       # Column definitions
│   ├── PointsHistory.tsx       # Transaction history tab
│   ├── PointsAdjustmentModal.tsx  # Points adjustment modal
│   └── ReceiptViewer.tsx       # Receipt image modal
├── types.ts                    # TypeScript interfaces
├── data.ts                     # Sample data + helpers
├── utils.ts                    # Formatting + validation
└── README.md                   # Component documentation
```

### Tab System (Extensible)

**Current Tabs (V1)**:

```tsx
type TabType = "profile" | "points" | "history";
```

**Future Tabs (V2+)**:

```tsx
type TabType =
  | "profile" // ✅ V1 (read-only)
  | "points" // ✅ V1 (full featured)
  | "history" // ✅ V1 (full featured)
  | "communications" // 📅 V2 - Email/SMS history
  | "rewards" // 📅 V2 - Available rewards catalog
  | "preferences" // 📅 V3 - Notification settings
  | "notes" // 📅 V3 - Admin notes/tags
  | "segments"; // 📅 V3 - Member segmentation
```

**Adding a New Tab** (3 Simple Steps):

1. **Add tab to type**:

   ```tsx
   type TabType = "profile" | "points" | "history" | "communications";
   ```

2. **Add navigation button**:

   ```tsx
   <button onClick={() => setCurrentTab('communications')} ...>
     <EnvelopeIcon className="h-5 w-5" />
     <span>Comms</span>
   </button>
   ```

3. **Add tab content**:
   ```tsx
   {
     currentTab === "communications" && <CommunicationsTab member={member} />;
   }
   ```

That's it! No refactoring required.

---

## Data Model

### Core Types

```typescript
// Base member information
interface Member {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  accountId: string;
  memberSince: string;
  phoneNumber?: string;
  status: "active" | "inactive" | "suspended";
  programs: Program[];
}

// Extended with points data
interface MemberWithPoints extends Member {
  pointsBalances: PointsBalance[];
  transactions: PointsTransaction[];
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  totalAdjustments: number;
}

// Per-program points balance
interface PointsBalance {
  programId: string;
  programName: string;
  currentPoints: number;
  currentUsdCents: number;
  conversionRate: number;
  displayNamePrefix: string;
  displayName: string;
}

// Transaction record (flexible for all types)
interface PointsTransaction {
  id: string;
  accountId: string;
  programId: string;
  transactionType: "earn" | "redeem" | "adjust";
  sourceType: "receipt" | "redemption" | "manual" | "promotion" | "bonus";
  pointsAmount: number;
  usdAmountCents: number;
  balanceAfterPoints: number;
  balanceAfterUsdCents: number;
  transactionDate: string;
  description: string;

  // Receipt-specific fields
  receiptId?: string;
  merchantName?: string;
  receiptTotal?: number;

  // Promotion-specific fields
  promotionId?: string;
  promotionName?: string;

  // Adjustment-specific fields
  adjustedByAdministratorId?: string;
  adjustedByName?: string;
  adjustmentReason?: AdjustmentReason;
  adjustmentNotes?: string;

  // Optional metadata
  metadata?: Record<string, any>;
}

// Adjustment reasons enum
type AdjustmentReason =
  | "duplicate_receipt"
  | "receipt_error"
  | "customer_service"
  | "fraud_correction"
  | "goodwill_gesture"
  | "promotion_error"
  | "technical_error"
  | "retroactive_points"
  | "other";
```

### Data Flexibility

The `PointsTransaction` type is **intentionally flexible**:

- Optional fields for different transaction types
- `metadata` field for future extensibility
- `sourceType` enum can grow (e.g., 'referral', 'survey', 'birthday')

---

## Design System Compliance

### Colors

**Primary Palette**:

- Primary Blue: `#4B55FD` (`bg-blue-500`, `text-blue-500`)
- Secondary Sky: `#CCFFFE` (`bg-sky-100`)
- Success Green: `#10b981` (`bg-green-500`)
- Error Red: `#ef4444` (`bg-red-500`)
- Warning Orange: `#f59e0b` (`bg-orange-500`)

**Status Colors**:

```tsx
Active    → bg-green-100, text-green-800
Inactive  → bg-gray-100, text-gray-800
Suspended → bg-red-100, text-red-800
```

**Transaction Type Colors**:

```tsx
Earn   → bg-green-100, text-green-700 (icon: 🎉)
Redeem → bg-purple-100, text-purple-700 (icon: 🎁)
Adjust → bg-yellow-100, text-yellow-700 (icon: ⚠️)
```

### Typography

- **Font**: Inter (via Tailwind `font-sans`)
- **Headers**: `text-lg font-semibold` (18px, 600)
- **Subheaders**: `text-sm font-semibold` (14px, 600)
- **Body**: `text-sm` (14px, 400)
- **Captions**: `text-xs` (12px, 400)
- **Large Numbers**: `text-4xl font-bold` (36px, 700)

### Spacing & Layout

- **Card Padding**: `p-4` (16px) or `p-6` (24px)
- **Section Spacing**: `space-y-4` (16px vertical)
- **Grid Gaps**: `gap-3` (12px)
- **Border Radius**: `rounded-lg` (8px)
- **Header Height**: Fixed `h-[61px]` for consistency
- **Panel Gap**: `gap-3` (12px) between left/right panels

### Component Patterns

**All components use**:

- Tailwind CSS (no custom CSS)
- Radix UI primitives (via shadcn/ui)
- TanStack React Table for tables
- Recharts for analytics
- Heroicons for icons

---

## State Management

### Local State (Component-Level)

- **Tab Selection**: `useState<TabType>('profile')`
- **Modal Visibility**: `useState<boolean>(false)`
- **Filter State**: Derived from URL search params

### URL State (Persistent)

- **Search Query**: `?searchQuery=john`
- **Status Filter**: `?statusFilter=active`
- **Member ID**: Route param `/members/[id]` (future)

### Global State (Redux) - Future

- User session info
- Sidebar width
- Theme preferences

---

## Performance Considerations

### Optimizations Implemented

1. **Memoization**:

   ```tsx
   const columns = useMemo(() => createMemberColumns(...), [deps]);
   const filteredMembers = useMemo(() => ..., [members, filters]);
   ```

2. **Pagination**:
   - DataTable handles large datasets
   - Only renders visible rows
   - Virtual scrolling for very large lists (future)

3. **Debounced Search**:
   - SearchBar component debounces input (300ms)
   - Prevents excessive re-renders

4. **Code Splitting**:
   - Modals lazy-loaded when opened
   - Heavy components (Recharts) split

### Future Optimizations (V2+)

- Server-side pagination
- Infinite scroll for transaction history
- Virtual scrolling for large member lists
- API caching with React Query
- Optimistic updates for adjustments

---

## Accessibility

### WCAG 2.1 AA Compliance

✅ **Color Contrast**: All text meets 4.5:1 ratio
✅ **Keyboard Navigation**: All interactive elements focusable
✅ **Screen Reader Support**: Proper ARIA labels
✅ **Focus Indicators**: Visible focus rings
✅ **Error Messages**: Clear, associated with inputs

### Semantic HTML

- `<button>` for actions (not `<div onClick>`)
- `<table>` with proper `<thead>`, `<tbody>` structure
- `<h1>`-`<h6>` hierarchy maintained
- `<label>` associated with form inputs

---

## Testing Strategy (Future)

### Unit Tests

- Utility functions (formatting, validation)
- Component logic (filtering, sorting)
- Type guards and parsers

### Integration Tests

- Tab switching behavior
- Points adjustment flow
- Table filtering and sorting
- Modal open/close

### E2E Tests

- Complete user journeys:
  1. Search member → View details → Adjust points
  2. Filter members → Click member → View history
  3. Adjust points → Verify transaction history

---

## Future Enhancements (Post-V1)

### V2: Enhanced Profile & Communications

- **Profile Editing**: Update contact info, status
- **Communications Tab**: Email/SMS history, templates
- **Activity Log**: Audit trail of all member changes
- **Tags & Segments**: Categorize members

### V3: Advanced Features

- **Bulk Actions**: Multi-select members for mass updates
- **Export**: CSV/Excel export of member data
- **Advanced Filters**: Date ranges, points thresholds
- **Custom Fields**: Extend member data model
- **Notes System**: Admin notes per member

### V4: Automation & Integrations

- **Triggered Actions**: Auto-adjust points based on rules
- **Email Campaigns**: Integrated with marketing tools
- **API Access**: External systems can query/update
- **Webhooks**: Real-time notifications
- **ML Insights**: Churn prediction, segment recommendations

---

## Backend Integration Points

### Required API Endpoints (Future)

```
GET    /api/members                    # List members (paginated)
GET    /api/members/:id                # Get member details
PATCH  /api/members/:id                # Update member
GET    /api/members/:id/transactions   # Get transactions
POST   /api/members/:id/adjustments    # Create adjustment
GET    /api/members/:id/receipts       # Get receipts
```

### Data Flow

```
Frontend (React)
    ↓
API Routes (Next.js)
    ↓
Backend API (KigoNexus/Rust)
    ↓
Database (PostgreSQL)
```

---

## Success Metrics

### V1 Goals

- ✅ Reduce manual points adjustment time by 50%
- ✅ Improve audit trail accuracy to 100%
- ✅ Support 100+ members with fast search (<500ms)
- ✅ Zero data loss on manual adjustments

### V2+ Goals (Future)

- Reduce support tickets by 30% (self-service features)
- Increase member engagement (communications tab)
- Scale to 10,000+ members
- Sub-second search response time

---

## Development Guidelines

### Adding a New Feature

1. **Update Types**: Add fields to `types.ts`
2. **Add Sample Data**: Update `data.ts` for testing
3. **Create Component**: Follow atomic design pattern
4. **Add to Tab/View**: Integrate into existing layout
5. **Update Docs**: Document in README and this file
6. **Test**: Unit + integration tests
7. **Review**: PR review with design team

### Code Review Checklist

- [ ] Follows Tailwind design system
- [ ] Uses existing reusable components
- [ ] TypeScript types are correct
- [ ] Accessible (ARIA labels, keyboard nav)
- [ ] Responsive design (mobile + desktop)
- [ ] No console errors or warnings
- [ ] Loading states handled
- [ ] Error states handled
- [ ] Empty states with helpful messages

---

## Questions & Answers

### Why two-panel layout?

**A**: Provides context (analytics) while viewing details. Analytics stay visible during tab changes, reducing cognitive load.

### Why separate tabs instead of accordion?

**A**: Tabs reduce scrolling, improve scanability, and are easier to extend. Each tab can be developed independently.

### Why 60/40 split instead of 50/50?

**A**: Left panel (content) needs more space for forms and tables. Right panel (analytics) is secondary context.

### How to add a new transaction type?

**A**:

1. Add to `transactionType` union in `types.ts`
2. Add icon to `getTransactionIcon()` in `utils.ts`
3. Add color to `getTransactionColorClass()` in `utils.ts`
4. Handle in `PointsHistory.tsx` transaction details

### Can we use this for other entities (partners, admins)?

**A**: Yes! The two-panel + tab pattern is reusable. Copy the structure and adapt the data types.

---

## References

- **Design System**: `/documentation/design-system.md`
- **Atomic Design**: `/adr/001-atomic-design-structure.md`
- **DataTable Docs**: `/components/organisms/DataTable/README.md`
- **Points Engine PRD**: `/docs/prd/points-engine.md`
- **Manual Adjustment PRD**: `/docs/prd/manual-points-adjustment.md`

---

## Changelog

### v1.0.0 (Jan 19, 2025)

- ✅ Initial architecture document
- ✅ V1 scope defined (Points Management)
- ✅ Modular tab system designed
- ✅ Data model finalized
- ✅ Component structure documented

---

**Document Owner**: Design Team
**Last Updated**: January 19, 2025
**Next Review**: After V1 launch
