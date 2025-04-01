# Component Migration Tracker

This document tracks the migration of components from the root directory to the `src` directory.

## Migration Status

| Component Type | Component Name | Status | Date Completed | Notes |
|----------------|---------------|--------|----------------|-------|
| **Utility Functions** |  |  |  |  |
| | utils.ts | Not Started |  |  |
| | userProfileUtils.ts | Not Started |  |  |
| **Types** |  |  |  |  |
| | demo.ts | Not Started |  |  |
| | redux.ts | Not Started |  |  |
| **Atomic Components** |  |  |  |  |
| | Button | Not Started |  |  |
| | Badge | Not Started |  |  |
| | Input | Not Started |  |  |
| | Label | Not Started |  |  |
| | Select | Not Started |  |  |
| | Textarea | Not Started |  |  |
| | Card | Not Started |  |  |
| | Tabs | Not Started |  |  |
| **Molecule Components** |  |  |  |  |
| | Chart | Not Started |  |  |
| | Dialog | Not Started |  |  |
| | StatusBadge | Not Started |  |  |
| | VersionBadge | Not Started |  |  |
| **Organism Components** |  |  |  |  |
| | AIAssistant | Not Started |  |  |
| | AIChat | Not Started |  |  |
| | Header | Not Started |  |  |
| | Sidebar | Not Started |  |  |
| **Template Components** |  |  |  |  |
| | AppLayout | Not Started |  |  |
| | StandardDashboard | Not Started |  |  |

## Migration Process

For each component:

1. ✅ Identify all imports using `grep -r "from '@/components/<path>'" --include="*.tsx" --include="*.ts" .`
2. ✅ Update imports to use `@/src/components/<path>`
3. ✅ Test the application to ensure it works
4. ✅ Mark as "Completed" in this document
5. ✅ Once all components have been migrated, remove original files

## Notes

- Start with utilities and atomic components first
- Keep both copies during migration to avoid breaking the app
- Use `git commit` after each component is successfully migrated 