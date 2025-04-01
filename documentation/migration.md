# Component Migration Plan

## Project Context

### Background
The Kigo Pro Dashboard was initially built with a flat directory structure where components, utilities, and other code resided directly at the root level of the project. This approach has become problematic as the project has grown, making it harder to manage, understand, and maintain the codebase.

### Current State
Currently, we have code in two locations:
1. **Original location**: Components and utilities at the root level (e.g., `/components`, `/lib`, `/contexts`)
2. **Target location**: The same components and utilities in the `/src` directory (e.g., `/src/components`, `/src/lib`, `/src/contexts`)

All import statements currently reference the original location using the path alias `@/components/*` (and similar for other directories). The application is functional with this setup, with identical component files existing in both locations.

### Migration Goal
The goal is to move all code into the `/src` directory and update all import statements to reference the new locations. This is a standard structure for Next.js applications that improves:
- Code organization
- Development experience
- Maintainability
- Alignment with industry standards

### Technical Approach
We're taking a component-by-component migration approach rather than using symbolic links or other automated methods. This ensures:
1. Better control over the migration process
2. Reduced risk of breaking the application
3. Ability to test each change incrementally
4. Clearer documentation of what has been migrated

### Path Alias Configuration
We've updated the TypeScript configuration to support both original and new import paths during migration:
```json
"paths": {
  "@/*": [
    "./*"
  ],
  "@/src/*": [
    "./src/*"
  ]
}
```
This allows imports to work from both locations while we transition, preventing application breakage.

### Branch Strategy
All migration work is being done in a dedicated `src-migration` branch, which will be merged back to `main` once the migration is complete.

## Migration Process

For each component:

1. Identify imports using `grep -r "from '@/components/<path>'" --include="*.tsx" --include="*.ts" .`
2. Update imports to use `@/src/components/<path>`
3. Test the application
4. Commit changes

## Migration Checklist

### Utilities
- [ ] utils.ts
- [ ] userProfileUtils.ts
- [ ] redux hooks
- [ ] URL utils

### Types
- [ ] demo.ts
- [ ] redux.ts

### Atomic Components
- [ ] Button
- [ ] Badge
- [ ] Input
- [ ] Label
- [ ] Select
- [ ] Textarea
- [ ] Card
- [ ] Tabs

### Molecule Components
- [ ] Chart
- [ ] Dialog
- [ ] StatusBadge
- [ ] VersionBadge

### Organism Components
- [ ] AIAssistant
- [ ] AIChat
- [ ] Header
- [ ] Sidebar

### Template Components
- [ ] AppLayout
- [ ] StandardDashboard

## Migration Order Rationale
We're starting with utilities and atomic components first because:
1. They have fewer dependencies on other components
2. Many other components depend on them
3. They're typically smaller and easier to migrate
4. This creates a foundation for migrating more complex components

## Potential Challenges
- Import statements in dynamic contexts (like string templates or `require` calls)
- Files with many dependencies that might get missed
- Integration with third-party libraries or tools expecting certain file structures
- Ensuring the build process continues to work throughout migration

## Final Steps
Once all components are migrated:
1. Update tsconfig.json to remove support for the old path structure
2. Remove original component files from the root directories
3. Update project documentation to reflect the new structure
4. Run comprehensive tests to ensure everything works correctly

## Notes

* Start with utilities and atomic components first
* Keep both copies during migration to avoid breaking the app
* Commit after each component is successfully migrated
* Final cleanup: remove original files after all imports are updated 