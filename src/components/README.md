# Components Directory

This directory contains all UI components for the Kigo Pro Dashboard, organized according to atomic design principles.

## Atomic Design Structure

Components are organized into a hierarchy based on their complexity and purpose:

### atoms/

Atoms are the basic building blocks of the interface:

- Button
- Input
- Label
- Badge
- Card
- Typography elements

These components are the smallest possible units and generally don't depend on other components.

### molecules/

Molecules are combinations of atoms that form more complex, functional units:

- Dialog
- Chart
- StatusBadge
- VersionBadge

### organisms/

Organisms are relatively complex components composed of molecules and/or atoms:

- Header
- Sidebar
- AIChat
- AIAssistant

### templates/

Templates are page-level structures that define layouts:

- StandardDashboard
- AppLayout

### shared/

Shared utilities used across components:

- providers: React context providers
- hoc: Higher-order components
- context: Component-specific contexts

## Component Structure

Each component follows a consistent structure:

```
/ComponentName/
  index.ts                  # Exports the component
  ComponentName.tsx         # The component implementation
  ComponentName.stories.tsx # Storybook documentation (when implemented)
  ComponentName.test.tsx    # Component tests (when applicable)
```

## Adding New Components

When adding a new component:

1. Determine which category it belongs to (atom, molecule, organism, or template)
2. Create a new directory in the appropriate category
3. Follow the component structure outlined above
4. Export the component from the category's index.ts file
5. Add Storybook documentation when appropriate 