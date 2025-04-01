# Kigo Pro Dashboard Demo Architecture

This document outlines the architecture for the Kigo Pro Dashboard demo application, which supports multiple demo scenarios for various user roles and client contexts, while also serving as a design source of truth for development.

## Table of Contents

1. [Overview](#overview)
2. [Context System](#context-system)
3. [Demo Interface Components](#demo-interface-components)
4. [Routing & Configuration](#routing--configuration)
5. [Component Structure](#component-structure)
6. [User Personalization](#user-personalization)
7. [Theming](#theming)
8. [Version Control & Design System](#version-control--design-system)
9. [Dashboard Standardization](#dashboard-standardization)
10. [Usage Guide](#usage-guide)

## Overview

The Kigo Pro Dashboard demo is designed with flexibility in mind, allowing demonstration of different user roles, client contexts, demo scenarios, and implementation stages. The architecture is built around a central context system that manages state across the application, with responsive components that adapt to the current context.

## Core Principles

- **Separation of Concerns**: Demo state management is separate from UI components
- **Composition over Inheritance**: Components are designed to be composable
- **Extensibility**: Easy to add new demo instances, scenarios, clients, and versions
- **Performance**: Efficient state management with React Context
- **Portability**: Demo instances can be shared via URLs
- **Modularity**: Standardized layouts that adapt to different contexts
- **Version Control**: Support for different implementation phases and design iterations

## Context System

### DemoContext

The core of the architecture is the `DemoContext` which maintains state for:

- **User Role**: Determines the user's perspective (merchant, support agent, admin)
- **Client**: Specifies the merchant/client being viewed or managed
- **Theme**: Controls visual aspects like colors, logos, and dark/light mode
- **Scenario**: Defines the demo flow being showcased
- **Version**: Indicates the implementation phase or feature iteration (new)
- **Instance**: Preserves a specific combination of role, client, scenario, and version with history tracking

The context is accessible throughout the application via the `useDemo()` hook.

```tsx
// Example usage
import { useDemo } from '../contexts/DemoContext';

function MyComponent() {
  const { role, clientId, themeMode, version, updateDemoState } = useDemo();
  
  // Component logic based on context...
}
```

### State Management

The context provides functions to update the state:

- `updateDemoState()`: Partial updates to the context state
- `saveCurrentInstance()`: Creates a snapshot of the current settings
- `goToInstance()`: Navigates to a previously saved instance in history
- Complete state can be accessed and used for conditional logic

## Demo Interface Components

The demo architecture includes specialized UI components for managing demo scenarios:

### Demo Spotlight

A MacOS Spotlight-inspired interface for quickly switching between demo instances:

- Triggered with keyboard shortcut `⌘+K`
- Fuzzy search across all available demo instances
- Hierarchical organization of demo instances by user category
- Keyboard navigation
- Visual identification with emojis
- Proper linking to the correct demo paths

### Demo Controls Panel

A collapsible settings panel for detailed demo configuration:

- Available in three states: closed, collapsed, and expanded
- Can be pinned to stay open while navigating
- Saves state to localStorage for persistence
- Provides granular control over:
  - User Persona selection
  - Business selection
  - Theme mode
  - Demo scenario
  - Version/iteration selection (new)
- Displays history of recently accessed instances

## Routing & Configuration

### URL Parameters

The demo state can be controlled via URL parameters:

- `?role=merchant|support|admin`: Set the user role
- `?client=deacons-pizza|cvs|generic`: Set the client/merchant
- `?theme=light|dark`: Set the theme mode
- `?scenario=default|campaign-creation|support-flow`: Set the active scenario
- `?version=current|future|prototype`: Set the implementation phase (new)

Example: `/dashboard?role=admin&client=cvs&scenario=support-flow&version=future`

### Configuration Files

Demo configurations are centralized in `config/demoConfigs.ts`:

- **Scenarios**: Define available demo flows
- **Clients**: Define available client profiles
- **Themes**: Define theme configurations based on clients
- **Users**: Mapped to roles and clients for personalized experiences
- **Versions**: Define different implementation phases (new)

## Component Structure

The application components are designed to be context-aware:

### Core Layout Components

- **Sidebar**: Changes navigation options based on user role
- **Header**: Adapts search functionality and action buttons to role
- **DemoSelector**: UI for changing demo settings
- **DemoSpotlight**: Modal interface for quick demo switching
- **StandardDashboard**: Reusable dashboard layout used across scenarios (new)

### Standardized Dashboard Layout

All dashboard views should use a common layout structure that adapts to the context:

```tsx
function StandardDashboard({ children }) {
  const { role, clientId, scenario, version } = useDemo();
  
  return (
    <div className="space-y-4 pt-4 transition-all duration-300 ease-in-out">
      {/* Common header section */}
      <DashboardHeader role={role} clientId={clientId} />
      
      {/* Stats overview cards */}
      <StatCardsSection role={role} version={version} />
      
      {/* Main content area that adapts to context */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Primary content - adapts to context */}
          {children}
        </div>
        
        <div className="space-y-6">
          {/* Sidebar content - adapts to role and context */}
          <RoleBasedSidebar role={role} scenario={scenario} version={version} />
        </div>
      </div>
    </div>
  );
}
```

### Demo-specific Components

Components can conditionally render based on the current context:

```tsx
function ConditionalFeature() {
  const { role, scenario, version } = useDemo();
  
  // Version-specific conditional rendering
  if (version === 'future' && role === 'admin') {
    return <AdvancedAdminPanel />;
  }
  
  if (role === 'admin' && scenario === 'support-flow') {
    return <AdminSupportPanel />;
  }
  
  if (role === 'merchant') {
    return <MerchantDashboard />;
  }
  
  return <GenericView />;
}
```

## Version Control & Design System

The version control system allows for managing different implementation phases and design iterations:

### Version Types

- **Current**: Features and components currently implemented in production
- **Upcoming**: Features planned for the next release cycle
- **Future**: Long-term roadmap features and designs
- **Experimental**: Experimental designs and concepts for feedback

### Component Library Integration

Each component should include version metadata to indicate its availability:

```tsx
function AIAssistant() {
  const { version } = useDemo();
  
  // Show different versions based on implementation phase
  if (version === 'current') {
    return <BasicAIAssistant />;
  } else if (version === 'upcoming') {
    return <EnhancedAIAssistant />;
  } else if (version === 'future') {
    return <AdvancedAIAssistant />;
  }
  
  // Default fallback
  return <BasicAIAssistant />;
}
```

### Storybook Integration

Components should be organized in Storybook by:
- Functional category
- Implementation status/version
- User role relevance

This allows developers to browse:
- Currently implemented components
- Upcoming designs ready for implementation
- Future designs for planning

## Dashboard Standardization

All dashboard views should be standardized to use the same layout structure as `app/page.tsx`:

### Key Features to Standardize

1. **Header Section**: With greeting, user info, and contextual content
2. **Stat Card Grid**: For key metrics and KPIs
3. **Main Content / Sidebar Layout**: 2:1 grid layout for content organization
4. **Chart Components**: Using the same charting library and style
5. **Card Components**: Consistent card styling with standardized headers

### Implementation Strategy

1. Extract common layout patterns from `app/page.tsx`
2. Create reusable layout components
3. Convert existing demo pages to use these standard layouts
4. Ensure all demo links in Demo Spotlight point to correct pages
5. Update path definitions in instance configurations

## User Personalization

The demo system supports personalized experiences tailored to the current user persona.

### Mock Users

Each combination of role and client has an associated mock user profile (defined in `docs/demo/mock-users.md`):

- **Merchant - Deacon's Pizza**: Marco Deacon, Owner
- **Merchant - CVS**: Jennifer Williams, Regional Marketing Director
- **Support - Generic**: Alex Chen, Customer Support Agent
- **Admin - Generic**: David Garcia, Platform Operations Manager or Jane Foster, Analytics Director

### Dynamic Content

Components can personalize their content based on the current user:

```tsx
function PersonalizedGreeting() {
  const { role, clientId } = useDemo();
  const user = getUserForContext(role, clientId);
  const greeting = getTimeBasedGreeting(); // "Good morning", etc.
  
  return (
    <h1 className="text-2xl font-bold">
      {greeting}, {user.firstName}!
    </h1>
  );
}
```

## Theming

The application supports client-specific theming and dark/light modes:

### Client Themes

Each client has:
- Primary and secondary colors
- Custom logo
- Industry-specific UI elements

### Dark/Light Mode

The `themeMode` property allows toggling between dark and light interfaces, with components adapting their styling accordingly.

## Usage Guide

### Implementing a New Demo Scenario

1. Add the scenario to `demoConfigs.ts`:

```ts
scenarios: {
  'new-scenario': {
    title: 'New Demo Scenario',
    description: 'Description of the scenario',
    initialStep: 'starting-point'
  }
}
```

2. Create relevant components that check for the scenario:

```tsx
function ComponentWithScenarioAwareness() {
  const { scenario } = useDemo();
  
  if (scenario === 'new-scenario') {
    return <NewScenarioContent />;
  }
  
  return <DefaultContent />;
}
```

### Adding a New Version

1. Add the version to `demoConfigs.ts`:

```ts
versions: {
  'current': {
    name: 'Current Release',
    description: 'Features currently in production'
  },
  'upcoming': {
    name: 'Upcoming Release',
    description: 'Features planned for next release'
  }
}
```

2. Use version in components:

```tsx
function FeatureWithVersionControl() {
  const { version } = useDemo();
  
  if (version === 'upcoming' || version === 'future') {
    return <NewFeatureImplementation />;
  }
  
  return <CurrentFeatureImplementation />;
}
```

### Adding a New Client

1. Add the client to `demoConfigs.ts`:

```ts
clients: {
  'new-client': {
    name: 'New Client Name',
    industry: 'Client Industry',
    logo: '/logos/new-client.png',
    primaryColor: '#123456',
    secondaryColor: '#654321'
  }
}
```

2. Create mock user profiles for this client in various roles
3. Ensure the theme function supports the new client

### Testing Different Roles

Use the DemoSelector UI, Spotlight (⌘+K), or URL parameters to switch between:

- Merchant role: Focuses on campaign management and performance
- Support role: Focuses on customer tickets and merchant management
- Admin role: Focuses on platform-wide controls and merchant management

## Best Practices

1. Always check the current context before rendering role-specific UI
2. Use the `themeMode` to ensure proper styling in both dark and light modes
3. Keep configuration centralized in the config files
4. Incorporate personalized elements based on the mock user profiles
5. Allow for progressive disclosure based on the user's technical proficiency
6. Ensure all demos tell a coherent story that addresses the user's key pain points
7. Provide clear visual cues when switching between demo instances
8. Respect version control to indicate implementation status
9. Use standardized layouts for all dashboard views 