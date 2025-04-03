# Kigo Pro Design System

## Current State & Design Direction

Kigo Pro is a greenfield project with design freedom while maintaining brand consistency with the wider Kigo ecosystem. As the sole designer, the approach is to:

1. **Adopt Kigo design tokens** (colors, typography, spacing, etc.) for brand consistency
2. **Use Tailwind CSS** for implementation rather than Material UI components
3. **Create custom components** that align with the Kigo brand but are optimized for the Pro platform

## Technology Stack

- **Framework**: Next.js with App Router
- **Styling**: Tailwind CSS with custom configuration
- **Component Structure**: Atomic Design pattern
- **Documentation**: Storybook (planned)

## Design Token Integration Strategy

We will extract design tokens from the Kigo Web SDK (`kigoMuiTheme.ts`) and integrate them into our Tailwind configuration:

```js
// tailwind.config.mjs excerpt - TO BE IMPLEMENTED
export default {
  theme: {
    extend: {
      colors: {
        // Kigo Colors
        primary: "#4B55FD",
        secondary: "#CCFFFE",
        
        // Neutrals from Kigo
        white: "#FFFFFF",
        stone: "#f6f5f1",
        charcoal: "#5A5858",
        black: "#231F20",
        'black-grey': "#E9E9E9",
        'gray-100': "#E4E5E7",
        'gray-200': "#E5E7EB",
        'gray-500': "#717585",
        'gray-900': "#111827",
        
        // Reds
        'red-light-50': "#FEECED",
        'red-light-10': "#C63469",
        red: "#DC1021",
        'red-dark-10': "#AB0C1A",
        'red-dark-20': "#8E0916",
        coral: "#FF4F5E",
        
        // Other colors from Kigo palette
        orange: "#FF8717",
        blue: "#328FE5",
        'blue-light-35': "#E6E7FF",
        'sky-blue': "#CCFFFE",
        'dark-sky-blue': "#25BDFE",
        green: "#77D898",
        'green-100': "#6ADFA0",
        'light-green': "#D1F7DF",
        purple: "#8941EB",
        'light-purple': "#E5D7FA",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      fontSize: {
        // Mapping to Kigo type scale
        'xs': '10px',    // bodyXs
        'sm': '12px',    // bodySm
        'base': '14px',  // bodyMd
        'lg': '16px',    // titleSm
        'xl': '22px',    // titleMd
        '2xl': '32px',   // titleLg
        '3xl': '50px',   // titleXl
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
      },
      lineHeight: {
        tight: '16px',    // bodySm lineHeight
        snug: '20px',     // bodyMd lineHeight
        normal: '24px',   // titleSmBd lineHeight
        relaxed: '28px',  // titleMd lineHeight
        loose: '40px',    // titleLg lineHeight
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px', 
        'lg': '20px',
        'xl': '25px',
      },
      screens: {
        'sm': '420px',
        'md': '640px',
        'lg': '768px',
        'xl': '1025px',
      },
    },
  },
}
```

## Next Steps for Design System Implementation

1. **Update Tailwind Config**: Implement the design tokens from Kigo Web SDK into our Tailwind configuration
2. **Create Nav & Header Components**: Develop custom Tailwind-based components that follow Kigo branding but are optimized for our tech stack
3. **Document in Storybook**: Set up Storybook to document components and design tokens
4. **Design Pattern Library**: Document reusable patterns and usage guidelines

## Component Requirements

### Nav Component
The navigation component will be implemented in Tailwind CSS while maintaining the Kigo branding:

- Responsive behavior across all breakpoints
- Support for authenticated and unauthenticated states
- Consistent with Kigo branding in typography and colors
- Support for both desktop sidebar and mobile menu patterns

### Header Component
The header component will follow similar principles:

- Adapts to different page contexts
- Includes search, user profile, and notification features
- Maintains Kigo typography and color scheme
- Smooth responsive behavior

## Design-Development Workflow

1. Create design tokens and base components in Storybook
2. Document component APIs and behavior patterns
3. Provide implementation guidelines for developers
4. Maintain a living design system that evolves with the product

## Storybook Implementation Guide

### Philosophy: Flexible Implementation Approaches

For Storybook, we support two implementation approaches depending on the component's complexity:

1. **Presentation-Only Components**: For most components, create visual-only presentational components with no external dependencies
2. **Redux Provider Approach**: For complex components deeply integrated with Redux, use a proper Redux Provider with a mock store

Both approaches prioritize simplicity and focus on visual representation over complex functionality.

### Approach 1: Presentation-Only Components

This approach has several benefits:
- **Simplicity**: Stories are easier to create and maintain
- **Reliability**: No dependencies on complex state management means fewer errors
- **Performance**: Stories load and render faster
- **Focus on UI**: Keeps the focus on visual design and component variants

#### Implementation Pattern for Presentation-Only

1. Create a `Storybook{ComponentName}` component that mimics the visual appearance
2. Keep all state local to the component (no external dependencies)
3. Use static props to showcase different variants/states
4. Include all required visual elements directly within the component

#### Example: Simplified Sidebar Story

```tsx
// Create a presentational Sidebar just for Storybook
const StorybookSidebar = ({ 
  clientName = "Deacon's Pizza",
  clientId = "deacons",
  role = "merchant",
  isCollapsed = false,
  isMobileView = false
}) => {
  const sidebarWidth = isCollapsed ? '70px' : '225px';
  const isCVSContext = clientId === 'cvs';
  
  // Update CSS variable for sidebar width
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--sidebar-width', sidebarWidth);
  }
  
  // Render component with local state only
  return (
    <div className="fixed top-0 left-0 h-full bg-white shadow-sm">
      {/* Component content */}
    </div>
  );
};

// Story definition
const meta: Meta<typeof StorybookSidebar> = {
  component: StorybookSidebar,
  title: 'Kigo UI/Organisms/Sidebar',
  parameters: {
    docs: {
      description: {
        component: 'Main navigation sidebar with collapsible menu and branding.',
      },
    },
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

// Story variants
export const Default: Story = {
  render: () => (
    <SidebarStoryWrapper 
      clientName="Deacon's Pizza"
      clientId="deacons"
      role="merchant"
    />
  )
};
```

### Approach 2: Redux Provider Approach

For components that are tightly integrated with Redux (like Header, complex forms, etc.), it may be simpler to use the actual component with a Redux Provider:

#### Implementation Pattern for Redux Components

1. Create a mock store with the necessary state structure
2. Wrap the component in a Redux Provider with the mock store
3. Create a simple wrapper component to set any required props or context
4. Use decorators to provide different mock states for each story variant

#### Example: Header Component with Redux Provider

```tsx
// Create a wrapper for the Header component with Redux Provider
const HeaderStoryWrapper = (props: { pathname?: string }) => {
  // Update the mock pathname when the component renders
  useEffect(() => {
    if (typeof window !== 'undefined' && props.pathname) {
      window.__NEXT_MOCK_PATHNAME = props.pathname;
    }
  }, [props.pathname]);
  
  return (
    <div className="header-story-wrapper">
      <Header />
    </div>
  );
};

// Mock reducers and initial state
const mockUiInitialState = {
  isMobileView: false,
  sidebarCollapsed: false,
  sidebarWidth: '250px',
  // other UI state...
};

const mockUserInitialState = {
  profile: { /* user profile data */ },
  notifications: [ /* notification items */ ]
};

// Create a mock store
const createMockStore = (demoState: Record<string, unknown> = {}) => {
  return configureStore({
    reducer: {
      ui: (state = mockUiInitialState) => state,
      user: (state = mockUserInitialState) => state,
      demo: (state = demoState, action: { type: string; payload?: Record<string, unknown> }) => {
        if (action.type === 'SET_DEMO_STATE' && action.payload) {
          return { ...state, ...action.payload };
        }
        return state;
      }
    }
  });
};

// Story definition
const meta: Meta<typeof HeaderStoryWrapper> = {
  component: HeaderStoryWrapper,
  title: 'Kigo UI/Organisms/Header',
  decorators: [
    (Story) => (
      <Provider store={createMockStore({
        role: 'merchant',
        clientId: 'deacons',
        clientName: 'Deacon\'s Pizza',
        themeMode: 'light'
      })}>
        <div style={{ 
          height: '100vh', 
          padding: '80px 0 0 250px',
          background: '#f5f5f5'
        }}>
          <Story />
        </div>
      </Provider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: 'Header component with Redux Provider',
      },
    },
  },
  tags: ['autodocs'],
};

// Story variants
export const MerchantHeader: Story = {
  args: {
    pathname: '/dashboard'
  },
  decorators: [
    (Story) => (
      <Provider store={createMockStore({
        role: 'merchant',
        clientId: 'deacons',
        clientName: 'Deacon\'s Pizza',
        themeMode: 'light'
      })}>
        <div style={{ height: '100vh', padding: '80px 0 0 250px' }}>
          <Story />
        </div>
      </Provider>
    ),
  ],
};
```

### Handling Next.js Dependencies

For components that use Next.js hooks like `usePathname`, we add a simple mock in our Storybook preview.js:

```js
// In .storybook/preview.js
if (typeof window !== 'undefined') {
  // Default pathname for Storybook stories
  window.__NEXT_MOCK_PATHNAME = '/';
}

// Global decorator for updating pathname
const withMockNextHooks = (Story, context) => {
  if (typeof window !== 'undefined' && context.parameters.pathname) {
    window.__NEXT_MOCK_PATHNAME = context.parameters.pathname;
  }
  return <Story />;
};
```

Then in your component, ensure there's a fallback:

```jsx
// In your component
const pathname = usePathname() || ''; // Add fallback for Storybook
```

### Choosing the Right Approach

- **Use Presentation-Only** for most components where you primarily want to document appearance
- **Use Redux Provider** when:
  - The component is deeply integrated with Redux state
  - Visual appearance depends significantly on Redux state
  - It's simpler than recreating the component's complex UI logic

### Story Structure by Component Type

#### Atoms (Simple Components)

For atoms (Button, Input, etc.), create stories that:
- Show all variants (primary, secondary, outline, etc.)
- Show all sizes (sm, md, lg, etc.)
- Show all states (default, hover, active, disabled, etc.)

#### Molecules (Composed Components)

For molecules, create stories that:
- Show the component in different configurations
- Demonstrate interactive behavior if applicable
- Show integration with different atom variants

#### Organisms (Complex Components)

For organisms like Sidebar, Header, etc.:
- Create a visual-only version that matches the real component
- Define props that control the key visual states
- Show all client/theme variants (default, CVS, etc.)
- Demonstrate responsive behavior

#### Templates (Page Layouts)

For templates like AppLayout:
- Create a complete visual mockup with dummy content
- Show different page configurations
- Demonstrate responsive layouts

### Documentation in Stories

Each story should include:

1. **Component description** in the metadata
2. **Variant descriptions** for each story
3. **Props documentation** using argTypes
4. **Usage examples** in the stories themselves

By following this simplified approach, we maintain clean separation between our production components and their Storybook representations, while still providing comprehensive visual documentation.

---

This approach allows us to maintain brand consistency with the Kigo ecosystem while leveraging our preferred technology stack (Next.js + Tailwind CSS) for implementation. 