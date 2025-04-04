# Dashboard Architecture

This directory contains the implementation of the dashboard feature, which is a core component of the Kigo Pro dashboard application. The architecture follows atomic design principles and uses a registry pattern for maximum scalability and extensibility.

## Architecture Overview

The dashboard system is structured as follows:

```
dashboard/
├── DashboardView.tsx        # Main component that renders the appropriate view
├── registry/
│   └── dashboardRegistry.ts # Registry for dashboard views
├── views/                   # Client-specific dashboard views
│   ├── CVSDashboardView.tsx
│   ├── CVSTokenManagementView.tsx
│   ├── DeaconsPizzaView.tsx
│   └── GenericDashboardView.tsx
└── README.md
```

## Key Components

### DashboardView

`DashboardView` is a smart component that:
- Gets the current context (clientId, scenario, etc.) from the Demo context provider
- Uses the dashboard registry to determine which view component to render
- Wraps the selected view in Suspense for loading states

This component doesn't need to be modified when adding new dashboard views.

### Dashboard Registry

The registry pattern allows for:
- Decoupled registration and retrieval of dashboard views
- Easy addition of new client-specific views without modifying existing code
- Central management of view-to-context mapping

The registry provides:
- `registerView(clientId, scenario, component)`: Register a view for a specific client/scenario
- `getView(clientId, scenario)`: Get the appropriate view based on context
- Fallback to a default view when no specific view is registered

## Adding a New Dashboard View

To add a new dashboard view for a client/scenario:

1. Create a new view component in the `views/` directory
   ```tsx
   // views/NewClientView.tsx
   export default function NewClientView() {
     // Implement your client-specific dashboard
     return <StandardDashboard>...</StandardDashboard>;
   }
   ```

2. Register the view in the dashboard registry
   ```typescript
   // registry/dashboardRegistry.ts
   
   // Import your new view component
   import NewClientView from '../views/NewClientView';
   
   // In the initializeRegistry method:
   this.registerView('new-client', 'dashboard', NewClientView);
   ```

That's it! The `DashboardView` component will automatically use your new view when the context matches.

## Best Practices

1. Use `StandardDashboard` as the base template for all dashboard views
2. Create client-specific components for each part of the dashboard (header, stats, etc.)
3. Use atomic design principles - compose from smaller components
4. Leverage context providers for state management
5. Keep view components focused on layout and composition, delegate business logic to hooks and services

## Context-Based Routing

The main `page.tsx` files are responsible for setting up the appropriate context for the dashboard view:

```tsx
export default function ClientDashboardPage() {
  const { updateDemoState } = useDemo();
  
  useEffect(() => {
    updateDemoState({
      clientId: 'client-id',
      scenario: 'scenario-name',
      role: 'role-name'
    });
  }, [updateDemoState]);

  return <DashboardView />;
}
```

This approach keeps routing logic centralized and makes it easy to add new routes without modifying core components. 