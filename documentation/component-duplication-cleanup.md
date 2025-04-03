# Component Duplication Cleanup Plan

This document outlines the strategy for cleaning up component duplication in the Kigo Pro Dashboard codebase and standardizing on the atomic design structure.

## Current Issues

1. **Component Duplication**: Multiple implementations of the same components exist in different folders
   - `components/ui/button.tsx` (flat file in ui directory)
   - `components/atoms/Button/Button.tsx` (atomic design structure)
   - `components/shared/Button.tsx` (older implementation with different API)

2. **Inconsistent Import Patterns**: Components are imported from different locations
   - Some use `@/components/ui/...` 
   - Some use `@/components/atoms/...`
   - Some use relative imports from `../shared/...`

3. **Export Inconsistencies**: Components are exported in different ways
   - Some components use default exports
   - Some use named exports
   - Some index files re-export properly, others don't

## Standardization Goals

1. **Atomic Design as Single Source of Truth**: Standardize on the atomic design folder structure
   - `components/atoms/` for basic building blocks
   - `components/molecules/` for combinations of atoms
   - `components/organisms/` for complex UI sections
   - `components/templates/` for page layouts

2. **Consistent Export Pattern**: Standardize component exports
   - Components should use a consistent export pattern (either default or named)
   - Index files should properly re-export components
   - Typescript types should be exported alongside components

3. **Import Path Standardization**: Standardize import paths
   - Direct imports (e.g., `@/components/atoms/Button`) should work
   - Barrel imports (e.g., `@/components/atoms`) should also work

## Migration Plan

### Phase 1: Fix Component Exports and Re-exports

1. **Audit Component Exports**
   - Review all components in atoms/, molecules/, and organisms/
   - Ensure consistent export pattern (default or named)
   - Fix index.ts files to properly re-export components

2. **Document Component APIs**
   - Add JSDoc comments to all components
   - Clearly document props and behavior

### Phase 2: Incremental Migration by Component Type

1. **Button Components**
   - Audit all Button implementations (`ui/button.tsx`, `atoms/Button/Button.tsx`, `shared/Button.tsx`)
   - Standardize on `atoms/Button/Button.tsx` implementation
   - Update all imports to use the atomic design path
   - Add deprecated warnings to other implementations

2. **Card Components**
   - Audit all Card implementations
   - Standardize on `atoms/Card/Card.tsx` implementation
   - Update all imports to use the atomic design path
   - Add deprecated warnings to other implementations

3. **Continue with other component types**
   - Input, Select, Badge, etc.

### Phase 3: Feature Components Migration

1. **Update Feature Component Imports**
   - Identify all components in the features/ directory
   - Update imports to use the atomic design structure
   - Test components after updates

### Phase 4: Cleanup and Documentation

1. **Remove Duplicated Components**
   - After all imports are updated, remove duplicated components
   - Only remove components after confirming they are no longer referenced

2. **Update Documentation**
   - Update README.md with clear guidelines for component usage
   - Create Storybook documentation for all atomic components

## Implementation Guidelines

1. **One Component Type at a Time**: Focus on one component type at a time
   - Start with Button, then Card, then others
   - This minimizes the risk of breaking the application

2. **Testing After Each Change**: Test the application after each change
   - Ensure components render correctly
   - Verify interactions work as expected

3. **Commit Frequently**: Make small, focused commits
   - Each commit should address one specific component or issue
   - This makes it easier to revert changes if necessary

4. **Use Feature Flags If Necessary**: For significant changes, consider using feature flags
   - This allows for gradual rollout and easier rollback

5. **Document All Changes**: Keep documentation up-to-date
   - Update this document as migration progresses
   - Note any special cases or exceptions 