# Component Migration Plan

This document outlines the plan for migrating components from the root directory to the `src` directory.

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

## Notes

* Start with utilities and atomic components first
* Keep both copies during migration to avoid breaking the app
* Commit after each component is successfully migrated
* Final cleanup: remove original files after all imports are updated 