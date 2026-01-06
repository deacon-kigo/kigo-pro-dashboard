# Member CRM Feature

## Overview

The Member CRM feature provides Customer Support agents with tools to manage member accounts, view points balances, review transaction history, and manually adjust points when needed.

## Features (V1)

- **Member Search**: Search members by email, name, or account ID
- **Member Profile**: View detailed member information and active programs
- **Points Balance**: Display current points balance with conversion info
- **Transaction History**: View complete transaction history with filtering
- **Points Adjustment**: Manual adjustment workflow with full audit trail
- **Receipt Viewer**: View receipt images and verification details

## Architecture

### Component Structure

```
member-crm/
├── MemberCRMView.tsx          # Main orchestrator (like TokenManagementView)
├── MemberSearch.tsx            # Search and lookup interface
├── MemberProfile.tsx           # Member profile display
├── PointsBalance.tsx           # Points balance card
├── PointsHistory.tsx           # Transaction history table
├── PointsAdjustmentModal.tsx   # Adjustment modal with validation
├── ReceiptViewer.tsx           # Receipt image modal
├── types.ts                    # TypeScript interfaces
├── data.ts                     # Sample data for demo
├── utils.ts                    # Helper functions
└── index.ts                    # Export barrel
```

### Routing

- **`/dashboard/members`** - Member CRM home (search interface)
- Future routes for V2:
  - `/dashboard/members/[memberId]` - Individual member hub
  - `/dashboard/members/[memberId]/points` - Points detail view
  - `/dashboard/members/[memberId]/transactions` - Transaction history
  - `/dashboard/members/[memberId]/receipts` - Receipt viewer

## Usage

```tsx
import { MemberCRMView } from "@/components/features/member-crm";

export default function MembersPage() {
  return <MemberCRMView />;
}
```

## Key Patterns

### State Management

Uses local React state (useState) for V1. Future versions will integrate with Redux:

```tsx
const [selectedMember, setSelectedMember] = useState<MemberWithPoints | null>(
  null
);
const [showAdjustModal, setShowAdjustModal] = useState(false);
```

### Modal Flow

1. User searches for member
2. Selects member from results
3. Views points balance and history
4. Clicks "Adjust Points"
5. Fills adjustment form with validation
6. Reviews confirmation
7. Submits adjustment
8. Sees success message
9. Balance auto-refreshes

### Validation Rules

- **Amount**: Must be > 0
- **Direction**: Cannot subtract more than current balance
- **Reason**: Required selection from predefined list
- **Notes**: Minimum 10 characters for audit trail

## Component Dependencies

### From Kigo PRO

- `StandardDashboard` - Layout template
- `Card` - Base card component
- `Button` - Button atom
- `StatCard` - Statistics display

### Icons

- `@heroicons/react/24/outline` - All icons

## Data Flow

```
MemberCRMView (orchestrator)
    │
    ├──► MemberSearch ──► User selects member
    │
    ├──► MemberProfile ──► Displays member info
    │
    ├──► PointsBalance ──► Shows current balance
    │        └──► Opens PointsAdjustmentModal
    │
    ├──► PointsHistory ──► Shows transactions
    │        └──► Opens ReceiptViewer
    │
    ├──► PointsAdjustmentModal ──► Submits adjustment
    │        └──► onSuccess callback
    │
    └──► ReceiptViewer ──► Displays receipt image
```

## API Integration (Future)

V1 uses mock data. Production integration points:

```typescript
// Search members
GET /api/members/search?q={query}

// Get member details
GET /api/members/{memberId}

// Get points balance
GET /api/members/{memberId}/points

// Get transactions
GET /api/members/{memberId}/transactions

// Submit adjustment
POST /api/dashboard/points/adjust
{
  accountId, programId, direction,
  pointsAmount, promotionId,
  adjustmentReason, notes
}

// Get receipt
GET /api/receipts/{receiptId}
```

## Testing

### Manual Testing Checklist

- [ ] Search for members by email
- [ ] Search for members by name
- [ ] Search for members by account ID
- [ ] Select member from search results
- [ ] View member profile and programs
- [ ] View points balance
- [ ] Filter transaction history (all, earn, redeem, adjust)
- [ ] View receipt from transaction
- [ ] Open adjustment modal
- [ ] Test form validation (invalid amounts, negative balance)
- [ ] Submit adjustment (add points)
- [ ] Submit adjustment (subtract points)
- [ ] Verify balance updates after adjustment
- [ ] Test confirmation step cancellation

## Future Enhancements (V2+)

### Phase 2

- Redux state management integration
- Real API integration
- Member list view with pagination
- Advanced search filters
- Bulk adjustments
- Export transaction history

### Phase 3

- Approval workflows for large adjustments
- Integration with ticketing system
- Member communication tools
- Automated adjustment suggestions
- Analytics dashboard
- Program transfer tools

## Related Features

- **Token Management** (`/components/features/token-management`) - Similar pattern for CVS tokens
- **Offer Manager** (`/components/features/offer-manager`) - Offer management interface
- **Campaign Manager** (`/components/features/campaign-manager`) - Campaign management

## Notes

- All monetary values are stored in USD cents (invariant)
- Points are calculated for display using conversion rate
- All adjustments create immutable ledger entries
- Admin user ID is captured for every adjustment
- Reason and notes are required for audit compliance
