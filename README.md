# Kigo Pro Dashboard

A prototype dashboard environment for the Kigo Pro platform that showcases UI components and dashboard features, serving as a design canvas and reference implementation.

## Organization Principles

The Kigo Pro Dashboard follows these key principles:

1. **Atomic Design for Components**: Components are organized using atomic design methodology
2. **Next.js App Router for Routing**: Page routes are defined in the `/app` directory
3. **Feature-Based Organization**: Domain-specific components are grouped by feature
4. **Prop-Based Components**: Components accept data via props, avoiding hard dependencies

## Project Structure

The project follows a combination of Next.js App Router structure and Atomic Design for components:

```
.
├── app                 # Next.js App Router (routes/pages)
│   ├── dashboard       # Dashboard routes
│   ├── campaigns       # Campaign management routes
│   ├── demos           # Demo-specific routes
│   │   ├── cvs-dashboard
│   │   ├── cvs-token-management 
│   │   ├── deacons-pizza
├── components          # UI Components (Atomic Design)
│   ├── atoms           # Basic building blocks (Button, Input, etc.)
│   ├── molecules       # Simple component combinations
│   ├── organisms       # Complex UI components
│   ├── templates       # Page templates/layouts
│   ├── features        # Feature-specific components
│   │   ├── analytics
│   │   ├── token-management
│   │   ├── external-ticketing
├── contexts            # React contexts
├── hooks               # Custom React hooks
├── lib                 # Shared libraries and utilities
├── public              # Static assets
├── styles              # Global styles
├── types               # TypeScript type definitions
```

## Component Organization

We follow the Atomic Design methodology for organizing components:

### Atoms
Basic building blocks that serve as the foundation of the UI:
- Button
- Input
- Card
- Label
- Badge

### Molecules
Simple combinations of atoms:
- StatusBadge
- Dialog
- Chart
- Form elements

### Organisms
Complex UI components:
- Header
- Sidebar
- TokenList
- ActionSummaryPanel

### Templates
Page layouts with placeholder content:
- AppLayout
- StandardDashboard

### Feature-Specific Components
Domain-specific components that combine atoms, molecules, and organisms:
- Token Management
- Analytics
- External Ticketing

## Component Guidelines

### Creating New Atomic Components

1. Identify the appropriate level (atom, molecule, organism, template)
2. Create a directory in the corresponding folder
3. Add appropriate files (component, tests, stories)
4. Create an index file for clean exports

Example:
```
/components/atoms/Button/
  Button.tsx         # Component implementation
  Button.test.tsx    # Tests
  Button.stories.tsx # Storybook stories
  index.ts           # Export file
```

### Creating Feature-Specific Components

1. Identify the feature domain (token-management, analytics, etc.)
2. Create component in the appropriate feature directory
3. Compose using atomic components

Example:
```
/components/features/token-management/
  TokenManagementView.tsx  # Main view
  TokenList.tsx            # Token list component
  TokenDetails.tsx         # Token details component
```

### Component Documentation

Use JSDoc comments to document components:

```typescript
/**
 * @component ButtonComponent
 * @classification atom
 * @pattern data-entry
 * @usage both
 * @description A reusable button component with various style variants
 */
```

## Adding New Routes/Pages

1. Create a new directory in the `/app` directory
2. Add a page.tsx file for the route
3. Compose the page using components from the component library
4. Add any route-specific layout if needed

Example:
```
/app/settings/
  page.tsx         # Main page component
  layout.tsx       # Optional layout wrapper
```

## Demo Implementation

For creating demos:

1. Add a new directory under `/app/demos`
2. Create pages that demonstrate specific features
3. Pass sample data as props to components
4. Use the appropriate layout/template

## Development Workflow

1. Develop and test components in isolation using Storybook
2. Integrate components into feature-specific sections
3. Compose pages using the components in the Next.js app directory
4. Use demo routes to showcase different configurations

## Best Practices

1. **Keep Components Pure**: Components should primarily accept data via props
2. **Avoid Duplicating Components**: Reuse existing components instead of creating new ones
3. **Follow Atomic Design**: Respect the atomic design hierarchy
4. **Document Components**: Add JSDoc comments to all components
5. **Use TypeScript**: Define proper types and interfaces for all components
6. **Create Storybook Stories**: Add stories for visual testing and documentation

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Start Storybook
npm run storybook
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
