# Component Organization Strategy

This document outlines the organization strategy for the Kigo Pro Dashboard components, following a hybrid approach of atomic design principles and feature-based organization.

## Guiding Principles

1. **Atomic Design for UI Components**: Generic UI components follow atomic design (atoms, molecules, organisms, templates)
2. **Feature-Based Organization for Domain Logic**: Domain-specific components are organized by feature
3. **Incremental Migration**: Changes are made incrementally without disrupting the working application
4. **No Structural Overhaul**: Keep working within existing app and components directories

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
├── contexts/                           # (no changes)
├── hooks/                              # (no changes)
├── lib/                                # (no changes)
└── ... other project files
```

## Migration Plan

### Phase 1: Badge Component Organization

1. **Create Central Badge Directory**
   - Create `components/molecules/badges`
   - Focus on consolidating all badge variations

2. **Move Badge Components**
   - Move `TokenStateBadge` from features/token-management to molecules/badges
   - Move `TicketBadge` from features/token-management to molecules/badges
   - Consider consolidating StatusBadge and VersionBadge

3. **Setup Proper Exports**
   - Create `components/molecules/badges/index.ts` to export all badges
   - Update `components/features/token-management/index.ts` to remove badge exports

4. **Update Imports**
   - Update all imports to reference badges from their new location

### Phase 2: List Component Standardization

1. **Standardize Props and Interfaces**
   - Keep TokenList and TicketList in their feature folders
   - Ensure they follow consistent patterns and prop structures
   - Document prop types and component behavior

2. **Ensure Proper Exports**
   - Check all feature folders have proper index.ts files
   - Standardize export patterns

### Phase 3: Dashboard Views Organization

1. **Standardize View Structure**
   - Keep views in their current locations
   - Ensure they use components from the atomic hierarchy correctly

2. **Document View Patterns**
   - Add JSDoc comments to view components
   - Establish clear patterns for view composition

### Phase 4: Documentation & Cleanup

1. **Update Component Documentation**
   - Ensure all components have JSDoc comments
   - Document component purpose, props, and usage

2. **Clean Up Any Duplicates**
   - Identify and remove duplicate components
   - Consolidate shared functionality

## Implementation Guidelines

1. **Make Small, Focused Changes**
   - Each change should be focused on a specific component or group of related components
   - Make changes incrementally to maintain a working application

2. **Test After Each Change**
   - Verify the application still works after each change
   - Check that imports are correctly resolved

3. **Document Changes**
   - Document changes made to the file structure
   - Update relevant documentation to reflect new organization

4. **Follow Component Patterns**
   - Ensure all components follow the established patterns
   - Document any exceptions or special cases 