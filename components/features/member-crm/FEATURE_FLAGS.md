# Member CRM Feature Flags

This document describes the feature flags used in the Member CRM feature and how to enable/disable them.

## Overview

Feature flags allow us to toggle specific tabs and features in the Member Detail View. This is useful for:

- **Phased releases**: Ship core functionality first, enable advanced features later
- **A/B testing**: Test different UX configurations
- **Client-specific configurations**: Different clients may need different features
- **Development**: Keep work-in-progress features hidden

## Configuration

Feature flags are managed via environment variables in `.env.local` or `.env.production`.

### Current Defaults (In Scope for Initial Release)

```bash
# .env.local
NEXT_PUBLIC_FEATURE_MEMBER_PROFILE_TAB=false    # OUT OF SCOPE
NEXT_PUBLIC_FEATURE_MEMBER_HISTORY_TAB=false     # OUT OF SCOPE
NEXT_PUBLIC_FEATURE_MEMBER_POINTS_TAB=true       # IN SCOPE ✅
NEXT_PUBLIC_FEATURE_MEMBER_RECEIPTS_TAB=true     # IN SCOPE ✅
```

## Available Feature Flags

### 1. `NEXT_PUBLIC_FEATURE_MEMBER_PROFILE_TAB`

**Status:** OUT OF SCOPE for initial release (future enhancement)
**Default:** `false`

**What it controls:**

- Profile tab in side navigation
- Member profile content showing:
  - Account information (name, email, phone, member since)
  - Program enrollment details
  - Contact information

**When to enable:**

- When building a full member CRM system
- When CSRs need to view/edit member profile information
- Future enhancement after core flows are complete

---

### 2. `NEXT_PUBLIC_FEATURE_MEMBER_HISTORY_TAB`

**Status:** OUT OF SCOPE for initial release (future enhancement)
**Default:** `false`

**What it controls:**

- History tab in side navigation
- Transaction history content showing:
  - All points transactions (earned, redeemed, adjusted)
  - Associated receipts
  - Transaction timeline

**When to enable:**

- When audit trail functionality is needed
- When CSRs need to review member's points history before making adjustments
- Future enhancement after core flows are complete

---

### 3. `NEXT_PUBLIC_FEATURE_MEMBER_POINTS_TAB`

**Status:** IN SCOPE ✅ (Required for Points Adjustment flow)
**Default:** `true`

**What it controls:**

- Points tab in side navigation
- Points management content showing:
  - Current balance display
  - Lifetime summary (earned, redeemed, adjustments)
  - Adjustment guidelines
  - "Adjust Points" button (triggers PointsAdjustmentModal)

**Required for:**

- **Points Adjustment Flow**: CSR → Members → Click member → Points tab → Adjust Points button

**Should always be enabled** unless you want to completely disable points management.

---

### 4. `NEXT_PUBLIC_FEATURE_MEMBER_RECEIPTS_TAB`

**Status:** IN SCOPE ✅ (Required for Manual Review flow)
**Default:** `true`

**What it controls:**

- Receipts tab in side navigation
- Receipt submissions table showing:
  - All member receipts with statuses (approved, rejected, pending, manual_review)
  - Receipt details (merchant, campaign, amount, points)
  - "View" button (opens ReceiptViewer)
  - "Review" button for manual_review receipts (triggers ManualReviewModal)

**Required for:**

- **Manual Review Flow**: CSR → Members → Click member → Receipts tab → Review button

**Should always be enabled** unless you want to completely disable receipt management.

---

### 5. `NEXT_PUBLIC_FEATURE_MEMBER_ANALYTICS_PANEL`

**Status:** REMOVED (not in flow diagram spec)
**Default:** `false`

**What it controlled:**

- Right-side analytics panel with charts and graphs
- **This feature has been removed entirely** - the layout is now full-width

**Note:** This flag exists for reference but the feature is no longer in the codebase.

---

## How to Use

### Example 1: Initial Release Configuration (Core Flows Only)

This is the **default configuration** matching the flow diagram spec.

```bash
# .env.local
NEXT_PUBLIC_FEATURE_MEMBER_PROFILE_TAB=false
NEXT_PUBLIC_FEATURE_MEMBER_HISTORY_TAB=false
NEXT_PUBLIC_FEATURE_MEMBER_POINTS_TAB=true
NEXT_PUBLIC_FEATURE_MEMBER_RECEIPTS_TAB=true
```

**Result:**

- Member Detail View shows 2 tabs: **Points** and **Receipts**
- Points Adjustment flow: ✅ Available
- Manual Review flow: ✅ Available
- Profile and History: Hidden

---

### Example 2: Full CRM Configuration (Future)

```bash
# .env.local
NEXT_PUBLIC_FEATURE_MEMBER_PROFILE_TAB=true
NEXT_PUBLIC_FEATURE_MEMBER_HISTORY_TAB=true
NEXT_PUBLIC_FEATURE_MEMBER_POINTS_TAB=true
NEXT_PUBLIC_FEATURE_MEMBER_RECEIPTS_TAB=true
```

**Result:**

- Member Detail View shows all 4 tabs: **Profile**, **Points**, **History**, **Receipts**
- Full member CRM experience with complete information

---

### Example 3: Points Management Only

```bash
# .env.local
NEXT_PUBLIC_FEATURE_MEMBER_PROFILE_TAB=false
NEXT_PUBLIC_FEATURE_MEMBER_HISTORY_TAB=false
NEXT_PUBLIC_FEATURE_MEMBER_POINTS_TAB=true
NEXT_PUBLIC_FEATURE_MEMBER_RECEIPTS_TAB=false
```

**Result:**

- Member Detail View shows only **Points** tab
- Only Points Adjustment flow available
- Useful if you want to disable receipt functionality

---

## Implementation Details

### Where Flags Are Defined

[config/featureFlags.ts](../../../config/featureFlags.ts)

```typescript
export const FEATURE_FLAGS = {
  MEMBER_PROFILE_TAB: parseEnvBoolean(
    process.env.NEXT_PUBLIC_FEATURE_MEMBER_PROFILE_TAB,
    false
  ),
  // ... other flags
} as const;
```

### Where Flags Are Used

[MemberDetailView.tsx](./MemberDetailView.tsx)

```typescript
import { FEATURE_FLAGS, getDefaultTab } from '@/config/featureFlags';

// Default tab based on enabled flags
const [currentTab, setCurrentTab] = useState(getDefaultTab());

// Conditional rendering of tab buttons
{FEATURE_FLAGS.MEMBER_POINTS_TAB && (
  <button onClick={() => setCurrentTab('points')}>Points</button>
)}

// Conditional rendering of tab content
{FEATURE_FLAGS.MEMBER_POINTS_TAB && currentTab === 'points' && (
  <div>Points Management Content</div>
)}
```

---

## Development Workflow

### Step 1: Set Environment Variables

Create or update `.env.local`:

```bash
# Copy from example
cp .env.example .env.local

# Edit with your preferred configuration
nano .env.local
```

### Step 2: Restart Dev Server

Environment variables are read at build time, so you must restart:

```bash
# Kill current dev server (Ctrl+C)

# Restart
pnpm dev
```

### Step 3: Verify Changes

Navigate to Members page → Click a member → Check which tabs are visible.

---

## Testing Scenarios

### Test Case 1: Verify Default Configuration

**Setup:**

```bash
NEXT_PUBLIC_FEATURE_MEMBER_PROFILE_TAB=false
NEXT_PUBLIC_FEATURE_MEMBER_HISTORY_TAB=false
NEXT_PUBLIC_FEATURE_MEMBER_POINTS_TAB=true
NEXT_PUBLIC_FEATURE_MEMBER_RECEIPTS_TAB=true
```

**Expected Result:**

1. Navigate to Members page
2. Click on "John Doe - Optum"
3. See 2 tabs: Points, Receipts
4. Default tab should be Points
5. Points tab shows "Adjust Points" button
6. Receipts tab shows receipt table with "Review" buttons for manual_review receipts

---

### Test Case 2: Verify Full CRM Configuration

**Setup:**

```bash
# Enable all features
NEXT_PUBLIC_FEATURE_MEMBER_PROFILE_TAB=true
NEXT_PUBLIC_FEATURE_MEMBER_HISTORY_TAB=true
NEXT_PUBLIC_FEATURE_MEMBER_POINTS_TAB=true
NEXT_PUBLIC_FEATURE_MEMBER_RECEIPTS_TAB=true
```

**Expected Result:**

1. Navigate to Members page
2. Click on "John Doe - Optum"
3. See 4 tabs: Profile, Points, History, Receipts
4. Default tab should be Profile
5. All tabs render correctly

---

### Test Case 3: Verify No Tabs Scenario

**Setup:**

```bash
# Disable all features (edge case)
NEXT_PUBLIC_FEATURE_MEMBER_PROFILE_TAB=false
NEXT_PUBLIC_FEATURE_MEMBER_HISTORY_TAB=false
NEXT_PUBLIC_FEATURE_MEMBER_POINTS_TAB=false
NEXT_PUBLIC_FEATURE_MEMBER_RECEIPTS_TAB=false
```

**Expected Result:**

1. No tab buttons visible (only Back button)
2. Main content area is empty
3. `getDefaultTab()` fallback returns 'points' but won't render since flag is false

**Note:** This is an edge case and not a valid configuration for production.

---

## Troubleshooting

### Problem: Environment variables not taking effect

**Solution:** Restart the dev server. Next.js reads `NEXT_PUBLIC_` variables at build time.

```bash
# Kill dev server (Ctrl+C)
pnpm dev
```

---

### Problem: "ReferenceError: process is not defined"

**Cause:** Environment variables without `NEXT_PUBLIC_` prefix are server-only.

**Solution:** All feature flags in `config/featureFlags.ts` use `NEXT_PUBLIC_` prefix for client-side access.

---

### Problem: Tab not rendering after enabling flag

**Check:**

1. Did you restart the dev server?
2. Is the environment variable spelled correctly?
3. Is the value set to `"true"` (string) or `"1"`?

```bash
# ✅ Correct
NEXT_PUBLIC_FEATURE_MEMBER_POINTS_TAB=true

# ❌ Wrong
NEXT_PUBLIC_FEATURE_MEMBER_POINTS_TAB="true"  # Quotes are optional but OK
NEXT_PUBLIC_FEATURE_MEMBER_POINTS_TAB=yes     # Won't work
```

---

## Future Enhancements

When enabling Profile and History tabs in the future:

1. **Profile Tab:**
   - Add edit functionality
   - Add notes/comments section
   - Add tags/segments
   - Add member activity feed

2. **History Tab:**
   - Add filtering (by date, type, status)
   - Add search
   - Add export functionality
   - Add receipt attachment previews

3. **New Flags to Consider:**
   - `FEATURE_MEMBER_PROFILE_EDIT` - Toggle edit mode
   - `FEATURE_MEMBER_BULK_ACTIONS` - Toggle bulk operations
   - `FEATURE_MEMBER_EXPORT` - Toggle export functionality

---

## Summary

| Flag                     | Default | Status       | Purpose                                 |
| ------------------------ | ------- | ------------ | --------------------------------------- |
| `MEMBER_PROFILE_TAB`     | `false` | OUT OF SCOPE | Future: Member profile information      |
| `MEMBER_HISTORY_TAB`     | `false` | OUT OF SCOPE | Future: Transaction history audit trail |
| `MEMBER_POINTS_TAB`      | `true`  | IN SCOPE ✅  | Required: Points Adjustment flow        |
| `MEMBER_RECEIPTS_TAB`    | `true`  | IN SCOPE ✅  | Required: Manual Review flow            |
| `MEMBER_ANALYTICS_PANEL` | `false` | REMOVED      | Legacy: Right-side analytics (removed)  |

For the **initial release**, only Points and Receipts tabs should be enabled to match the flow diagram specification.
