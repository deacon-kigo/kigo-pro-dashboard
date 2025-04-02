# Kigo Project Context For LLM Assistants

## Repository Overview

This repository (`/Users/dpoon/Documents/Kigo/Repo`) contains three distinct but related projects:

1. **Kigo Admin Tools** - Production repository for the Kigo Pro software
2. **Kigo Pro Dashboard** - A prototype/demo environment that will be renamed to "Kigo Admin Tool Prototype"
3. **Kigo Web SDKs** - Contains the design system with brand colors and styling guidelines

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