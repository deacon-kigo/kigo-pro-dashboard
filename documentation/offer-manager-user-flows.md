# Offer Manager User Flows

## Visual Navigation & Decision Trees

## Flow Diagram

```
┌─────────────────┐
│   DASHBOARD     │
│  (Offers List)  │
└────────┬────────┘
         │
         ├──────────────┬──────────────┐
         │              │              │
         v              v              v
   [New Offer]   [New Campaign]  [Edit Existing]
         │              │
         │              │
         v              v
┌─────────────────────────────────────┐
│      OFFER CREATION FLOW            │
│  ┌───────────────────────────────┐  │
│  │ Step 1: Goal & Context        │  │
│  └───────────────────────────────┘  │
│              ↓                      │
│  ┌───────────────────────────────┐  │
│  │ Step 2: Offer Type & Value    │  │
│  └───────────────────────────────┘  │
│              ↓                      │
│  ┌───────────────────────────────┐  │
│  │ Step 3: Redemption Method     │  │
│  └───────────────────────────────┘  │
│              ↓                      │
│  ┌───────────────────────────────┐  │
│  │ Step 4: Promo Code (Optional) │  │
│  └───────────────────────────────┘  │
│              ↓                      │
│  ┌───────────────────────────────┐  │
│  │ Step 5: Brand & Compliance    │  │
│  └───────────────────────────────┘  │
│              │                      │
└──────────────┼──────────────────────┘
               │
        ┌──────┴──────┐
        │             │
        v             v
  [Save & Exit]  [Continue to Campaign]
        │             │
        │             v
        │    ┌─────────────────────────────────────┐
        │    │    CAMPAIGN MANAGEMENT FLOW         │
        │    │  ┌───────────────────────────────┐  │
        │    │  │ Step 6: Offer Selection       │  │
        │    │  │  (Auto-filled if from Step 5) │  │
        │    │  └───────────────────────────────┘  │
        │    │              ↓                      │
        │    │  ┌───────────────────────────────┐  │
        │    │  │ Step 7: Targeting & Partners  │  │
        │    │  └───────────────────────────────┘  │
        │    │              ↓                      │
        │    │  ┌───────────────────────────────┐  │
        │    │  │ Step 8: Schedule & Timing     │  │
        │    │  └───────────────────────────────┘  │
        │    │              ↓                      │
        │    │  ┌───────────────────────────────┐  │
        │    │  │ Step 9: Delivery Channels     │  │
        │    │  └───────────────────────────────┘  │
        │    │              ↓                      │
        │    │  ┌───────────────────────────────┐  │
        │    │  │ Step 10: Review & Launch      │  │
        │    │  └───────────────────────────────┘  │
        │    │              ↓                      │
        │    └──────────────┼──────────────────────┘
        │                   │
        │            ┌──────┴──────┐
        │            │             │
        │            v             v
        │      [Save Draft]   [Launch Campaign]
        │            │             │
        └────────────┴─────────────┘
                     │
                     v
            ┌────────────────┐
            │   DASHBOARD    │
            │ (Updated List) │
            └────────────────┘
```

---

## User Journey Scenarios

### Scenario 1: Create Offer + Campaign (Linear Flow)

**User**: Kigo Team Member creating promotion for John Deere

1. Click "Create New Offer" from dashboard
2. Progress through Steps 1-5 (Offer Creation)
3. Click "Continue to Campaign" after Step 5
4. Progress through Steps 6-10 (Campaign Management)
   - Step 6 auto-filled with newly created offer
5. Review and launch

**Navigation**:

- Forward navigation using "Next Step" button
- Can go back to any completed step
- Can "Save Draft" at any point

---

### Scenario 2: Create Offer Only (Save for Later)

**User**: Yardi Marketing Team creating offer for future use

1. Click "Create New Offer" from dashboard
2. Progress through Steps 1-5 (Offer Creation)
3. Click "Save & Exit" after Step 5
4. Return to dashboard
5. (Later) Select offer from catalog to create campaign

**Navigation**:

- Steps 1-5 only
- No campaign steps shown
- Clear "Save & Exit" action at Step 5

---

### Scenario 3: Create Campaign with Existing Offer

**User**: John Deere Dealer using corporate offer

1. Click "Create New Campaign" from dashboard
2. Step 6: Select existing offer from catalog
   - Filter by offer type
   - Preview offer details
3. Progress through Steps 7-10 (Campaign Management only)
4. Review and launch

**Navigation**:

- Skip Steps 1-5 (grayed out in stepper)
- Start at Step 6 with offer selection
- Steps 7-10 enabled
- Phase separator shows "Using Existing Offer"

---

### Scenario 4: Edit and Resume Draft

**User**: Any user returning to incomplete work

1. Dashboard shows "Draft" status on offer/campaign
2. Click "Resume" on draft item
3. Land on last completed step + 1
4. Continue from that point

**Navigation**:

- All completed steps available for editing
- Current step highlighted
- Remaining steps pending
- Progress bar shows completion percentage

---

## Decision Points & Conditional Logic

### After Step 3: Redemption Method Selection

```
Step 3: Redemption Method = ?
    │
    ├─ "Promo Code" → Show Step 4 (Promo Code Setup)
    │                  ↓
    │                  Continue to Step 5
    │
    └─ Other methods → Skip Step 4, go directly to Step 5
```

### After Step 5: Offer Completion

```
Step 5: Brand & Compliance Complete
    │
    ├─ User clicks "Continue to Campaign"
    │   → Save offer
    │   → Auto-populate Step 6 with new offer
    │   → Navigate to Step 7
    │
    └─ User clicks "Save & Exit"
        → Save offer to catalog
        → Return to dashboard
        → Show success message: "Offer saved! Create campaign anytime."
```

### Step 6: Offer Selection (Campaign-Only Flow)

```
Starting Campaign Creation
    │
    ├─ Coming from Step 5?
    │   → Auto-select newly created offer
    │   → Show "Using: [Offer Name]"
    │   → Skip to Step 7
    │
    └─ Starting fresh?
        → Show offer picker
        → Filter: Affiliate, Card-Linked, Discounted Product, Created
        → User selects → Continue to Step 7
```

### Step 9: Delivery Channels (Program-Aware)

```
Program Type = ?
    │
    ├─ Closed Loop (John Deere)
    │   → Show: Activation Campaigns, Hub Airdrops
    │   → Hide: Promoted Marketplace, Organic Marketplace
    │   → Agent explains: "Closed loop programs use dealer network only"
    │
    └─ Open Loop (Yardi)
        → Show: All 4 channel types
        → Allow multi-select
        → Agent explains: "Leverage marketplace for broader reach"
```

---

## State Transitions

### Offer State Machine

```
[Draft] → [Reviewing] → [Saved] → [In Campaign]
   ↓          ↑           ↓
[Editing] ←──┘      [Archived]
```

**States**:

- **Draft**: Incomplete, can resume
- **Reviewing**: Step 5 complete, pending user decision
- **Saved**: Complete offer, available for campaigns
- **Editing**: User modifying saved offer
- **In Campaign**: Linked to active campaign (read-only)
- **Archived**: No longer active

### Campaign State Machine

```
[Draft] → [Scheduled] → [Active] → [Completed]
   ↓          ↓           ↓            ↓
[Editing]  [Paused]   [Stopped]  [Archived]
```

**States**:

- **Draft**: Incomplete or awaiting launch
- **Scheduled**: Future start date set
- **Active**: Currently running
- **Paused**: Temporarily halted (can resume)
- **Stopped**: Manually ended (cannot resume)
- **Completed**: Reached end date naturally
- **Editing**: Modifying scheduled campaign
- **Archived**: Historical record only

---

## Navigation Controls

### Header Navigation Bar

```
┌─────────────────────────────────────────────────────────┐
│  [← Back to Dashboard]              [Save Draft] [Next] │
└─────────────────────────────────────────────────────────┘
```

**Context-Sensitive Buttons**:

| Current Step | Primary Button       | Secondary Button | Tertiary Button |
| ------------ | -------------------- | ---------------- | --------------- |
| Step 1       | Next →               | Save Draft       | —               |
| Steps 2-4    | Next →               | Save Draft       | ← Previous      |
| Step 5       | Continue to Campaign | Save & Exit      | ← Previous      |
| Step 6       | Next →               | Save Draft       | Change Offer    |
| Steps 7-9    | Next →               | Save Draft       | ← Previous      |
| Step 10      | Launch Now           | Schedule         | ← Previous      |

### Stepper Interactions

**Click Behavior**:

- **Completed steps**: Click to navigate and edit
- **Current step**: No action (already there)
- **Future steps**: Disabled (must complete in order)
- **Phase separator**: Not clickable

**Visual Indicators**:

```
● = Completed (blue filled circle)
◉ = Current (blue outlined circle, pulsing)
○ = Pending (gray outlined circle)
(●) = Conditional (only shown if applicable)
═══ = Phase separator (horizontal line)
```

---

## AI Agent Interaction Patterns

### Proactive Guidance

**At Step Entry**:

```
Agent: "I see you're setting up [Step Name]. Here's what I recommend..."
[Shows 2-3 key suggestions]
[Ask me anything] button
```

**Field-Level Help**:

```
Each form field has a small sparkle icon (✨)
User clicks → Agent provides contextual help
"For [Field Name], I suggest... because..."
```

### Reactive Assistance

**User asks question**:

```
User: "What discount value should I use?"
Agent:
  - Analyzes: business objective, audience, historical data
  - Recommends: "15-20% discount based on..."
  - Explains: "This range typically drives..."
  - Action: "Would you like me to set this for you?"
```

**Validation Errors**:

```
Agent (when user tries to proceed with errors):
  "I noticed [Field X] needs attention. Here's why..."
  [Shows validation message]
  [Suggests fix]
```

### Workflow Optimization

**Intelligent Defaults**:

- Agent pre-fills fields based on:
  - User's previous offers
  - Program type (closed/open loop)
  - Business objective
  - Historical performance

**Skip Logic**:

- Agent suggests: "You can skip Step 4 since you selected [Redemption Method]"
- Auto-advances when appropriate

---

## Responsive Behavior

### Desktop (1440px+)

```
┌─────────┬───────────────────────────┬──────────┐
│ Stepper │   Main Content Form       │  Agent   │
│  (80px) │         (flexible)        │ (320px)  │
└─────────┴───────────────────────────┴──────────┘
```

### Tablet (768px - 1439px)

```
┌─────────┬───────────────────────────┐
│ Stepper │   Main Content Form       │
│  (60px) │         (flexible)        │
└─────────┴───────────────────────────┘
[Agent panel as overlay/modal on demand]
```

### Mobile (<768px)

```
┌────────────────────────────┐
│    Horizontal Stepper      │
│      (progress dots)       │
├────────────────────────────┤
│                            │
│    Main Content Form       │
│         (full width)       │
│                            │
└────────────────────────────┘
[Agent as bottom sheet on demand]
```

---

## Error & Edge Cases

### Unsaved Changes Warning

```
User tries to navigate away with unsaved changes:
┌──────────────────────────────────┐
│  ⚠️  Unsaved Changes             │
│                                  │
│  You have unsaved changes. What  │
│  would you like to do?           │
│                                  │
│  [Save Draft]  [Discard]  [Cancel]│
└──────────────────────────────────┘
```

### Validation Failures

```
User clicks "Next" but form invalid:
- Highlight invalid fields in red
- Show inline error messages
- Agent provides guidance
- "Next" button remains clickable (for accessibility)
- Toast notification: "Please fix X errors before continuing"
```

### Network Errors

```
Save/submit fails due to network:
- Show error toast with retry option
- Preserve form data in local storage
- Agent offers to retry or save locally
- Auto-retry with exponential backoff
```

---

## Accessibility Considerations

### Keyboard Navigation

- Tab order follows visual flow
- Enter key submits current step
- Escape key cancels/goes back
- Arrow keys navigate between form fields

### Screen Reader Announcements

- Step changes announced: "Now on Step 3 of 10: Redemption Method"
- Progress updates: "25% complete"
- Validation errors read aloud
- Agent responses announced

### Focus Management

- On step change, focus moves to main heading
- After error, focus moves to first invalid field
- Modal opens, focus trapped inside
- Modal closes, focus returns to trigger

---

## Performance Considerations

### Lazy Loading

- Steps 6-10 components loaded only when needed
- Agent responses streamed, not waited for
- Images/assets lazy loaded

### Auto-Save

- Save draft every 30 seconds
- Debounced form field saves
- Visual indicator: "Saving..." → "Saved ✓"

### Optimistic UI

- Form updates instant (don't wait for API)
- Rollback on error
- Progress bar updates immediately
