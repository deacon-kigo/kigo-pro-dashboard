# Using Real Dashboard Components

## How It Works

Remotion runs inside kigo-pro-dashboard, so all Next.js components are importable via the `@/` path alias. This means you can render actual dashboard UI inside video compositions, creating authentic product demos.

## Path Alias

The `@/` alias resolves to the project root, matching the Next.js `tsconfig.json` paths. This is configured in `remotion.config.ts`:

```typescript
config.resolve.alias = {
  "@": projectRoot,
  // ...shims
};
```

## Shims

Next.js runtime APIs do not exist in Remotion's webpack environment. The following shims are configured in `remotion.config.ts` and located in `remotion/shims/`:

| Next.js Module    | Shim File                           | Behavior                                                    |
| ----------------- | ----------------------------------- | ----------------------------------------------------------- |
| `next/image`      | `remotion/shims/next-image.tsx`     | Renders a plain `<img>` tag with the same props             |
| `next/link`       | `remotion/shims/next-link.tsx`      | Renders a plain `<a>` tag with the same props               |
| `next/navigation` | `remotion/shims/next-navigation.ts` | No-op hooks (`useRouter`, `usePathname`, `useSearchParams`) |
| `next/headers`    | `remotion/shims/next-headers.ts`    | No-op `cookies()` and `headers()` functions                 |

## Redux Store

All compositions are wrapped in `<StoreProvider>` (defined in `remotion/providers/StoreProvider.tsx`), which creates a fresh Redux store instance via `makeStore()` from `@/lib/redux/store`.

### Pre-populating State

To render a component that depends on Redux state, dispatch actions inside the composition before rendering the UI:

```tsx
import { useDispatch } from "react-redux";
import { setCampaigns } from "@/lib/redux/slices/campaignSlice";
import { CampaignTable } from "@/components/features/campaigns/CampaignTable";

const DashboardScene: React.FC = () => {
  const dispatch = useDispatch();

  // Pre-populate the store with mock data
  React.useEffect(() => {
    dispatch(setCampaigns(mockCampaignData));
  }, [dispatch]);

  return (
    <FullScreenUI deviceFrame title="CAMPAIGN MANAGER">
      <CampaignTable />
    </FullScreenUI>
  );
};
```

Note: This is one of the few valid uses of `useEffect` in Remotion compositions -- for initial data setup, not for animation.

## Common Importable Components

These component paths follow the kigo-pro-dashboard project structure:

### Dashboard Layouts

- `@/components/layouts/DashboardLayout` -- Main dashboard shell
- `@/components/layouts/Sidebar` -- Navigation sidebar

### Analytics

- `@/components/features/analytics/AnalyticsDashboard` -- Charts and metrics
- `@/components/features/analytics/MetricsGrid` -- KPI cards
- `@/components/features/analytics/ChartPanel` -- Individual chart panels

### Campaigns

- `@/components/features/campaigns/CampaignTable` -- Campaign list table
- `@/components/features/campaigns/CampaignDetail` -- Single campaign view
- `@/components/features/campaigns/CampaignCreator` -- Campaign builder

### Offer Manager

- `@/components/features/offer-manager/OfferGrid` -- Offer card grid
- `@/components/features/offer-manager/OfferDetail` -- Single offer view
- `@/components/features/offer-manager/OfferEditor` -- Offer creation form

### AI Assistant

- `@/components/features/ai-assistant/ChatInterface` -- AI chat panel
- `@/components/features/ai-assistant/SuggestionPanel` -- AI suggestions

Note: Verify actual component paths in the codebase before importing. The paths above reflect the expected project structure.

## Limitations

1. **No API calls at render time** -- Components must not call `fetch()`, server actions, or any async data source. All data must come from Redux state or props.
2. **No client-side routing** -- `useRouter()` returns no-op functions via the shim. Components that navigate on click will not throw but will not navigate.
3. **Synchronous rendering only** -- Components must render synchronously with the data they have. Suspense boundaries that depend on async resources will not resolve.
4. **No browser-specific APIs** -- Some components may use `window.localStorage`, `navigator`, `ResizeObserver`, or other browser APIs not available in Remotion's headless Chromium. These may need additional shims.
5. **Style compatibility** -- Tailwind CSS is enabled via `@remotion/tailwind` in `remotion.config.ts`. However, components using CSS Modules or other CSS-in-JS solutions may need verification.
6. **Static frame rendering** -- Remotion renders each frame independently. Components with internal animation (CSS transitions, requestAnimationFrame) will appear frozen. Wrap them in Remotion animation primitives instead.

## Best Practices

1. **Create mock data files** -- Keep mock/demo data in `remotion/data/` or co-located with compositions
2. **Test incrementally** -- Run `npm run video:dev` and verify each real UI component renders correctly before composing full scenes
3. **Simplify when needed** -- If a dashboard component is too complex or has too many dependencies, consider using a screenshot in `FullScreenUI` or `DeviceMockup3D` instead
4. **Keep it static** -- The goal is to show the UI at a specific state, not to animate its interactivity. Use Remotion animations for the entrance/exit of the UI component as a whole
