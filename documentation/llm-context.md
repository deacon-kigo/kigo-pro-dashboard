# Kigo Pro Dashboard Project Context

## Project Overview

The Kigo Pro Dashboard is a Next.js application serving as a UI component prototype environment for the Kigo ecosystem. It's part of a larger project structure:

1. **Kigo Web SDKs**: Design system repository with design tokens and styling guidelines
2. **Kigo Pro Dashboard** (current repository): UI component prototype/design canvas
3. **Kigo Admin Tools**: Production repository that integrates components from this prototype

## Current Project State (April 2, 2025)

### Repository Structure

The repository is currently undergoing a migration from a flat directory structure to a standard `/src` directory structure:

- **Original Structure**: Components directly in the root `/components` directory
- **Target Structure**: Components organized within `/src/components`
- **Branch**: Working in `src-migration` branch dedicated to this refactoring

### Migration Status

1. **Components**:
   - Several atomic components migrated to `/src/components/atoms` (Button, Input, Card, etc.)
   - Dashboard components remain in original `/components/dashboard` directory
   - UI data display components recently created in `/components/ui/data-display`

2. **Storybook Integration**:
   - Configuration supports both original and new directory structures
   - Stories temporarily duplicated to avoid ID conflicts
   - Some components have basic stories in the `/src` structure

3. **Dashboard Components**:
   - Recent work focused on creating data visualization components:
     - StatCard: Simple statistics cards with change indicators
     - CircularProgress: Circular progress component with customization
     - GradientCard: Cards with gradient backgrounds
     - StatisticsCard: Advanced statistics cards with sparkline charts

### Current Focus Areas

1. **Directory Structure Migration**:
   - Moving components to the `/src` structure following atomic design principles
   - Ensuring backward compatibility during transition

2. **Storybook Enhancement**:
   - Improving component isolation from external dependencies
   - Creating presentation-only versions of stateful components
   - Adding comprehensive documentation and examples

3. **Component Development**:
   - Building visually appealing dashboard components
   - Ensuring components work in isolation
   - Implementing best practices for reusability

### Immediate Next Steps

1. Complete migration of remaining components to `/src` structure
2. Fix Storybook configuration issues
3. Update documentation to reflect new structure
4. Configure CI/CD pipeline with Vercel
5. Continue development of dashboard components

## Repository Organization

```
.
├── .storybook          # Storybook configuration
├── components          # Original component directory (being migrated)
│   ├── atoms           # Basic UI elements
│   ├── molecules       # Composite components
│   ├── organisms       # Complex UI sections
│   ├── dashboard       # Dashboard-specific components
│   └── ui              # UI component library
├── documentation       # Project documentation
├── public              # Static assets
└── src                 # New directory structure (migration target)
    ├── app             # Next.js App Router
    ├── components      # UI Components (Atomic Design)
    │    ├── atoms      # Basic building blocks
    │    ├── molecules  # Simple combinations of atoms
    │    ├── organisms  # Complex UI sections
    │    └── templates  # Page layouts
    ├── contexts        # React contexts
    ├── hooks           # Custom React hooks
    └── utils           # Utility functions
```

## Technical Stack

- **Framework**: Next.js 15.x with React 19
- **Styling**: Tailwind CSS 
- **State Management**: Redux & Context API
- **Component Documentation**: Storybook 8.x
- **Type Safety**: TypeScript

## Development Workflow

The current development workflow follows these steps:
1. Create components in the prototype repository (Kigo Pro Dashboard)
2. Document and showcase in Storybook
3. Test in various scenarios with mock data
4. Extract and implement in the production repository (Kigo Admin Tools)

## Project Relationships & Purposes

### 1. Kigo Pro Dashboard (Prototype Repository)
- **Current Focus**: This is the repository we're actively working in
- **Purpose**: 
  - Demo environment for showcasing capabilities
  - Design canvas for UI experimentation
  - UI component library/source of truth
  - Reference implementation
- **Target Users**: Internal teams, design reviewers, and product stakeholders
- **Code Philosophy**:
  - Components should be highly composable
  - Built using atomic design principles (atoms, molecules, organisms, templates)
  - Well-documented
  - Easily extractable for use in the production repository
- **Current Status**: 
  - Migration to `/src` directory structure is complete
  - Enhanced with comprehensive Storybook integration
  - Added several dashboard visualization components

### 2. Kigo Admin Tools (Production Repository)
- **Purpose**: 
  - Production-ready implementation of the Kigo Pro software
  - Final destination for battle-tested components from the prototype
- **Target Users**: External customers, actual end users
- **Relationship to Prototype**:
  - Receives refined components from the prototype repository
  - Developers will "pull" components from the prototype for production use
  - Should implement optimized, production-ready versions of prototype components

### 3. Kigo Web SDKs (Design System Repository)
- **Purpose**:
  - Houses the design system and brand guidelines
  - Contains core design tokens, colors, spacing rules, etc.
- **Future Plan**: 
  - The design system will be incorporated into the prototype app
  - Will ensure consistent design application across all Kigo products

## Development Workflow

1. **Design System Definition** (Kigo Web SDKs)
   - Define brand elements, design tokens, and core styles

2. **Component Prototyping** (Kigo Pro Dashboard)
   - Create and refine components using the design system
   - Test in various demo scenarios
   - Document usage patterns and composition strategies

3. **Production Implementation** (Kigo Admin Tools)
   - Front-end developers extract components from the prototype
   - Implement in the production environment with necessary adaptations
   - Optimize for performance and real-world use cases

## Component Philosophy

All UI components should be:

1. **Composable** - Can be combined with other components in various configurations
2. **Extensible** - Easy to extend with additional functionality
3. **Reusable** - Designed for multiple use cases
4. **Documented** - Clear usage examples and guidelines
5. **Consistent** - Follow established design patterns
6. **Accessible** - Meet WCAG guidelines
7. **Performant** - Optimized for speed and efficiency

## Key Implementation Patterns

### Presentation-Container Pattern
For complex components with external dependencies, we separate presentation from container components:

```tsx
// Container component with external dependencies
const Sidebar = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { sidebarCollapsed } = useAppSelector(state => state.ui);
  
  // Business logic
  
  return <PresentationalSidebar {...props} />;
}

// Presentation component with no external dependencies
export const PresentationalSidebar = (props: SidebarProps) => {
  // Pure rendering logic
  return <aside>...</aside>;
};
```

### Defensive Coding
We use defensive coding patterns to handle potential null or undefined values:

```tsx
// Safely access nested properties
const userName = user?.profile?.name || 'Unknown User';

// Default values for potentially undefined props
function Component({ items = [] }) {
  // Now safe to use items.map() without checking if items exists
}

// Optional chaining for function calls
onClick?.();
```

## Recently Added Components

1. **StatCard**: Statistics cards with configurable icons and change indicators
2. **CircularProgress**: Customizable circular progress component
3. **GradientCard**: Eye-catching gradient cards for key metrics
4. **StatisticsCard**: Advanced statistics cards with integrated sparkline charts

## Technology Stack

- **Frontend Framework**: Next.js
- **Styling**: Tailwind CSS with custom configuration
- **Component Structure**: Atomic Design Methodology
- **State Management**: Redux for global state, Context API for component trees
- **TypeScript**: For type safety and better developer experience
- **Storybook**: For component documentation and visual testing

## Documentation Structure

For comprehensive documentation, refer to `documentation/kigo-pro-dashboard-docs.md`, which serves as the single source of truth for human-facing documentation. This LLM context file is optimized specifically for AI assistants to quickly understand the project context.

## Current Development Priorities

1. Enhancing the dashboard component library with additional visualizations
2. Optimizing Storybook presentation and documentation
3. Ensuring code quality and maintainability
4. Preparing components for extraction to the production repository

This document serves as a quick reference for LLM assistants to understand the context and purpose of the Kigo projects when starting new chat sessions in Cursor. 