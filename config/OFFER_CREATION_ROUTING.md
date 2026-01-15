# Offer Creation Routing Strategy

## Overview

The offer creation form uses feature flags to route users to different versions of the form. Each version has its own dedicated route to keep the code clean and allow for easy A/B testing.

---

## Routes

### V1: Current Production (Default)

- **Route:** `/dashboard/offers/create`
- **Component:** `OfferCreationView` (single page form)
- **Status:** ✅ Production
- **Feature Flag:** `NEXT_PUBLIC_OFFER_CREATION_VERSION=v1` (default)

### V2: Enhanced with Smart Features

- **Route:** `/dashboard/offers/create-v2`
- **Component:** TBD (will be built when ready)
- **Status:** 🚧 Placeholder page
- **Feature Flag:** `NEXT_PUBLIC_OFFER_CREATION_VERSION=v2`

### V3: AI-Assisted (Future)

- **Route:** `/dashboard/offers/create-v3`
- **Status:** 🔮 Not yet created
- **Feature Flag:** `NEXT_PUBLIC_OFFER_CREATION_VERSION=v3`

### V4: Autonomous (Vision)

- **Route:** `/dashboard/offers/create-v4`
- **Status:** 🔮 Not yet created
- **Feature Flag:** `NEXT_PUBLIC_OFFER_CREATION_VERSION=v4`

---

## How It Works

### 1. Feature Flag Routing

The `/dashboard/offers/create` page checks the feature flag and redirects users to the appropriate version:

```typescript
// app/dashboard/offers/create/page.tsx
import { getOfferCreationVersion } from "@/config/featureFlags";

export default function OfferCreationPage() {
  const version = getOfferCreationVersion();

  // Redirect to versioned route if not V1
  if (version !== "v1") {
    router.push(`/dashboard/offers/create-v${version.slice(1)}`);
    return null;
  }

  // Show V1 form
  return <OfferCreationView />;
}
```

### 2. Versioned Routes

Each version has its own route:

```
app/dashboard/offers/
├── create/
│   └── page.tsx          # V1 (with redirect logic)
├── create-v2/
│   └── page.tsx          # V2 (placeholder for now)
├── create-v3/            # Future
└── create-v4/            # Future
```

### 3. User Experience

**Default (V1):**

- User clicks "Create Offer"
- Goes to `/dashboard/offers/create`
- Sees V1 form immediately

**When V2 is enabled:**

- Set `NEXT_PUBLIC_OFFER_CREATION_VERSION=v2`
- User clicks "Create Offer"
- Goes to `/dashboard/offers/create`
- Automatically redirected to `/dashboard/offers/create-v2`
- Sees V2 form (or placeholder page until built)

---

## Benefits of This Approach

### 1. Clean Separation

- Each version has its own codebase
- No complex conditional rendering in one component
- Easy to maintain and debug

### 2. A/B Testing Ready

```typescript
// Can easily split traffic:
const version = Math.random() > 0.5 ? "v1" : "v2";
router.push(`/dashboard/offers/create-v${version.slice(1)}`);
```

### 3. Gradual Rollout

```bash
# Week 1: Test with 10% of users
NEXT_PUBLIC_OFFER_CREATION_VERSION=v2  # For 10% of traffic

# Week 2: Increase to 50%
NEXT_PUBLIC_OFFER_CREATION_VERSION=v2  # For 50% of traffic

# Week 3: Full rollout
NEXT_PUBLIC_OFFER_CREATION_VERSION=v2  # For everyone
```

### 4. Easy Rollback

If V2 has issues, just switch the flag back:

```bash
NEXT_PUBLIC_OFFER_CREATION_VERSION=v1  # Instant rollback
```

### 5. Progressive Enhancement

Can enable V2 features incrementally:

```bash
# Start with just smart defaults
NEXT_PUBLIC_OFFER_CREATION_VERSION=v1
NEXT_PUBLIC_OFFER_FORM_SMART_DEFAULTS=true

# Add inline validation
NEXT_PUBLIC_OFFER_FORM_INLINE_VALIDATION=true

# When all features work, switch to full V2
NEXT_PUBLIC_OFFER_CREATION_VERSION=v2
```

---

## Migration Path

### Phase 1: V1 in Production (Current)

```
/dashboard/offers/create → V1 Form
```

### Phase 2: Build V2

1. Create `/dashboard/offers/create-v2/page.tsx`
2. Build V2 form with enhanced features
3. Test locally with `NEXT_PUBLIC_OFFER_CREATION_VERSION=v2`

### Phase 3: Test V2 in Staging

1. Deploy to staging with V2 enabled
2. QA team tests new features
3. Fix bugs and iterate

### Phase 4: Gradual Production Rollout

1. Week 1: 10% of users get V2
2. Week 2: 50% of users get V2
3. Week 3: 100% of users get V2

### Phase 5: Deprecate V1

1. Monitor V2 for a month
2. If stable, make V2 the default
3. Update `/dashboard/offers/create` to show V2 directly
4. Keep V1 route as fallback: `/dashboard/offers/create-v1`

---

## Environment Variables

```bash
# .env.local (development)
NEXT_PUBLIC_OFFER_CREATION_VERSION=v1

# .env.production (production)
NEXT_PUBLIC_OFFER_CREATION_VERSION=v1

# .env.staging (staging - test V2)
NEXT_PUBLIC_OFFER_CREATION_VERSION=v2
```

---

## Storybook Integration

Storybook stories are updated to point to the correct routes:

```
Applications → Kigo Pro → Prototypes → Offer Manager → Offer Creation
  ├── V1 Current         → iframe: /dashboard/offers/create
  └── V2 Planned         → iframe: /dashboard/offers/create-v2
```

---

## Code Locations

### Routing

- `/app/dashboard/offers/create/page.tsx` - V1 with redirect logic
- `/app/dashboard/offers/create-v2/page.tsx` - V2 placeholder
- `/config/featureFlags.ts` - Feature flag configuration

### Components

- `/components/features/dashboard/views/OfferCreationView.tsx` - V1 form
- `/components/features/offer-manager/v2/` - V2 form (future)

### Storybook

- `/src/applications/kigo-pro/prototypes/stories/offer-creation/OfferCreation.stories.tsx`

---

## Testing

### Test V1 (Default)

```bash
npm run dev
# Visit http://localhost:3000/dashboard/offers/create
```

### Test V2

```bash
# Set environment variable
NEXT_PUBLIC_OFFER_CREATION_VERSION=v2 npm run dev
# Visit http://localhost:3000/dashboard/offers/create
# Should auto-redirect to /dashboard/offers/create-v2
```

### Test Direct Routes

```bash
npm run dev
# V1: http://localhost:3000/dashboard/offers/create
# V2: http://localhost:3000/dashboard/offers/create-v2
```

---

## Next Steps

1. **Build V2 Form**
   - Replace placeholder in `/app/dashboard/offers/create-v2/page.tsx`
   - Implement smart defaults, inline validation, auto-save

2. **Test Thoroughly**
   - Unit tests for new features
   - E2E tests for entire flow
   - A/B testing with real users

3. **Monitor Performance**
   - Track completion rates
   - Monitor error rates
   - Collect user feedback

4. **Iterate**
   - Fix bugs based on feedback
   - Add more V2 features
   - Plan V3 (AI-assisted)
