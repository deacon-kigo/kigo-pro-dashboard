# State Management Migration Guide

## Context to Redux Migration

This document outlines the process for migrating components from using the `DemoContext` (via `useDemo()`) to direct Redux usage. This migration simplifies our state management architecture by removing a layer of indirection.

## Why Migrate?

The `DemoContext` was initially created as a compatibility layer on top of Redux. However, it introduces several issues:

1. Dual state management patterns creating inconsistency
2. "useDemo must be used within a DemoProvider" errors when context isn't available
3. Unnecessary complexity with the same state being managed in multiple places
4. Harder to track state changes and debugging

## Migration Steps

### 1. Replace Hook Imports

```diff
- import { useDemo } from '@/contexts/DemoContext';
+ import { useDemoState, useDemoActions } from '@/lib/redux/hooks';
```

### 2. Replace Hook Usage

**Before:**
```jsx
const { 
  role, 
  clientId, 
  themeMode, 
  updateDemoState, 
  userProfile 
} = useDemo();
```

**After:**
```jsx
// For state
const { 
  role, 
  clientId, 
  themeMode 
} = useDemoState();

// For actions - only import if you need to update state
const { updateDemoState } = useDemoActions();

// For userProfile with proper typing
const mockUserProfile = useDemoState().userProfile;
const userProfile = mockUserProfile 
  ? convertMockUserToUserProfile(mockUserProfile) 
  : undefined;
```

### 3. Fix Type Issues

You may encounter type issues with `userProfile`. If you're using this in a component that expects a `UserProfile` type (from '@/types/demo'), you'll need to convert the MockUser to UserProfile:

```jsx
import { convertMockUserToUserProfile } from '@/lib/userProfileUtils';

// Then in your component:
const mockUserProfile = useDemoState().userProfile;
const userProfile = mockUserProfile 
  ? convertMockUserToUserProfile(mockUserProfile) 
  : undefined;
```

### 4. Testing Your Changes

After making these changes:

1. Verify the component still renders correctly
2. Check that all interactions (state updates) work as before
3. Confirm there are no console errors related to 'useDemo must be used within a DemoProvider'

## Component Migration Checklist

Below is a list of components now migrated from the `useDemo()` hook to Redux:

- [x] UserGreeting.tsx
- [x] DemoSelector.tsx
- [x] DemoSpotlight.tsx
- [x] DashboardView.tsx
- [x] GenericDashboardView.tsx
- [x] DeaconsPizzaView.tsx
- [x] PersonalizedDashboard.tsx
- [x] CVSTokenManagementView.tsx
- [x] TicketModal.tsx
- [x] AIAssistantPanel.tsx
- [x] TokenManagementView.tsx
- [x] DemoSelector (molecules).tsx
- [x] PerformancePredictionDashboard.tsx
- [x] DynamicCanvas.tsx
- [x] AssetCreationWorkshop.tsx
- [x] LaunchControlCenter.tsx
- [x] CampaignSelectionGallery.tsx
- [x] BusinessIntelligenceView.tsx
- [x] StandardDashboard.tsx
- [x] app/page.tsx
- [x] app/demos/cvs-dashboard/page.tsx
- [x] app/demos/cvs-token-catalog/page.tsx
- [x] app/demos/ai-campaign-creation/page.tsx
- [x] app/demos/deacons-pizza/page.tsx
- [x] app/demos/cvs-tickets/page.tsx
- [x] app/demos/cvs-token-management/page.tsx
- [x] app/dashboard/page.tsx

## Migration Completed

All components have been successfully migrated from using the DemoContext to directly using the Redux state management system. The refactoring has:

1. Deleted `DemoContext.tsx` from the codebase 
2. Removed all imports from `@/contexts/DemoContext`
3. Simplified the state architecture by removing an unnecessary layer of indirection
4. Improved type safety by using proper type conversions where needed

Future improvements might include:
- Further optimizing Redux selectors for better performance
- Better organization of Redux slices by feature
- Adding more comprehensive documentation for each Redux slice 