# Kigo Pro Dashboard Demo Architecture

This document outlines the architecture for the Kigo Pro Dashboard demo application, which supports multiple demo scenarios for various user roles and client contexts.

## Table of Contents

1. [Overview](#overview)
2. [Context System](#context-system)
3. [Routing & Configuration](#routing--configuration)
4. [Component Structure](#component-structure)
5. [Theming](#theming)
6. [Usage Guide](#usage-guide)

## Overview

The Kigo Pro Dashboard demo is designed with flexibility in mind, allowing demonstration of different user roles, client contexts, and demo scenarios. The architecture is built around a central context system that manages state across the application, with responsive components that adapt to the current context.

## Context System

### DemoContext

The core of the architecture is the `DemoContext` which maintains state for:

- **User Role**: Determines the user's perspective (merchant, support agent, admin)
- **Client**: Specifies the merchant/client being viewed or managed
- **Theme**: Controls visual aspects like colors, logos, and dark/light mode
- **Scenario**: Defines the demo flow being showcased

The context is accessible throughout the application via the `useDemo()` hook.

```tsx
// Example usage
import { useDemo } from '../contexts/DemoContext';

function MyComponent() {
  const { role, clientId, themeMode, updateDemoState } = useDemo();
  
  // Component logic based on context...
}
```

### State Management

The context provides functions to update the state:

- `updateDemoState()`: Partial updates to the context state
- Complete state can be accessed and used for conditional logic

## Routing & Configuration

### URL Parameters

The demo state can be controlled via URL parameters:

- `?role=merchant|support|admin`: Set the user role
- `?client=deacons-pizza|cvs|generic`: Set the client/merchant
- `?theme=light|dark`: Set the theme mode
- `?scenario=default|campaign-creation|support-flow`: Set the active scenario

Example: `/dashboard?role=admin&client=cvs&scenario=support-flow`

### Configuration Files

Demo configurations are centralized in `config/demoConfigs.ts`:

- **Scenarios**: Define available demo flows
- **Clients**: Define available client profiles
- **Themes**: Define theme configurations based on clients

## Component Structure

The application components are designed to be context-aware:

### Core Layout Components

- **Sidebar**: Changes navigation options based on user role
- **Header**: Adapts search functionality and action buttons to role
- **DemoSelector**: UI for changing demo settings

### Demo-specific Components

Components can conditionally render based on the current context:

```tsx
function ConditionalFeature() {
  const { role, scenario } = useDemo();
  
  if (role === 'admin' && scenario === 'support-flow') {
    return <AdminSupportPanel />;
  }
  
  if (role === 'merchant') {
    return <MerchantDashboard />;
  }
  
  return <GenericView />;
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

2. Ensure the theme function supports the new client.

### Testing Different Roles

Use the DemoSelector UI or URL parameters to switch between:

- Merchant role: Focuses on campaign management and performance
- Support role: Focuses on customer tickets and merchant management
- Admin role: Focuses on platform-wide controls and merchant management

## Best Practices

1. Always check the current context before rendering role-specific UI
2. Use the `themeMode` to ensure proper styling in both dark and light modes
3. Keep configuration centralized in the `demoConfigs.ts` file
4. Avoid hardcoding role or client-specific logic; use the context instead 