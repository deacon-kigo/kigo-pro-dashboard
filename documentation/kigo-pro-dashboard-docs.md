# Kigo Pro Dashboard Documentation

## Table of Contents

1. [Project Overview](#project-overview)
   - [Repository Structure](#repository-structure)
   - [Technology Stack](#technology-stack)
   - [Development Workflow](#development-workflow)
2. [Design & Architecture](#design--architecture)
   - [Atomic Design Methodology](#atomic-design-methodology)
   - [Component Architecture](#component-architecture)
   - [State Management](#state-management)
   - [Styling Approach](#styling-approach)
3. [Components](#components)
   - [Core UI Components](#core-ui-components)
   - [Data Display Components](#data-display-components)
   - [Navigation Components](#navigation-components)
4. [Development Standards](#development-standards)
   - [Code Organization](#code-organization)
   - [Naming Conventions](#naming-conventions)
   - [Best Practices](#best-practices)
   - [Error Handling](#error-handling)
5. [Testing Strategy](#testing-strategy)
6. [Performance Optimization](#performance-optimization)
7. [Storybook Development](#storybook-development)
8. [Project Timeline & Changelog](#project-timeline--changelog)
9. [Future Plans](#future-plans)

---

## Project Overview

### Repository Structure

The Kigo Pro Dashboard repository (`/Users/dpoon/Documents/Kigo/Repo/kigo-pro-dashboard`) is a prototype/demo environment that showcases UI components and dashboard features for the Kigo Pro software. It serves as a design canvas for UI experimentation and a reference implementation for the production repository.

The repository is currently undergoing a migration to a standard `/src` directory structure. During this transition, components exist in both the original and new locations to maintain functionality.

```
.
├── adr                 # Architectural Decision Records
├── components          # Original component directory (being migrated)
├── diagrams            # Visual diagrams of the system
├── documentation       # Project documentation
│   └── business-context  # User personas and business documentation
├── public              # Static assets
├── src                 # Source code (target of migration)
│   ├── app             # Next.js App Router
│   ├── core            # Core application infrastructure
│   │    ├── components # UI Components (Atomic Design)
│   │    │    ├── atoms      # Basic building blocks
│   │    │    ├── molecules  # Simple combinations of atoms
│   │    │    ├── organisms  # Complex UI sections
│   │    ├── hooks      # Shared hooks
│   │    ├── utils      # Shared utilities
│   │    ├── contexts   # Global contexts
│   ├── domains         # Domain-driven organization
│   │    ├── campaigns  # Campaign management domain
│   │    │    ├── components # Domain-specific components
│   │    │    ├── hooks      # Domain-specific hooks
│   │    │    ├── services   # Domain-specific services
│   │    │    ├── views      # Domain-specific views
│   │    ├── tokens     # Token management domain
│   │    │    ├── components # Domain-specific components
│   │    │    ├── hooks      # Domain-specific hooks
│   │    │    ├── services   # Domain-specific services
│   │    │    ├── views      # Domain-specific views
│   ├── layouts         # Page layouts
│   │    ├── dashboard  # Dashboard layouts
│   │    │    ├── variants   # Role-specific dashboard variants
│   │    ├── auth       # Authentication layouts
│   ├── demo            # Demo configurations and sample data
│   │    ├── merchants  # Merchant demo data
│   │    │    ├── deacons-pizza  # Deacon's Pizza sample data
│   │    ├── support    # Support agent demo data
│   ├── pages           # Next.js pages
│   ├── config          # Configuration
│   ├── constants       # Constants and enums
└── tooling             # Developer tooling configuration
```

### Technology Stack

- **Frontend Framework**: Next.js
- **Styling**: Tailwind CSS with custom configuration
- **Component Structure**: Domain-Driven Design with Atomic Components
- **State Management**: Redux for global state, Context API for component trees
- **TypeScript**: For type safety and better developer experience
- **Storybook**: For component documentation and visual testing

### Development Workflow

The Kigo Pro Dashboard is part of a larger ecosystem:

1. **Kigo Web SDKs (Design System Repository)**
   - Houses design tokens, colors, and styling guidelines

2. **Kigo Pro Dashboard (Current Repository - Prototype)**
   - UI component library/source of truth
   - Reference implementation and demo environment

3. **Kigo Admin Tools (Production Repository)**
   - Production-ready implementation
   - Receives refined components from the prototype

The development workflow follows these steps:
1. Create and refine components in the prototype
2. Test in various demo scenarios
3. Document usage patterns
4. Extract and implement in the production environment

---

## Design & Architecture

### Atomic Design Methodology

We have evolved our architecture to combine atomic design principles with domain-driven design:

- **Core Components**: Pure, domain-agnostic UI components using atomic design principles:
  - **Atoms**: Basic building blocks (buttons, inputs, icons, badges)
  - **Molecules**: Simple combinations of atoms (search bars, form fields, status badges)
  - **Organisms**: Complex combinations of molecules (lists, data tables, panels)

- **Domain-Specific Components**: Components that are specific to a business domain:
  - Each domain contains its own components, hooks, services, and views
  - Domain components leverage core atomic components for UI

- **Layouts**: Page structures that are customizable by role:
  - Provide consistent layout patterns across the application
  - Support role-specific variants

Our new architecture follows a **Domain-Driven Design with Atomic Core** approach:

```
/src
  /core            # Domain-agnostic core components and utilities
    /components    # Atomic design components (atoms, molecules, organisms)
    /hooks         # Shared hooks
    /utils         # Shared utilities
    /contexts      # Global contexts
  /domains         # Domain-specific code organized by business domain
    /campaigns     # Campaign management domain
      /components  # Domain-specific components
      /hooks       # Domain-specific hooks
      /services    # Domain-specific services
      /views       # Domain-specific views
    /tokens        # Token management domain
  /layouts         # Page layout components
    /dashboard     # Dashboard layouts
      /variants    # Role-specific dashboard variants
  /demo            # Demo configurations and sample data
    /merchants     # Merchant demo data
    /support       # Support demo data
  /pages           # Next.js pages - thin composition layer
```

This architecture emphasizes:
1. **Domain Separation**: Clear boundaries between business domains
2. **Reusable Core**: Domain-agnostic components following atomic design
3. **Thin Composition Layer**: Pages simply compose domain views with layouts
4. **Role-Specific Customization**: Layout variants for different user roles
5. **Prop-Based Demo Implementation**: Clean separation of demo data

### Component Metadata

Each component uses standardized JSDoc metadata for documentation and categorization:

```typescript
/**
 * @component ComponentName
 * @classification atom|molecule|organism|template
 * @pattern data-display|data-entry|navigation|feedback|status-display
 * @usage demo|production|both
 * @description Component purpose and functionality
 */
```

This metadata approach enables:
- Clear documentation of component purpose
- Indication of whether components are for demo, production, or both
- Categorization by UI pattern rather than business domain
- Better searchability in code editors
- Future integration with automated documentation tools

### Component Architecture

All components accept their data via props and don't have hard dependencies on contexts or global state. This approach enables:

- **Testability**: Components can be tested in isolation
- **Reusability**: Components can be used in different contexts
- **Demo Flexibility**: Demo implementations can pass sample data as props without special "demo modes"

This props-based approach keeps components pure and easy to compose:

```tsx
// Example of a pure component accepting all data via props
function CampaignDashboard({ campaigns, onCreateCampaign, onEditCampaign }) {
  return (
    <div>
      <Button onClick={onCreateCampaign}>Create Campaign</Button>
      <Table 
        data={campaigns}
        onRowClick={onEditCampaign}
      />
    </div>
  );
}

// Usage with real data
function CampaignsPage() {
  const { campaigns, createCampaign, editCampaign } = useCampaigns();
  
  return (
    <DashboardLayout>
      <CampaignDashboard 
        campaigns={campaigns}
        onCreateCampaign={createCampaign}
        onEditCampaign={editCampaign}
      />
    </DashboardLayout>
  );
}

// Usage with demo data
function DemoCampaignsPage() {
  return (
    <MerchantDashboard clientName="Deacon's Pizza">
      <CampaignDashboard 
        campaigns={deaconsPizzaData.campaigns}
        onCreateCampaign={() => console.log('Creating campaign for demo')}
        onEditCampaign={(id) => console.log('Editing campaign', id)}
      />
    </MerchantDashboard>
  );
}
```

### State Management

#### Redux for Global State

Global application state is managed using Redux with Redux Toolkit:

- **Slices**: State is organized into logical slices
- **Selectors**: Memoized selectors for derived state
- **Thunks**: For asynchronous operations
- **Middleware**: For side effects like API calls or logging

```tsx
// Example slice
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarCollapsed: false,
    theme: 'light',
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});
```

#### React Context for Component Trees

For state that only affects a specific component tree, we use React Context:

```tsx
// Create context
const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// Provider component
export const DashboardProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <DashboardContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </DashboardContext.Provider>
  );
};

// Custom hook for consuming the context
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
```

#### Local Component State

For component-specific state that doesn't need to be shared, we use React's useState and useReducer hooks:

```tsx
const [isOpen, setIsOpen] = useState(false);
```

#### State Management Decision Tree

1. Is the state specific to a single component? → Local state
2. Is the state shared across a component tree? → Context
3. Is the state application-wide? → Redux

### Styling Approach

#### Tailwind CSS

We use Tailwind CSS for styling components:

```tsx
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
  Click me
</button>
```

#### Consistent Styling Patterns

- Use CSS variables for theme values
- Use Tailwind's `@apply` for reusable styles
- Create utility classes for common patterns

#### Component-Specific Styling

For component-specific styles, we use CSS modules or styled components.

#### Responsive Design

All components are designed to be responsive using Tailwind's breakpoint system:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Grid items */}
</div>
```

---

## Components

### Core UI Components

| Component | Description |
|-----------|-------------|
| Sidebar | Navigation sidebar with various states (collapsed, expanded) and role-based variations |
| Header | Application header with search, notifications, and user menu |
| Button | Core button component with variants (primary, secondary, outline, text) |
| Input | Text input fields with validation |
| Modal | Dialog component for modals |
| Badge | Display status indicators and labels |

### Badge Components (Molecules)

#### TokenStateBadge

**Purpose**: Displays a badge representing the state of a token with appropriate colors.

**Usage Example**:

```tsx
<TokenStateBadge state="Active" />
<TokenStateBadge state="Shared" />
<TokenStateBadge state="Used" />
<TokenStateBadge state="Expired" />
```

#### TicketBadge

**Purpose**: Displays badges for ticket status and support tier with appropriate colors.

**Usage Example**:

```tsx
<TicketBadge status="Open" />
<TicketBadge status="In Progress" />
<TierBadge tier="Tier1" />
<TierBadge tier="Tier2" />
```

### List Components (Organisms)

#### TokenList

**Purpose**: Displays a filterable and searchable list of tokens with selection capability.

**Usage Example**:

```tsx
<TokenList 
  tokens={tokens}
  onSelectToken={(token) => setSelectedToken(token)}
  selectedTokenId="TKN-1001"
/>
```

#### TicketList

**Purpose**: Displays a filterable and searchable list of support tickets with selection capability.

**Usage Example**:

```tsx
<TicketList
  tickets={tickets}
  onSelectTicket={(ticket) => setSelectedTicket(ticket)}
  selectedTicketId="TCKT-1001"
/>
```

### Data Display Components

#### StatCard

**Purpose**: Display statistics with an icon, title, value, and optional change indicator.

**Usage Example**:

```tsx
<StatCard
  title="Total Revenue"
  value="$42,389"
  change={12.5}
  iconBg="bg-green-100"
  iconColor="text-green-600"
  icon={<CurrencyDollarIcon className="w-6 h-6" />}
/>
```

#### CircularProgress

**Purpose**: Provides a circular progress indicator with customizable styling.

**Usage Example**:

```tsx
<CircularProgress 
  value={75} 
  color="#3B82F6"
  trackColor="#DBEAFE"
  label="75%" 
  size={100}
  description="Project Status"
/>
```

#### GradientCard

**Purpose**: Display statistics with eye-catching gradient backgrounds.

**Usage Example**:

```tsx
<GradientCard
  title="Total Revenue"
  value="$48,352"
  description="Monthly revenue"
  change={12.5}
  gradient="linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)"
  icon={<CurrencyDollarIcon className="w-6 h-6 text-white" />}
/>
```

#### StatisticsCard

**Purpose**: Display statistics with integrated sparkline charts to show trends.

**Usage Example**:

```tsx
<StatisticsCard
  title="Total Revenue"
  value="$12,346"
  change={12.5}
  subtitle="Compared to last month"
  color="green"
  data={[12, 15, 18, 16, 19, 22, 25, 23, 28, 32]}
  icon={<CurrencyDollarIcon className="w-6 h-6" />}
/>
```

### Navigation Components

#### Sidebar

**Key Features**:
- Collapsible/expandable navigation with animation
- Role-based navigation items
- Support for nested navigation
- Client/context-specific theming

---

## Development Standards

### Code Organization

#### Directory Structure

```
src/
  ├── components/        # UI components organized by atomic design
  │   ├── atoms/         # Basic building blocks
  │   ├── molecules/     # Simple combinations of atoms
  │   ├── organisms/     # Complex combinations of molecules
  │   └── templates/     # Page layouts
  ├── hooks/             # Custom React hooks
  ├── views/             # Domain-specific views
  ├── pages/             # Next.js pages
  ├── store/             # Redux store configuration and slices
  ├── lib/               # Utility functions and libraries
  ├── api/               # API client and endpoints
  ├── types/             # TypeScript type definitions
  ├── constants/         # Application constants
  ├── styles/            # Global styles
  └── config/            # Application configuration
```

#### Path Aliases

Path aliases for cleaner imports:

```ts
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/src/*": ["./src/*"],
      "@/components/*": ["./src/components/*"], // Temporary alias for migration
      "@/hooks/*": ["src/hooks/*"],
      "@/store/*": ["src/store/*"],
      "@/lib/*": ["src/lib/*"],
      "@/api/*": ["src/api/*"],
      "@/types/*": ["src/types/*"],
      "@/constants/*": ["src/constants/*"],
      "@/styles/*": ["src/styles/*"],
      "@/config/*": ["src/config/*"]
    }
  }
}
```

#### Import Order

Consistent import order:

1. React and third-party libraries
2. Components
3. Hooks
4. State management 
5. Utils and helpers
6. Types
7. Styles

### Naming Conventions

- Use `.tsx` extension for React components.
- Use **camelCase** for variables and functions names.
- Use **PascalCase** for React components and camelCase for their instances.
- Use **UPPER_SNAKE_CASE** for constants and enum values.

### Best Practices

1. **Component Props**: Always define a clear interface for component props.
2. **Defensive Coding**: Handle potential null/undefined values from hooks and contexts.
3. **Presentation-Only Components**: Create versions that don't depend on external state or hooks.
4. **Consistent Styling**: Use Tailwind classes consistently with the design system.
5. **Accessibility**: Ensure components are accessible (proper ARIA attributes, keyboard navigation).
6. **Performance**: Optimize rendering with proper React patterns (memoization, virtualization).
7. **Write Functional components** instead of Class-based components.
8. Use **hooks** when applicable.
9. Do not use magic numbers and strings. Use variables and enums instead.
10. Use absolute path imports.

### Error Handling

#### Component Error Boundaries

Error boundaries to prevent entire application crashes:

```tsx
<ErrorBoundary fallback={<ErrorFallback />}>
  <ComponentThatMightError />
</ErrorBoundary>
```

#### API Error Handling

Consistent error handling for API calls:

```tsx
try {
  const data = await api.fetchData();
  return { data };
} catch (error) {
  // Log error to monitoring service
  logger.error(error);
  
  // Return structured error
  return {
    error: {
      message: error.message || 'An unknown error occurred',
      code: error.code || 'UNKNOWN_ERROR',
      status: error.status || 500,
    }
  };
}
```

#### Defensive Coding

Defensive coding patterns to handle potential null or undefined values:

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

---

## Testing Strategy

### Unit Testing

All components have unit tests using React Testing Library:

```tsx
test('Button renders correctly', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

test('Button calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  fireEvent.click(screen.getByText('Click me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Integration Testing

Integration tests verify that components work together correctly:

```tsx
test('Sidebar navigation works correctly', () => {
  render(
    <Provider store={store}>
      <Sidebar />
    </Provider>
  );
  
  fireEvent.click(screen.getByText('Dashboard'));
  expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
});
```

### Visual Testing

Storybook is used for visual testing and component documentation.

---

## Performance Optimization

### Memoization

Components that render frequently are memoized:

```tsx
const MemoizedComponent = React.memo(Component);
```

### Code Splitting

Code splitting is implemented using Next.js's dynamic imports:

```tsx
const DynamicDashboard = dynamic(() => import('@/components/Dashboard'), {
  loading: () => <LoadingSkeleton />,
});
```

### Virtualization

For large lists, we use virtualization libraries:

```tsx
<VirtualizedList
  height={500}
  itemCount={items.length}
  itemSize={50}
  renderItem={({ index }) => <ListItem data={items[index]} />}
/>
```

### Performance Guidelines

1. Avoid unnecessary re-renders
2. Use lazy loading for non-critical components
3. Implement pagination for large data sets
4. Use memoization for expensive calculations
5. Apply code splitting for large bundles

---

## Storybook Development

### Key Principles

1. **Presentation-Only Components**: All Storybook components are decoupled from external dependencies (Redux, Next.js, etc.)
2. **Visual Documentation**: Components demonstrate various states and configurations
3. **Interactive Controls**: Components have appropriate controls for manipulating their appearance
4. **Responsive Design**: Components showcase mobile, tablet, and desktop variations where applicable
5. **Accessibility**: Components adhere to accessibility standards
6. **Isolation**: Components are designed to work without external state or contexts

### Component Story Structure

We use a consistent pattern for our Storybook stories:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import MyComponent from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
  title: 'Category/MyComponent',
  parameters: {
    docs: {
      description: {
        component: 'Description of the component'
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Control definitions
  }
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

// Individual stories
export const Default: Story = {
  args: {
    // Component props
  },
};

// Grid view story example
export const ComponentGrid: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <MyComponent prop1="value1" />
      <MyComponent prop1="value2" />
    </div>
  ),
};
```

### Storybook Configuration

The Storybook configuration in `.storybook/main.js` is set up to:

1. Look for stories in both the root directory and the `/src` directory during migration
2. Provide essential addons for documentation, interactions, and links
3. Configure the Next.js framework integration
4. Enable story store V7 and building of stories.json for better performance

```js
const config = {
  stories: [
    '../components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../components/**/*.mdx'
    // Temporarily commenting out src paths to avoid duplicate story IDs
    // '../src/**/*.mdx',
    // '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {
      fastRefresh: true,
      strictMode: false
    },
  },
  features: {
    storyStoreV7: true,
    buildStoriesJson: true
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: ['../public'],
};
```

### Mock Providers for Context Dependency

For components that depend on context providers, we've implemented mock providers in `.storybook/preview.js`:

```jsx
// Create a mock provider context for stories
export const MockDemoContext = React.createContext({
  role: 'merchant',
  clientId: 'deacons',
  clientName: 'Deacon\'s Pizza',
  userProfile: {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    title: 'Store Manager',
    email: 'john@example.com',
  },
  themeMode: 'light',
  version: 'current',
});

// Create a decorator that provides these contexts to all stories
const withMockProviders = (Story) => (
  <MockDemoContext.Provider value={{...}}>
    <Story />
  </MockDemoContext.Provider>
);

// Apply the mock providers decorator to all stories
const preview = {
  // ...configuration...
  decorators: [withMockProviders],
};
```

### Recent Developments

#### Dashboard Components Implementation

Added several new dashboard components to demonstrate data visualization capabilities:

1. **StatCard**: Simple statistics cards with configurable icons, colors, and change indicators
2. **CircularProgress**: Customizable circular progress component
3. **GradientCard**: Eye-catching gradient cards for key metrics
4. **StatisticsCard**: Advanced statistics cards with integrated sparkline charts

#### Storybook Organization

1. **Atomic Design Categories**: Stories are organized according to atomic design principles
2. **Interactive Controls**: All components include appropriate controls for manipulating props
3. **Documentation**: Enhanced component documentation with descriptions and examples
4. **Grid Layouts**: Many stories include grid layouts to showcase component variants together

#### Component Isolation

1. **Presentation Patterns**: Created presentation-only versions of components with external dependencies
2. **Mock Providers**: Implemented mock context providers for components that rely on context
3. **Defensive Coding**: Updated components to handle missing dependencies gracefully

### Best Practices

1. **Component Isolation**: Each component should be fully functional in isolation
2. **Prop Documentation**: Document all props with descriptions and default values
3. **Responsive Examples**: Show how components adapt to different screen sizes
4. **Accessibility**: Include a11y status and considerations for each component
5. **Performance**: Note any performance considerations for complex components

---

## Project Timeline & Changelog

### Recent Development (April 10, 2024)

#### Repository Structure Migration - Phase 3 Complete
- Completed Phase 3 of migration to atomic design structure
- Created token management components as atomic components:
  - Molecules: TokenStateBadge, TicketBadges (status indicator badges)
  - Organisms: TokenList, TicketList (filterable/selectable list components)
- Implemented domain-agnostic view structure:
  - Created `/src/views/token-management/TokenManagementView.tsx`
  - View leverages atomic components rather than inline components
- Centralized shared code:
  - Created type definitions in `lib/token-management/types.ts`
  - Extracted utility functions to `lib/token-management/utils.ts`
  - Added proper index exports for better import experience

#### Atomic Component Structure Details
- Badge molecules implement consistent styling patterns 
- List organisms feature filtering, searching, and selection capabilities
- Components use the component metadata tagging system for better organization
- Components follow the pure atomic design pattern (domain-agnostic)

#### View Structure Implementation
- Views now live in a dedicated `/src/views` directory
- Token management view uses atomic components for all UI elements
- Clear separation between domain logic (in view) and presentation (in components)
- Incremental migration approach maintains backward compatibility

#### Next Steps for Migration - Phase 4
- Migrate remaining feature components to atomic structure
- Update route configuration to use the new view structure
- Implement Storybook stories for all migrated components
- Add more domain-agnostic views for other features
- Eventually remove duplicate components when migration is complete

### Repository Structure Migration - Phase 2 (April 4, 2024)

#### Phase 2 Complete
- Completed Phase 2 of migration to atomic design structure
- Updated component imports to use atomic design paths
- Migrated UI components to their corresponding atomic categories:
  - Button → atoms/Button
  - Input → atoms/Input
  - Card → atoms/Card
  - Label → atoms/Label
  - Textarea → atoms/Textarea
  - Select → atoms/Select
  - Dialog → molecules/Dialog
- Added metadata tagging approach for component classification
- Standardized on domain-agnostic architecture (Pure Atomic Design + Views)

#### Phase 2 Migration Details
- Identified duplicate components between UI and atomic directories
- Updated imports across feature components to use atomic versions
- Maintained backward compatibility during transition
- Used iterative, atomic commits to ensure stability
- Verified functionality after each migration step

### Repository Structure Alignment

#### 2023-11-15
- Aligned folder structure with admin tools repository
- Standardized component organization into atoms, molecules, organisms
- Established consistent naming conventions for files and components

#### 2023-12-01
- Refactored utility functions to match production patterns
- Standardized import paths using aliased imports (e.g., `@/components`)
- Implemented shared type definitions for better consistency

#### 2024-04-01
- Initiated migration to `/src` directory structure
- Created dedicated `src-migration` branch for the refactoring work
- Began moving atomic components (Button, Input, Card, etc.) to the new structure
- Ensured backward compatibility with existing imports during transition
- Updated Storybook configuration to support both original and migrated components
- Consolidated documentation for better project overview and tracking

### Component Development

#### 2023-12-10
- Implemented core UI components:
  - Button (primary, secondary, outline, text variants)
  - Input fields (text, number, select, multi-select)
  - Modal dialogs and toasts
  - Navigation elements (breadcrumbs, tabs)

#### 2024-01-05
- Developed layout components:
  - Page container with responsive breakpoints
  - Card components with various styles
  - Flex and grid layout helpers

#### 2024-01-15
- Created data visualization components:
  - Basic charts (bar, line, pie)
  - Data tables with sorting and filtering
  - Stat cards and KPI displays

#### 2024-02-01
- Enhanced dashboard-specific components:
  - Multi-tab dashboards
  - Customizable dashboard layouts
  - Client-specific theming

#### 2024-03-01
- Implemented advanced data visualization:
  - Interactive charts with tooltips
  - Sparkline charts for trend visualization
  - Progress indicators and gauges

#### 2024-05-10
- Added new dashboard components and stories:
  - StatCard for displaying KPIs with icons
  - CircularProgress for visual percentage representation
  - GradientCard with eye-catching gradients and patterns
  - StatisticsCard with embedded mini-charts

### Storybook Improvements

#### 2023-11-20
- Set up initial Storybook configuration
- Added basic documentation for core components

#### 2024-01-10
- Enhanced Storybook documentation with usage examples
- Added controls for interactive component customization
- Implemented consistent categorization of components

#### 2024-02-15
- Fixed Storybook rendering issues with Next.js components
- Implemented mock providers for context-dependent components
- Added visual regression testing capabilities

#### 2024-05-05
- Refactored Sidebar component for Storybook compatibility
- Created presentation-only versions of components with external dependencies
- Implemented defensive coding patterns for better isolation

#### 2024-05-10
- Enhanced visual presentation of dashboard components in Storybook
- Added grid-based layouts for showcasing component variants
- Improved documentation with code examples and detailed descriptions

### Bug Fixes

#### 2023-12-15
- Fixed responsive layout issues on smaller screens
- Addressed accessibility concerns with keyboard navigation
- Resolved color contrast issues for better readability

#### 2024-01-20
- Fixed state management bugs in form components
- Resolved race conditions in data fetching logic
- Addressed edge cases in filtering and sorting functionality

#### 2024-03-15
- Fixed chart rendering issues on certain browsers
- Resolved memory leaks in components with timeouts/intervals
- Fixed inconsistent behavior between development and production builds

#### 2024-05-05
- Fixed Sidebar component import paths for proper module resolution
- Addressed TypeScript errors related to implicit any types
- Resolved Storybook rendering issues with Redux-connected components

### Code Quality Improvements

#### 2023-12-05
- Implemented ESLint and Prettier for consistent code style
- Added TypeScript strict mode for better type safety
- Set up Husky pre-commit hooks for automated linting

#### 2024-01-25
- Refactored components for better reusability
- Improved test coverage for critical components
- Optimized bundle size with code splitting and lazy loading

#### 2024-03-10
- Enhanced error handling and logging
- Improved performance with memoization and optimized renders
- Implemented better state management patterns

#### 2024-05-05
- Applied presentation-only pattern for stateful components
- Improved type definitions for better development experience
- Enhanced defensive coding practices for more robust components

---

## Future Plans

### Current Focus

#### Domain-Driven Architecture Implementation
- Organizing code according to business domains
- Creating domain-specific components that leverage core atomic components
- Implementing domain-specific hooks, services, and views
- Maintaining clean separation between domains

#### Prop-Based Component Design
- Building components that accept all data via props
- Avoiding hard dependencies on contexts or global state
- Making components easy to test, reuse, and demo

#### Role-Specific Customization
- Implementing layout variants for different user roles
- Supporting role-specific features and UIs
- Maintaining consistent user experience across roles

#### Thin Page Composition
- Creating pages that simply compose domain views with layouts
- Keeping routing logic separate from business logic
- Making it easy to swap components and layouts

#### Demo Implementation
- Creating demo data organized by user persona
- Implementing clean demo pages that showcase features
- Using the same components for both production and demo

### Next Steps

#### Migration Roadmap (May-June 2024)

1. **Directory Structure Creation** ✅
   - Create base folders for domains, core, layouts, and demo
   - Set up the initial organizational structure
   - Update project documentation to reflect the new architecture

2. **Core Components Migration** (1-2 weeks)
   - Move existing atomic components to `/src/core/components`
   - Create proper index files for component exports
   - Update imports in existing code
   - Ensure backward compatibility during migration

3. **Domain Organization** (2-3 weeks)
   - Identify domains in the existing codebase
   - Create domain-specific directories
   - Move domain-specific components, hooks, and services
   - Set up proper exports and imports

4. **Layout Standardization** (1 week)
   - Create standardized layout components
   - Implement role-specific variants
   - Update page compositions to use the new layouts

5. **Demo Implementation** (1-2 weeks)
   - Create sample data organized by user persona
   - Implement demo pages that utilize the same components
   - Establish clear separation between demo and production code

6. **Testing & Refinement** (1-2 weeks)
   - Ensure all components work correctly in their new locations
   - Update Storybook stories for the new structure
   - Address any issues discovered during testing
   - Refine the architecture based on real-world usage

7. **Documentation & Knowledge Transfer** (Ongoing)
   - Update documentation to reflect the new architecture
   - Create guides for adding new domains and components
   - Train team members on the new structure
   - Establish standards for ongoing development

#### Immediate Tasks (This Sprint)

1. **Token Management Migration**
   - Move token management components to `/src/domains/tokens/components`
   - Create token management hooks in `/src/domains/tokens/hooks`
   - Move token management services to `/src/domains/tokens/services`
   - Update token management views in `/src/domains/tokens/views`

2. **Dashboard Layout Migration**
   - Create standard dashboard layout in `/src/layouts/dashboard`
   - Implement merchant and support variants
   - Update relevant pages to use the new layouts

3. **Core Component Organization**
   - Move Badge components to `/src/core/components/molecules`
   - Move Button, Card, and Input to `/src/core/components/atoms`
   - Move List components to `/src/core/components/organisms`
   - Update imports and ensure backward compatibility

4. **Demo Data Organization**
   - Create sample data for Deacon's Pizza in `/src/demo/merchants/deacons-pizza`
   - Set up support demo data in `/src/demo/support`
   - Ensure demo pages use data via props rather than context

### Next Steps

#### Short-term (1-2 weeks)
- Migrate additional feature views to the domain-agnostic structure
- Create Storybook stories for all migrated components
- Address type errors and linting issues in migrated components
- Complete migration of remaining token management components
- Update routes to use the new view structure

#### Medium-term (1 month)
- Migrate remaining feature components to the atomic design structure
- Implement remaining dashboard components
- Address all TypeScript and linting issues
- Enhance performance monitoring and optimization
- Complete project documentation reflecting the new structure

#### Long-term (3+ months)
- Remove duplicate components after migration is complete
- Develop advanced data visualization capabilities
- Implement AI-powered insights and recommendations
- Create customizable dashboard experiences for different user roles
- Ensure full alignment with Kigo Admin Tools production repository 