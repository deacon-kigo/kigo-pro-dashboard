# Design Ticket: Points Adjustment Screens in Kigo PRO

**Product:** Kigo PRO
**Date:** January 2025
**Designer:** [To be assigned]
**Status:** Ready for Design
**Priority:** P0 - Critical Path (Feb 3, 2026 Launch)

---

## User Story

**As a** Kigo Pro admin
**I want to** manually adjust a customer's points balance
**So that** I can correct issues tied to receipts, promotions, or support cases without engineering involvement

---

## Context & Problem Statement

Today, there is no clean way for an admin to correct a customer's points balance when something goes wrong (e.g., receipt processing errors, duplicate submissions, system glitches). Support teams need a simple, reliable tool inside Kigo Pro to make adjustments while preserving trust in the system and data integrity.

This design addresses scenarios where **KigoVerify fails to fully provide a customer with their points** or when manual intervention is required for exceptional cases.

### Design Scope

**In Scope:**

- Customer lookup and context display
- Points adjustment modal workflow
- Add/subtract points with validation
- Required metadata capture (reason, notes, program)
- Success/error state handling
- Real-time balance preview
- Audit trail foundation (captured data for future history view)

**Out of Scope (Future Enhancements):**

- Approval workflows and multi-step authorization
- Adjustment request queues
- Bulk adjustment operations
- Advanced receipt editing/re-processing tools
- Adjustment history timeline view (data captured but UI deferred)
- Analytics dashboard for adjustment patterns

---

## Design Deliverables

### Required Screens & Components

1. **Customer Entry/Context Screen** - Member CRM catalog and detail views
2. **Points Adjustment Modal** - Primary adjustment workflow
3. **Confirmation State** - Success feedback
4. **Error & Validation States** - Guard rails and messaging

---

## Screen 1: Customer Entry / Context Screen

### 1.1 Member Catalog View (Table)

**Purpose:** Allow admins to find and select members for points management

**Layout Pattern:** Follows Campaign Management table pattern with PageHeader + SearchBar + DataTable

**Required Elements:**

#### Header Section

- **Emoji Icon:** 👥 (Member CRM indicator)
- **Title:** "Member CRM"
- **Description:** "Manage member accounts, view points balances, and adjust points"
- **Variant:** Aurora background effect
- **Search Bar:**
  - Placeholder: "Search members by name, email, or account ID..."
  - Debounce: 300ms
  - Min Length: 2 characters
  - URL-based state persistence

#### Table Columns

| Column         | Data                                       | Sortable | Width |
| -------------- | ------------------------------------------ | -------- | ----- |
| Member Name    | Full name + email subtitle                 | Yes      | 25%   |
| Account ID     | Monospace font, copy-able                  | No       | 15%   |
| Points Balance | Primary balance + USD value + program name | No       | 25%   |
| Status         | Badge (active/suspended/pending/inactive)  | No       | 10%   |
| Member Since   | Date formatted                             | Yes      | 15%   |
| Actions        | "View" button                              | No       | 10%   |

**Interaction:**

- Click any row → Navigate to Member Detail View
- Click "View" button → Navigate to Member Detail View

**Empty State:**

- Icon: Magnifying glass
- Message: "No members found"
- Subtext: "Try adjusting your search filters or criteria"

---

### 1.2 Member Detail View (Two-Panel Layout)

**Purpose:** Display comprehensive member information and provide entry point for points adjustment

**Layout Pattern:** Follows Create Ads pattern with side navigation + two-panel split (3/5 left, 2/5 right)

#### Side Navigation (64px width)

- **Back Button:** Arrow left icon + "Back" label → Returns to catalog
- **Tab Buttons:** (Active state: blue-50 background, blue-600 left border)
  - Profile: UserIcon + "Profile"
  - Points: CurrencyDollarIcon + "Points"
  - History: ClockIcon + "History"

#### Left Panel (60% width)

**Header (61px fixed height):**

- Icon: Changes based on active tab
- Title: "Member Profile" | "Points Management" | "Transaction History"
- Subtitle: Member name + email | Context message
- Action Button: "Adjust Points" (only visible on Points tab)

**Content Area (scrollable):**

**Profile Tab:**

```
┌─────────────────────────────────────┐
│ Account Information Card            │
│ ├─ Full Name: John Doe             │
│ ├─ Account ID: acc-789xyz          │
│ ├─ Email: john.doe@email.com       │
│ ├─ Phone: (555) 123-4567           │
│ ├─ Member Since: Jan 15, 2025      │
│ └─ Status: Active (badge)          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Enrolled Programs Card              │
│ ├─ Optum HealthyBenefits+ (Active) │
│ └─ Wellness Plus (Inactive)        │
└─────────────────────────────────────┘
```

**Points Tab:**

```
┌──────────────────────────────────────┐
│ Current Balance Card (Gradient)      │
│ ├─ 1,250 points (Large, Bold)       │
│ ├─ $12.50 USD value • Optum Rewards │
│ └─ (Blue gradient background)        │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ Lifetime Summary (3-column grid)     │
│ ├─ Total Earned: 1,850 pts (green)  │
│ ├─ Total Redeemed: 500 pts (red)    │
│ └─ Adjustments: -100 pts (yellow)   │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ ⚠️ Adjustment Guidelines Card        │
│ • Always provide clear reason        │
│ • Document issue in detail           │
│ • Verify member identity first       │
│ • Escalate >1,000 point adjustments  │
└──────────────────────────────────────┘
```

**History Tab:**

- Full transaction history table
- Filter tabs: All | Earn | Redeem | Adjust
- Auto-refresh toggle
- Receipt viewer links for applicable transactions

#### Right Panel (40% width) - Analytics Dashboard

**Header (61px fixed height):**

- Icon: ChartBarIcon
- Title: "Member Analytics"
- Subtitle: "Points trends and activity"

**Content Area (scrollable):**

```
┌─────────────────────────────────────┐
│ Summary Stats (2-column grid)       │
│ ├─ Total Earned Card (green)        │
│ └─ Total Redeemed Card (red)        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Points Distribution (Pie Chart)      │
│ • Earned: 1,850 pts (green)         │
│ • Redeemed: 500 pts (red)           │
│ • Current: 1,250 pts (blue)         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Balance History (Line Chart)         │
│ • X-axis: Transaction dates          │
│ • Y-axis: Points balance             │
│ • Blue line with dot indicators      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Activity by Source (Bar Chart)       │
│ • Purple bars: Transaction count     │
│ • Cyan bars: Points amount           │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Active Program Card (blue)           │
│ • Program name                       │
│ • Current balance                    │
│ • USD value                          │
│ • Conversion rate                    │
└─────────────────────────────────────┘
```

**Design Specifications:**

**Typography:**

- Section headings: 14px semibold
- Card titles: 16px medium
- Data values (large): 36px bold
- Data values (standard): 16px medium
- Descriptions: 12px regular
- Status text: 12px medium

**Colors:**

- Gradient card background: `from-blue-500 to-blue-600`
- Green cards: `bg-green-50 border-green-200`
- Red cards: `bg-red-50 border-red-200`
- Yellow cards: `bg-yellow-50 border-yellow-200`
- Blue info cards: `bg-blue-50 border-blue-200`
- Chart colors:
  - Earned: `#10b981` (green-500)
  - Redeemed: `#ef4444` (red-500)
  - Current: `#3b82f6` (blue-500)
  - Transactions: `#8b5cf6` (purple-500)
  - Points: `#06b6d4` (cyan-500)

**Spacing:**

- Panel gap: 12px (`gap-3`)
- Card padding: 16px (`p-4`)
- Section spacing: 24px (`space-y-6`)
- Grid gap: 12px (`gap-3`)

**Borders:**

- Card borders: 1px solid `border-gray-200`
- Header borders: 1px solid `border-b`
- Shadow: `shadow-md` on cards

---

## Screen 2: Points Adjustment Modal

### 2.1 Modal Structure

**Trigger:** Click "Adjust Points" button in Points tab of Member Detail View

**Modal Dimensions:**

- Width: `max-w-2xl` (672px)
- Height: Auto-fit content, max-height with scroll
- Position: Centered overlay
- Backdrop: Semi-transparent black (`bg-black/50`)
- Animation: Fade in + scale up

**Modal States:**

1. Form Entry State (Step 1)
2. Confirmation State (Step 2)
3. Success State (Step 3)

---

### 2.2 Step 1: Form Entry State

**Header:**

```
┌────────────────────────────────────────────┐
│ [X Close]              Adjust Points       │
│ Member: John Doe • Current: 1,250 points   │
└────────────────────────────────────────────┘
```

**Content Area:**

#### Section 1: Adjustment Direction

**Label:** "Adjustment Type" (required indicator: red asterisk)

**Component:** Toggle Button Group

```
┌─────────────┬─────────────┐
│  ✅ Add     │  Subtract   │
└─────────────┴─────────────┘
```

**Specifications:**

- Active state: Blue background (`bg-blue-500`), white text
- Inactive state: White background, gray text, border
- Icons: PlusIcon for Add, MinusIcon for Subtract
- Width: 50% each
- Height: 44px
- Border radius: 6px
- Transition: 150ms ease

---

#### Section 2: Points Amount (REFINED DESIGN)

**Label:** "Points Amount" (required indicator: red asterisk)

**Component Option A: Slider + Input Combo (RECOMMENDED)**

```
┌─────────────────────────────────────────────┐
│ Points Amount *                              │
│                                              │
│ [────────●─────────] 100 points             │
│ 0                              1,000         │
│                                              │
│ or enter exact amount:                       │
│ ┌──────────────────────┐                    │
│ │  100                 │ points             │
│ └──────────────────────┘                    │
│                                              │
│ New Balance: 1,350 points ($13.50)         │
└─────────────────────────────────────────────┘
```

**Slider Specifications (shadcn Slider):**

- Library: `@radix-ui/react-slider` via shadcn/ui
- Range:
  - Add mode: 0 to 1,000 (configurable max)
  - Subtract mode: 0 to current balance
- Step: 1 point
- Default: 100
- Thumb size: 20px diameter
- Track height: 4px
- Track color: `bg-gray-200`
- Active track color: `bg-blue-500`
- Thumb color: `bg-white` with `border-2 border-blue-500`
- Thumb shadow: `shadow-md`
- Thumb hover: Scale to 110%
- Label positioning: Above slider (current value), below slider (min/max)

**Input Field Specifications:**

- Width: 200px
- Height: 44px
- Font: Monospace for numeric input
- Alignment: Right-aligned
- Suffix: " points" (non-editable, gray)
- Border: 1px solid gray-300
- Focus: Blue border, shadow
- Validation: Real-time as user types

**Two-way Sync:**

- Moving slider updates input field
- Typing in input field updates slider position
- Input field supports keyboard entry for precision
- Slider provides quick rough adjustments

**New Balance Preview:**

- Live calculation: current ± adjustment
- Format: "1,350 points ($13.50)"
- Color:
  - Green if adding points
  - Red if subtracting points
  - Bold font weight
- Position: Below input field

**Validation (Real-time):**

- Amount must be > 0
- Cannot subtract more than current balance
- Shows error message immediately below field
- Error state: Red border, red text

**Error Messages:**

```
❌ Amount must be greater than 0
❌ Cannot subtract more than current balance (1,250 points)
❌ Please enter a valid number
```

---

**Component Option B: Input Only (Alternative)**

If slider adds complexity, fallback to clean numeric input:

```
┌─────────────────────────────────────────────┐
│ Points Amount *                              │
│ ┌──────────────────────┐                    │
│ │  100                 │ points             │
│ └──────────────────────┘                    │
│                                              │
│ New Balance: 1,350 points ($13.50)         │
└─────────────────────────────────────────────┘
```

---

#### Section 3: Program/Promotion Selector

**Label:** "Apply to Program or Promotion" (required indicator: red asterisk)

**Component:** Select Dropdown (Combobox pattern)

```
┌──────────────────────────────────────┐
│ Select program or promotion... ▼     │
└──────────────────────────────────────┘

Dropdown Options:
┌──────────────────────────────────────┐
│ PROGRAMS                             │
│ ○ Optum HealthyBenefits+            │
│ ○ Wellness Plus                      │
│                                      │
│ ACTIVE PROMOTIONS                    │
│ ○ Buy 3 Colgate, Get $5             │
│ ○ Wellness Products 10% Back        │
│                                      │
│ OTHER                                │
│ ○ No Promotion (General Adjustment) │
└──────────────────────────────────────┘
```

**Specifications:**

- Height: 44px
- Max height (dropdown): 300px with scroll
- Grouped options with section headers
- Search/filter enabled (type to search)
- Keyboard navigation: Arrow keys + Enter
- Selected state: Checkmark icon, blue background
- Empty state: "No programs available"

---

#### Section 4: Adjustment Reason

**Label:** "Reason for Adjustment" (required indicator: red asterisk)

**Component:** Select Dropdown

```
┌──────────────────────────────────────┐
│ Select reason... ▼                   │
└──────────────────────────────────────┘

Options:
┌──────────────────────────────────────┐
│ Receipt Processing Error             │
│ Duplicate Receipt Submission         │
│ System Error or Bug                  │
│ Customer Service Goodwill            │
│ Promotion Terms Clarification        │
│ Fraudulent Activity Reversal         │
│ Other (Specify in Notes)             │
└──────────────────────────────────────┘
```

**Specifications:**

- Height: 44px
- Options map to backend enum values
- Each option has tooltip explaining use case (on hover)
- "Other" requires detailed notes explanation

---

#### Section 5: Adjustment Notes

**Label:** "Notes" (required indicator: red asterisk)

**Component:** Textarea

```
┌──────────────────────────────────────┐
│                                      │
│ Provide detailed explanation for    │
│ this adjustment. Include ticket #,  │
│ customer complaint details, or      │
│ steps taken to verify the issue.    │
│                                      │
│                                      │
│                                      │
└──────────────────────────────────────┘
Character count: 45 / 500 (minimum: 10)
```

**Specifications:**

- Height: 120px (auto-expand up to 200px)
- Min length: 10 characters
- Max length: 500 characters
- Character counter: Bottom right, updates live
- Placeholder: "Describe the issue and resolution in detail..."
- Font: 14px regular
- Line height: 1.5
- Validation: Shows error if < 10 characters on blur

---

#### Section 6: Receipt Preview (Optional)

**Condition:** Only show if transaction has associated receipt

```
┌──────────────────────────────────────┐
│ 📎 Related Receipt                   │
│ ┌────────────────────────────────┐  │
│ │ [Receipt Thumbnail Image]       │  │
│ │ Target • $15.00                 │  │
│ │ Jan 20, 2026                    │  │
│ │                                 │  │
│ │ [View Full Receipt →]          │  │
│ └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

**Specifications:**

- Thumbnail size: 120px × 160px
- Image: S3 URL with fallback icon
- Link opens full receipt viewer modal
- Optional: Show verification status badge

---

#### Footer Actions

```
┌──────────────────────────────────────────┐
│  [Cancel]              [Review & Submit] │
└──────────────────────────────────────────┘
```

**Cancel Button:**

- Variant: Ghost (text only)
- Color: Gray
- Action: Close modal, discard changes
- Confirmation: "Are you sure? Changes will be lost"

**Review & Submit Button:**

- Variant: Primary
- Color: Blue gradient
- Disabled state: Gray, no hover, tooltip shows missing fields
- Enabled: When all required fields valid
- Action: Navigate to Confirmation State

---

### 2.3 Step 2: Confirmation State

**Purpose:** Give admin one last chance to review before committing the adjustment

**Header:**

```
┌────────────────────────────────────────────┐
│ [← Back]           Review Adjustment       │
│ Confirm details before applying            │
└────────────────────────────────────────────┘
```

**Content:**

```
┌──────────────────────────────────────────────┐
│ You are about to adjust:                     │
│                                              │
│ Member: John Doe (acc-789xyz)               │
│ Email: john.doe@email.com                    │
│                                              │
│ ┌────────────────────────────────────────┐  │
│ │ Adjustment Summary                      │  │
│ ├────────────────────────────────────────┤  │
│ │ Direction:      Add Points              │  │
│ │ Amount:         +100 points             │  │
│ │ Program:        Optum HealthyBenefits+  │  │
│ │ Current Balance: 1,250 points           │  │
│ │ New Balance:    1,350 points ($13.50)  │  │
│ │                                          │  │
│ │ Reason: Receipt Processing Error        │  │
│ │                                          │  │
│ │ Notes: OCR failed to detect purchase    │  │
│ │ total correctly. Manual verification    │  │
│ │ confirmed receipt validity. Customer    │  │
│ │ provided clear photo.                   │  │
│ └────────────────────────────────────────┘  │
│                                              │
│ ⚠️ Warning:                                  │
│ This action cannot be undone. The ledger    │
│ entry will be permanent and visible in      │
│ audit logs.                                  │
└──────────────────────────────────────────────┘
```

**Specifications:**

- Summary card: Blue border (`border-blue-300`), light blue background
- Values bold: Amount, balances
- New balance: Green text if adding, red if subtracting
- Warning box: Orange background (`bg-orange-50`), orange border
- Warning icon: ExclamationTriangleIcon
- Vertical spacing: 16px between sections

**Footer Actions:**

```
┌──────────────────────────────────────────┐
│  [← Back to Edit]      [Confirm & Apply] │
└──────────────────────────────────────────┘
```

**Back to Edit:**

- Returns to Step 1 with all fields preserved
- No data loss

**Confirm & Apply:**

- Variant: Primary
- Shows loading spinner when clicked
- Disabled during submission
- Makes POST request to adjustment API
- On success → Navigate to Success State
- On error → Show error modal

---

### 2.4 Step 3: Success State

**Purpose:** Confirm adjustment was applied successfully

**Layout:** Replace modal content with success message

```
┌──────────────────────────────────────────────┐
│              ✅ Success!                      │
│                                              │
│ Points adjustment has been applied           │
│                                              │
│ ┌────────────────────────────────────────┐  │
│ │ Adjustment ID: txn-8a7f9b2c             │  │
│ │ Timestamp: Jan 20, 2026 3:45 PM EST    │  │
│ ├────────────────────────────────────────┤  │
│ │ Member: John Doe                        │  │
│ │ Amount Adjusted: +100 points            │  │
│ │ New Balance: 1,350 points ($13.50)     │  │
│ │ Program: Optum HealthyBenefits+         │  │
│ └────────────────────────────────────────┘  │
│                                              │
│ The adjustment has been recorded in the      │
│ member's transaction history and is visible  │
│ immediately.                                 │
│                                              │
│              [Close]  [View History]         │
└──────────────────────────────────────────────┘
```

**Specifications:**

- Checkmark icon: Large (64px), green color
- Success message: 20px bold, centered
- Summary card: Green border (`border-green-300`), green background
- Transaction ID: Monospace font, copy button on hover
- Auto-close: Optional, after 5 seconds (with countdown)

**Actions:**

- **Close:** Returns to Member Detail View (Points tab)
- **View History:** Navigates to History tab showing new transaction

---

## Screen 3: Error & Validation States

### 3.1 Form Validation Errors

**Field-Level Errors (Inline):**

```
Points Amount *
┌──────────────────────┐
│ -50                  │ points
└──────────────────────┘
❌ Amount must be greater than 0
```

**Error Styling:**

- Border: Red (`border-red-500`)
- Text color: Red (`text-red-600`)
- Icon: CircleX icon
- Font size: 12px
- Margin top: 4px

**Common Validation Messages:**

- "Amount must be greater than 0"
- "Cannot subtract more than current balance (1,250 points)"
- "Please select a program or promotion"
- "Please select a reason for this adjustment"
- "Notes must be at least 10 characters"
- "Please enter a valid number"

---

### 3.2 Submit Error Modal

**Trigger:** API call fails during submission

```
┌──────────────────────────────────────────────┐
│              ⚠️ Error                         │
│                                              │
│ Unable to apply points adjustment            │
│                                              │
│ The server returned an error:                │
│ "Insufficient balance for subtraction"       │
│                                              │
│ Please check your inputs and try again.      │
│                                              │
│              [Try Again]  [Cancel]           │
└──────────────────────────────────────────────┘
```

**Specifications:**

- Warning icon: Orange/red color, 48px
- Error message: Display backend error verbatim (within security bounds)
- Error card: Red border and background
- Auto-focus "Try Again" button
- Preserve form data when returning to edit

**Common Error Scenarios:**

- Network timeout
- Insufficient balance
- Member account locked
- Program not active
- Duplicate submission (prevent with debounce)

---

### 3.3 Empty States

**No Programs Available:**

```
┌──────────────────────────────────────┐
│          ℹ️                          │
│                                      │
│ No Programs Available                │
│                                      │
│ This member is not enrolled in any   │
│ active programs. Please ensure the   │
│ member has at least one program      │
│ enrollment before adjusting points.  │
│                                      │
│          [Go Back]                   │
└──────────────────────────────────────┘
```

**Member Data Unavailable:**

```
┌──────────────────────────────────────┐
│          ⚠️                          │
│                                      │
│ Member Data Unavailable              │
│                                      │
│ We couldn't load this member's       │
│ information. This might be a         │
│ temporary issue.                     │
│                                      │
│          [Retry]  [Go Back]         │
└──────────────────────────────────────┘
```

---

## Technical Specifications

### Component Library

**UI Framework:** shadcn/ui + Radix UI primitives

**Required Components:**

- `Dialog` - Modal container
- `Slider` - Points amount selector (NEW)
- `Select` - Dropdowns (program, reason)
- `RadioGroup` - Add/subtract toggle
- `Textarea` - Notes field
- `Input` - Points amount text input
- `Button` - Actions
- `Badge` - Status indicators
- `Card` - Content containers
- `Label` - Form labels
- `Alert` - Warning messages

**Charts:**

- `recharts` - For analytics panel
  - `PieChart` - Points distribution
  - `LineChart` - Balance history
  - `BarChart` - Activity by source

---

### Responsive Behavior

**Desktop (≥1024px):**

- Two-panel layout: 60/40 split
- Full-width modals: 672px (`max-w-2xl`)
- Side navigation: 64px visible

**Tablet (768px - 1023px):**

- Two-panel layout: 50/50 split
- Full-width modals: 600px (`max-w-xl`)
- Side navigation: Collapses to icons only

**Mobile (<768px):**

- Single column stack: Left panel full width
- Right panel hidden, accessible via "View Analytics" button
- Modals: Full-screen overlay
- Side navigation: Bottom tab bar

---

### Accessibility (WCAG 2.1 AA Compliance)

**Keyboard Navigation:**

- Tab order: Logical top-to-bottom, left-to-right
- Enter/Space: Activate buttons and toggles
- Escape: Close modal
- Arrow keys: Navigate slider, select options
- Focus visible: 2px blue outline on all interactive elements

**Screen Reader:**

- All form fields have associated labels
- Required fields announced as "required"
- Error messages linked to fields via `aria-describedby`
- Live regions for balance preview updates (`aria-live="polite"`)
- Modal announces title when opened (`role="dialog"`)

**Visual:**

- Color contrast ratio: ≥4.5:1 for text
- Error messages don't rely on color alone (icon + text)
- Focus indicators visible for keyboard users
- Font size: Minimum 14px (12px for secondary text)

**Motor:**

- Click targets: Minimum 44×44px
- Slider thumb: 20px diameter (easy to grab)
- Adequate spacing between interactive elements (8px minimum)

---

### Animation & Transitions

**Modal Animations:**

- Entry: Fade in (200ms) + Scale up from 95% to 100% (200ms)
- Exit: Fade out (150ms) + Scale down to 95% (150ms)
- Backdrop: Fade in/out (150ms)

**Field Interactions:**

- Input focus: Border color transition (150ms ease)
- Slider movement: Smooth tracking (no transition on drag, 100ms on click)
- Button hover: Background color (150ms ease)
- Error messages: Slide down (200ms ease-out)

**Success State:**

- Checkmark: Scale in with bounce effect (300ms)
- Success card: Fade in (200ms) with slide up (200ms)

**Performance:**

- Use `transform` and `opacity` for animations (GPU-accelerated)
- Avoid animating `width`, `height`, or `margin`
- Respect `prefers-reduced-motion` media query

---

### Data Validation Rules

**Client-Side (Immediate Feedback):**

1. **Points Amount:**
   - Must be integer > 0
   - Cannot exceed 10,000 (configurable max)
   - In subtract mode: Cannot exceed current balance
   - Real-time validation on input change

2. **Program/Promotion:**
   - Must select exactly one option
   - Option must be active and associated with member
   - Validate on blur and submit

3. **Reason:**
   - Must select from enum values
   - Required, cannot be empty
   - Validate on blur and submit

4. **Notes:**
   - Min length: 10 characters
   - Max length: 500 characters
   - Trim whitespace before validation
   - Check on blur and submit

**Server-Side (Final Validation):**

1. Verify member account exists and is active
2. Verify program enrollment
3. Recalculate balance and check for negative
4. Verify admin has permission
5. Check for duplicate submissions (idempotency key)
6. Validate against business rules (max adjustment per day, etc.)

---

### State Management

**Local State (React Component):**

```typescript
interface AdjustmentFormState {
  direction: "add" | "subtract";
  pointsAmount: number;
  programId: string;
  promotionId?: string;
  adjustmentReason: string;
  adjustmentNotes: string;
  isSubmitting: boolean;
  errors: Record<string, string>;
  currentStep: "form" | "confirmation" | "success";
}
```

**Derived Values (Computed):**

```typescript
const newBalance =
  currentBalance + (direction === "add" ? pointsAmount : -pointsAmount);
const newBalanceUsdCents = newBalance * (conversionRate / 100);
const isFormValid = allFieldsValid && !hasErrors;
```

**Persistence:**

- No auto-save (prevent accidental adjustments)
- Warn on close if form has unsaved changes
- Clear form data on successful submission

---

### API Integration Points

**Required Endpoints:**

1. **GET Member Overview:**

   ```
   GET /api/v1/dashboard/members/:account_id/points-overview
   ```

   Returns: Member profile, programs, balances, aggregations

2. **GET Transaction History:**

   ```
   GET /api/v1/dashboard/members/:account_id/points/transactions
   ```

   Returns: Paginated transaction list with enrichment

3. **GET Programs & Promotions:**

   ```
   GET /api/v1/dashboard/members/:account_id/programs-promotions
   ```

   Returns: Available programs and active promotions for selector

4. **POST Points Adjustment:**

   ```
   POST /api/v1/dashboard/members/:account_id/points/adjust

   Body: {
     program_id, direction, points_amount,
     promotion_id, adjustment_reason, adjustment_notes
   }
   ```

   Returns: Ledger entry ID, new balance, timestamp

5. **GET Analytics:**
   ```
   GET /api/v1/dashboard/members/:account_id/points/analytics/*
   ```
   Returns: Chart data for analytics panel

**Error Handling:**

- Network errors: Retry with exponential backoff
- 4xx errors: Display validation message to user
- 5xx errors: Generic error message + Sentry logging
- Timeout: 30 seconds, then show timeout message

---

## Design System Patterns

### Colors (Kigo PRO Palette)

**Brand:**

- Primary: `#3b82f6` (blue-500)
- Primary Hover: `#2563eb` (blue-600)
- Success: `#10b981` (green-500)
- Error: `#ef4444` (red-500)
- Warning: `#f59e0b` (amber-500)
- Info: `#06b6d4` (cyan-500)

**Neutrals:**

- Gray-50: `#f9fafb`
- Gray-100: `#f3f4f6`
- Gray-200: `#e5e7eb`
- Gray-300: `#d1d5db`
- Gray-600: `#4b5563`
- Gray-900: `#111827`

**Semantic:**

- Earned (green): `#10b981`
- Redeemed (red): `#ef4444`
- Adjusted (yellow): `#f59e0b`
- Balance (blue): `#3b82f6`

### Typography (Kigo PRO Scale)

**Headings:**

- H1 (Page): 32px bold (2xl)
- H2 (Section): 24px bold (xl)
- H3 (Card): 18px semibold (lg)
- H4 (Subsection): 16px semibold (base)

**Body:**

- Large: 16px regular (base)
- Standard: 14px regular (sm)
- Small: 12px regular (xs)
- Caption: 11px regular (2xs)

**Data:**

- Large Value: 36px bold (4xl)
- Standard Value: 20px semibold (xl)
- Monospace: Font-family: `'Roboto Mono', monospace`

**Line Heights:**

- Tight: 1.25 (headings)
- Normal: 1.5 (body)
- Relaxed: 1.75 (long-form)

### Spacing Scale

**Padding/Margin:**

- xs: 4px (0.5)
- sm: 8px (1)
- md: 12px (1.5)
- base: 16px (2)
- lg: 24px (3)
- xl: 32px (4)
- 2xl: 48px (6)

**Component Heights:**

- Input: 44px (11)
- Button: 44px (11) or 36px (9) for small
- Card header: 61px fixed
- Modal max-height: 90vh

---

## Future Enhancements (Post-MVP)

**Phase 2 Features (Not in Current Design):**

- **Approval Workflows:**
  - Multi-level approvals for large adjustments
  - Request queue dashboard
  - Email notifications for approvers
  - Audit trail with approval timestamps

- **Adjustment History Timeline:**
  - Dedicated page/tab for viewing past adjustments
  - Filter by date range, admin, reason
  - Export to CSV for auditing
  - Visual timeline with icons

- **Bulk Adjustments:**
  - Upload CSV of multiple adjustments
  - Preview table before applying
  - Batch validation and error handling
  - Progress indicator for large batches

- **Advanced Receipt Tools:**
  - Re-process receipt with OCR
  - Edit receipt metadata inline
  - Override merchant detection
  - Manual line-item entry

- **Analytics Dashboard:**
  - Adjustment patterns by reason
  - Admin activity leaderboard
  - Fraud detection alerts
  - Program-level adjustment metrics

**Design Considerations for Future:**

- Current modal pattern can extend to multi-step approval flow
- History tab already captures adjustment data (just needs UI)
- Analytics panel structure supports additional chart types
- Keep adjustment reasons extensible (easy to add new options)

---

## Success Metrics

**Usability:**

- Time to complete adjustment: <2 minutes
- Error rate: <5% of submissions
- User satisfaction: >4/5 in feedback surveys
- Support escalations reduced by 40%

**Business:**

- Reduction in engineering intervention requests
- Faster customer issue resolution time
- Increased admin confidence in points system
- Reduced customer complaints about incorrect balances

**Technical:**

- API response time: <500ms (p95)
- Modal load time: <200ms
- Zero balance calculation errors
- 100% audit trail coverage

---

## Design Review Checklist

- [ ] All required screens designed in Figma
- [ ] Component specifications documented
- [ ] Responsive behavior defined for all breakpoints
- [ ] Accessibility annotations included (WCAG 2.1 AA)
- [ ] Validation rules clearly specified
- [ ] Error states covered for all scenarios
- [ ] Animation/transition specs documented
- [ ] Color contrast ratios verified (≥4.5:1)
- [ ] Interactive prototype built for user testing
- [ ] Design tokens aligned with Kigo PRO system
- [ ] Developer handoff package prepared
- [ ] Stakeholder sign-off obtained

---

## Appendix: Design Decisions

### Why Two-Panel Layout?

**Rationale:** Matches existing Kigo PRO patterns (Create Ads, Create Ad Group). Provides context (analytics) while performing actions (adjustment). Reduces cognitive load by keeping member data visible.

### Why Slider + Input for Points Amount?

**Rationale:**

- Slider provides quick rough adjustments (common use case: round numbers)
- Input provides precision for exact amounts (edge cases)
- Two-way sync offers flexibility for different user preferences
- Visual feedback on slider improves confidence
- Aligns with modern fintech app patterns (PayPal, Venmo)

**Alternative Considered:** Input-only field
**Rejected Because:** Less intuitive for common round-number adjustments (50, 100, 500)

### Why Required Program/Promotion Selector?

**Rationale:** Backend ledger requires program context for proper accounting. Forcing selection prevents orphaned transactions and improves data quality for analytics. Matches Optum's requirement for promotion attribution.

### Why Two-Step Confirmation?

**Rationale:** Points adjustments are irreversible (immutable ledger). High-stakes action requires deliberate confirmation to prevent accidental changes. Shows summary to catch input errors before committing.

**Alternative Considered:** Single-step with "Are you sure?" dialog
**Rejected Because:** Less professional, doesn't show full context for review

### Why Inline Validation?

**Rationale:** Immediate feedback reduces frustration and error rate. Users can fix mistakes while context is fresh. Reduces wasted time on failed submissions.

---

## Questions for Stakeholders

1. **Approval Workflow:** Do any adjustments require manager approval before applying? (Current design assumes instant application)

2. **Adjustment Limits:** What's the maximum points adjustment allowed in a single transaction? (Current design: 10,000 configurable)

3. **Audit Retention:** How long must adjustment history be retained? (Affects future history view pagination)

4. **Permissions:** Should different admin roles have different adjustment limits? (e.g., L1 support: ≤500 pts, L2: ≤2000 pts)

5. **Receipt Integration:** Do we need tighter integration with KigoVerify? (e.g., ability to re-process receipt directly from adjustment modal)

6. **Notifications:** Should members receive email/SMS when points are adjusted? (Not in current scope)

7. **Reporting:** Do admins need to export adjustment reports? (Not in current scope)

---

## Files & References

**Frontend Implementation:**

- Types: `/components/features/member-crm/types.ts`
- Mock Data: `/components/features/member-crm/data.ts`
- Main View: `/components/features/member-crm/MemberCRMView.tsx`
- Detail View: `/components/features/member-crm/MemberDetailView.tsx`
- Adjustment Modal: `/components/features/member-crm/PointsAdjustmentModal.tsx`
- Analytics Panel: `/components/features/member-crm/PointsAnalyticsPanel.tsx`

**Backend PRDs:**

- Manual Points Adjustment: `/kigo-nexus/docs/product/prds/2025-12-11-kigo-pro-manual-points-adjustment-prd.md`
- Points Engine: `/kigo-nexus/docs/product/prds/2025-12-10-points-engine-prd.md`

**Design System:**

- shadcn/ui Components: https://ui.shadcn.com/
- Radix UI Slider: https://www.radix-ui.com/primitives/docs/components/slider
- Recharts Library: https://recharts.org/

---

**END OF DESIGN TICKET**
