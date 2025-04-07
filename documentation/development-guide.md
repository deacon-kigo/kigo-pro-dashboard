# Kigo Pro Dashboard Development Guide

This document outlines the organization strategy for the Kigo Pro Dashboard components, following a hybrid approach of atomic design principles and feature-based organization.

## Guiding Principles

1. **Atomic Design for UI Components**: Generic UI components follow atomic design (atoms, molecules, organisms, templates)
2. **Feature-Based Organization for Domain Logic**: Domain-specific components are organized by feature
3. **Incremental Migration**: Changes are made incrementally without disrupting the working application
4. **No Structural Overhaul**: Keep working within existing app and components directories
5. **Design System Consistency**: Leverage Kigo design tokens while implementing with Tailwind CSS
6. **Performance Optimization**: Implement safeguards against infinite loops and unnecessary renders

## Design System Strategy

As the sole designer for Kigo Pro, we've made the strategic decision to:

1. **Adopt Kigo design tokens** (colors, typography, spacing, etc.) for brand consistency
2. **Use Tailwind CSS** for implementation rather than Material UI components
3. **Create custom components** that align with the Kigo brand but are optimized for the Pro platform

### Design Token Integration

We will extract design tokens from the Kigo Web SDK (`kigoMuiTheme.ts`) and integrate them into our Tailwind configuration. This allows us to maintain brand consistency while using our preferred technology stack.

The design tokens to be integrated include:

- **Color palette**: Primary, secondary, neutrals, and semantic colors
- **Typography**: Font family, sizes, weights, and line heights
- **Breakpoints**: Screen size definitions
- **Border radii**: Standard rounded corner values
- **Spacing**: Consistent spacing values (based on Kigo patterns)

### Implementation Approach for Nav & Header Components

The navigation and header components will be implemented using Tailwind CSS while maintaining the Kigo branding. This approach:

1. Maintains technical consistency (single styling approach)
2. Provides better developer experience with familiar Tailwind patterns
3. Allows for future flexibility and customization
4. Optimizes bundle size by avoiding unused Material UI components

The implementation will be documented in Storybook to ensure proper usage patterns and design consistency across the application.

## React Performance Optimization

To ensure optimal performance in our React components, we've implemented several key patterns to prevent common issues such as infinite render loops and unnecessary re-renders.

### Preventing Infinite Render Loops

Infinite render loops occur when a component continuously updates its state or props in a way that triggers additional renders, creating a cycle that can freeze the application.

#### Common causes of infinite loops:

- State updates in useEffect hooks with dependencies that change on every render
- Props or state changing in response to component re-renders
- Redux action dispatches triggering additional component updates
- URL parameter changes causing state updates that trigger URL changes

#### Implemented solutions:

1. **One-time initialization with refs**:

   ```tsx
   function MyComponent() {
     // Track initialization status
     const isInitializedRef = useRef(false);

     useEffect(() => {
       // Skip if already initialized
       if (isInitializedRef.current) {
         return;
       }

       // Mark as initialized immediately
       isInitializedRef.current = true;

       // One-time initialization logic here
       setClientId("some-id");
     }, []); // Empty dependency array
   }
   ```

2. **Memoizing event handlers with useCallback**:

   ```tsx
   // Avoid creating new function instances on each render
   const handleClick = useCallback(() => {
     dispatch(someAction());
   }, [dispatch]);
   ```

3. **Stabilizing useEffect dependencies**:

   ```tsx
   // Store URL params in refs instead of depending on searchParams
   const paramRef = useRef(searchParams.get("id"));

   useEffect(() => {
     // Use the stored parameter value
     const param = paramRef.current;
     // Effect logic...
   }, []); // No dependency on searchParams
   ```

### Redux Optimization

Our Redux architecture has been optimized with several key patterns:

1. **Equality checks in reducers**:

   ```tsx
   // Only update state if the value actually changed
   case 'SET_CLIENT_ID':
     if (state.clientId === action.payload) {
       return state; // Return same reference if unchanged
     }
     return {
       ...state,
       clientId: action.payload
     };
   ```

2. **Safe middleware implementation**:

   ```tsx
   // Process the action before any side effects
   const middleware = (store) => (next) => (action) => {
     // Process action first
     const result = next(action);

     // Then handle any side effects
     if (ENABLE_ACTION_LOGGING && action.type.startsWith("demo/")) {
       // Log or perform other side effects
     }

     return result;
   };
   ```

3. **URL synchronization safeguards**:

   ```tsx
   // Global sync state to prevent parallel operations
   const syncState = {
     isSyncing: false,
     lastSyncedPath: null,
   };

   // Skip synchronization under certain conditions
   if (syncState.isSyncing || pathname === syncState.lastSyncedPath) {
     return;
   }
   ```

4. **Memoized Context values**:

   ```tsx
   // Memoize handlers and context value
   const setClientIdHandler = useCallback(
     (clientId) => {
       dispatch(setClientId(clientId));
     },
     [dispatch]
   );

   const contextValue = useMemo(
     () => ({
       ...demoState,
       setClientId: setClientIdHandler,
       // Other handlers...
     }),
     [
       demoState,
       setClientIdHandler,
       // Other dependencies...
     ]
   );
   ```

### Redux Architecture and Data Flow

Our improved Redux implementation follows this data flow pattern:

```
┌─────────────────────────┐
│                         │
│  Component (React)      │
│                         │
└───────────┬─────────────┘
            │
            │ Dispatch Action
            ▼
┌─────────────────────────┐           ┌─────────────────────────┐
│                         │           │                         │
│  Middleware             │──────────▶│  Action Logging         │
│  (Safety Checks)        │           │  (No State Access)      │
│                         │           │                         │
└───────────┬─────────────┘           └─────────────────────────┘
            │
            │ Process Action
            ▼
┌─────────────────────────┐
│                         │
│  Reducer                │
│  (With Equality Checks) │
│                         │
└───────────┬─────────────┘
            │
            │ Update State
            ▼
┌─────────────────────────┐           ┌─────────────────────────┐
│                         │           │                         │
│  Redux Store            │──────────▶│  URL Sync               │
│                         │           │  (With Safety Locks)    │
│                         │           │                         │
└───────────┬─────────────┘           └─────────────────────────┘
            │
            │ State Changes
            ▼
┌─────────────────────────┐
│                         │
│  Component Re-render    │
│  (Memoized Handlers)    │
│                         │
└─────────────────────────┘
```

Key improvements in this architecture:

- Middleware processes actions before any side effects
- Reducers implement equality checks to prevent unnecessary updates
- URL synchronization includes safety locks to prevent cycles
- Components use memoization to prevent handler recreation

## Target File Structure

```
kigo-pro-dashboard/
├── app/                                # Next.js App Router (no changes)
│   ├── dashboard/                      # Dashboard routes
│   ├── campaigns/                      # Campaign routes
│   └── demos/                          # Demo-specific routes
│
├── components/                         # Main component library (primary focus of our organization)
│   │
│   ├── atoms/                          # Basic building blocks (no structural changes)
│   │   ├── Badge/                      # Base Badge component (unchanged)
│   │   │   ├── Badge.tsx               # The basic Badge implementation
│   │   │   └── index.ts                # Exports Badge component
│   │   ├── Button/                     # (no changes)
│   │   └── ... other atoms
│   │
│   ├── molecules/                      # Combinations of atoms
│   │   ├── badges/                     # [NEW] Consolidated badge variations
│   │   │   ├── TokenStateBadge.tsx     # [MOVED FROM features/token-management]
│   │   │   ├── TicketBadge.tsx         # [MOVED FROM features/token-management]
│   │   │   ├── StatusBadge.tsx         # [CONSOLIDATED from molecules/StatusBadge]
│   │   │   ├── VersionBadge.tsx        # [CONSOLIDATED from molecules/VersionBadge]
│   │   │   └── index.ts                # [NEW] Exports all badge variations
│   │   ├── ... other molecules
│   │
│   ├── organisms/                      # Complex UI components (no structural changes)
│   │   ├── Header/                     # (no changes)
│   │   ├── Sidebar/                    # (no changes)
│   │   └── ... other organisms
│   │
│   ├── templates/                      # Page layouts (no changes)
│   │   ├── AppLayout/                  # (no changes)
│   │   └── ... other templates
│   │
│   └── features/                       # Domain-specific components
│       ├── token-management/           # Token management feature
│       │   ├── TokenList.tsx           # Lists tokens (unchanged location)
│       │   ├── TicketList.tsx          # Lists tickets (unchanged location)
│       │   ├── TokenDetails.tsx        # (unchanged)
│       │   ├── TokenManagementView.tsx # (unchanged)
│       │   ├── ... other components    # (unchanged)
│       │   └── index.ts                # [UPDATED] Exports all token components (no longer exports badges)
│       ├── analytics/                  # (no changes)
│       └── ... other features
│
├── contexts/                           # React contexts
│   ├── DemoContext.tsx                 # [OPTIMIZED] Demo context with memoized handlers
│   └── ... other contexts
│
├── hooks/                              # Custom hooks
│   ├── useSyncStateWithURL.ts          # [OPTIMIZED] URL sync with safety locks
│   └── ... other hooks
│
├── lib/                                # Utility functions and configurations
│   ├── redux/                          # Redux implementation
│   │   ├── store.ts                    # [OPTIMIZED] Redux store with safe middleware
│   │   ├── slices/                     # Redux slices
│   │   │   ├── demoSlice.ts            # [OPTIMIZED] Demo slice with equality checks
│   │   │   └── ... other slices
│   │   └── hooks.ts                    # Redux hooks
│   └── ... other utilities
│
└── ... other project files
```

## Detailed Migration Workflow

The migration follows an end-to-end process for each component or component group. Each step in the workflow ensures that components are moved properly, updated to use atomic design principles, and integrated seamlessly into the application.

### End-to-End Migration Process

1. **Prepare the Target Directory**

   ```bash
   # Create target directory if it doesn't exist
   mkdir -p components/molecules/badges
   ```

2. **Move Files Using Git**

   ```bash
   # Move files using git mv to preserve git history
   git mv components/features/token-management/TokenStateBadge.tsx components/molecules/badges/
   git mv components/molecules/StatusBadge/StatusBadge.tsx components/molecules/badges/
   ```

3. **Update Component Implementation**

   - Modify the component to use atomic components where applicable
   - Update imports to reference the correct paths
   - Add or update JSDoc comments
   - Define local types if needed instead of importing from feature-specific files

4. **Create/Update Index Files for Exports**

   ```bash
   # Create an index.ts file in the target directory
   # Export both components and types using named exports
   ```

5. **Update Parent Directory Exports**

   ```bash
   # Update the parent directory's index.ts to export from the new location
   ```

6. **Update Imports in Consuming Files**

   - Find all files that import the moved components
   - Update import paths to reference the new location

7. **Clean Up Old Directories**

   ```bash
   # Remove any leftover directories and files after migration
   git rm -r components/molecules/StatusBadge
   ```

8. **Commit Changes**

   ```bash
   # Commit the changes with a descriptive message
   git add components/molecules/badges components/molecules/index.ts
   git add components/features/token-management/TokenList.tsx
   git commit -m "Move badge components to molecules/badges directory and update imports"
   ```

9. **Test**
   - Verify the application works correctly with the migrated components
   - Check for any linting errors or broken references

## Migration Plan

### ✅ Phase 1: Badge Component Organization (COMPLETED)

1. **Create Central Badge Directory**

   - Create `components/molecules/badges`
   - Focus on consolidating all badge variations

2. **Move Badge Components**

   - Move `TokenStateBadge` from features/token-management to molecules/badges
   - Move `TicketBadge` from features/token-management to molecules/badges
   - Move StatusBadge from molecules/StatusBadge to molecules/badges
   - Move VersionBadge from molecules/VersionBadge to molecules/badges

3. **Setup Proper Exports**
   - Create `components/molecules/badges/index.ts` to export all badges
   - Update `components/features/token-management/index.ts` to remove badge exports

### ✅ Phase 2: Card Components Organization (COMPLETED)

1. **Create Cards Directory**

   - Create `components/molecules/cards`
   - Follow lowercase naming convention for consistency

2. **Move Card Components**

   - Move `CampaignCard` from components/dashboard to molecules/cards
   - Move `StatCard` from components/dashboard to molecules/cards
   - Move `TaskCard` from components/dashboard to molecules/cards

3. **Setup Proper Exports**
   - Create `components/molecules/cards/index.ts` to export all card components
   - Update the molecules index.ts to export from cards

### ✅ Phase 3: Chart Components Organization (COMPLETED)

1. **Standardize Chart Directory Structure**

   - Rename `components/molecules/Chart` to `components/molecules/charts`
   - Move chart components from other locations to molecules/charts
   - Remove capitalized `Chart` directory to avoid duplicate directories

2. **Move Chart Components**

   - Move Chart.tsx to BaseChart.tsx in molecules/charts
   - Move CampaignPerformanceChart from dashboard/charts to molecules/charts
   - Add RevenueChart from dashboard/charts to molecules/charts

3. **Setup Proper Exports**
   - Create `components/molecules/charts/index.ts` to export all chart components
   - Update the molecules index.ts to export from charts
   - Update imports in CallVolumeChart.tsx to use the new path

### ✅ Phase 4: Update Dialog Directory Structure (COMPLETED)

1. **Update Dialog Directory Name**
   - Rename `components/molecules/Dialog` to `components/molecules/dialog`
   - Update molecules/index.ts to import from the new path
   - Update imports in TicketModal.tsx to use the new path

### Phase 5: List Component Standardization (IN PROGRESS)

1. **Standardize Props and Interfaces**

   - Keep TokenList and TicketList in their feature folders
   - Ensure they follow consistent patterns and prop structures
   - Document prop types and component behavior

2. **Ensure Proper Exports**
   - Check all feature folders have proper index.ts files
   - Standardize export patterns

### Phase 6: Dashboard Views Organization

1. **Standardize View Structure**

   - Keep views in their current locations
   - Ensure they use components from the atomic hierarchy correctly

2. **Document View Patterns**
   - Add JSDoc comments to view components
   - Establish clear patterns for view composition

### Phase 7: Design System Implementation

1. **Update Tailwind Configuration**

   - Implement Kigo design tokens in tailwind.config.mjs
   - Include colors, typography, spacing, and breakpoints
   - Document the mapping between Kigo tokens and Tailwind classes

2. **Create Core Nav & Header Components**

   - Develop navigation and header components using Tailwind
   - Ensure responsive behavior across all breakpoints
   - Follow Kigo branding guidelines while optimizing for our stack

3. **Document in Storybook**
   - Set up Storybook documentation for design tokens
   - Create stories for core components with usage examples
   - Include responsive behavior demonstrations

### Phase 8: Documentation & Cleanup

1. **Update Component Documentation**

   - Ensure all components have JSDoc comments
   - Document component purpose, props, and usage

2. **Clean Up Any Duplicates**
   - Identify and remove duplicate components
   - Consolidate shared functionality

## Folder Naming Conventions

For consistency, we follow these naming conventions throughout the codebase:

1. **Component Type Directories**: Use lowercase for component type directories

   - `atoms/`, `molecules/`, `organisms/`, `templates/`, `features/`

2. **Component Category Directories**: Use lowercase for component category directories

   - `molecules/badges/`, `molecules/cards/`, `features/campaigns/`

3. **Component Files**: Use PascalCase for component files
   - `Button.tsx`, `CampaignCard.tsx`

## Implementation Guidelines

1. **Preserve Git History**

   - Always use `git mv` instead of manually moving files
   - This preserves file history and makes the codebase more maintainable

2. **Make Small, Focused Changes**

   - Each change should be focused on a specific component or group of related components
   - Make changes incrementally to maintain a working application

3. **Test After Each Change**

   - Verify the application still works after each change
   - Check that imports are correctly resolved

4. **Document Changes**

   - Document changes made to the file structure
   - Update relevant documentation to reflect new organization

5. **Follow Component Patterns**

   - Ensure all components follow the established patterns
   - Document any exceptions or special cases

6. **Maintain Design Consistency**
   - Use Kigo design tokens for visual consistency
   - Follow the established design patterns from the Kigo design system
   - Implement using Tailwind CSS for technical consistency
