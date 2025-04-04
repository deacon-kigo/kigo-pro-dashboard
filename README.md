# Kigo Pro Dashboard

A prototype dashboard environment for the Kigo Pro platform that showcases UI components and dashboard features.

## Project Purpose

The Kigo Pro Dashboard serves three critical roles:

1. **Demo Platform**: A polished showcase of the Kigo platform capabilities, featuring client-specific themes (CVS, merchant businesses), role-based experiences, and complete product workflows for sales demonstrations and stakeholder presentations.

2. **Prototype Sandbox**: A development environment for rapid experimentation with new features, UX patterns, and technical approaches, enabling collaborative iteration across product, design, and development teams.

3. **Design System Implementation**: A living reference that bridges design and development through practical implementation of UI components, interaction patterns, and responsive behaviors.

## Project Structure

The project follows a hybrid approach combining Next.js App Router and Atomic Design:

```
.
├── app                 # Next.js App Router (routes/pages)
│   ├── dashboard       # Dashboard routes
│   ├── campaigns       # Campaign management routes
│   ├── demos           # Demo-specific routes
├── components          # UI Component Library
│   ├── atoms           # Basic building blocks (Button, Input, etc.)
│   ├── molecules       # Simple component combinations
│   ├── organisms       # Complex UI components
│   ├── templates       # Page layouts with placeholder content
│   ├── features        # Feature-specific components
│   │   ├── token-management
│   │   ├── analytics
```

## Key Features

- Role-based navigation and permissions (merchant, support, admin)
- Client-specific theming and white-labeling
- Comprehensive UI component library with Tailwind CSS
- Interactive demonstrations of core platform capabilities
- Next.js App Router architecture with Redux state management

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Start Storybook (Design Deliverable)
npm run storybook
```

**Important Note**: Always run Storybook from the `kigo-pro-dashboard` directory, not from the root repo folder.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Storybook - Design Deliverable

Storybook serves as the primary design deliverable, providing interactive documentation of all UI components and their variants.

```bash
# Start Storybook for component exploration and documentation
npm run storybook

# Build static Storybook for sharing
npm run build-storybook
```

### Key Storybook Features

- Interactive component documentation
- Visual testing of component states and variations
- Responsive design preview capabilities
- Accessibility checking with addon support
- Component prop documentation and examples

## Component Organization

### 1. Atomic Components

Components are organized using atomic design principles:

- **Atoms**: Basic UI elements (Button, Input, Card, Badge, etc.)
- **Molecules**: Combinations of atoms (Dialog, StatusBadge, etc.)
- **Organisms**: Complex components (Header, Sidebar, TokenList, etc.)
- **Templates**: Page layouts (AppLayout, DashboardLayout, etc.)

### 2. Feature Components

Domain-specific components are organized by feature domain:

- **Token Management**: Components specific to token management functionality
- **Analytics**: Components specific to analytics functionality
- **Campaign Management**: Components specific to campaign functionality

## Development Guidelines

### Adding New Components

1. Identify whether the component is generic (atomic) or domain-specific (feature):

   - Generic UI components go in atoms/molecules/organisms
   - Domain-specific components go in features/{domain}

2. Create the appropriate files:

   - ComponentName.tsx
   - index.ts (for exports)

3. Document with JSDoc and create a Storybook story:

```tsx
/**
 * @component ComponentName
 * @classification atom|molecule|organism
 * @description Purpose of the component
 */
```

### Creating Routes/Pages

Use the Next.js App Router structure:

```
/app/route-name/page.tsx
```

## Demo Environments

The dashboard includes several demo environments for different client contexts:

- **Default Merchant**: Standard merchant experience
- **CVS Health**: Customized experience for enterprise healthcare client
- **Support Portal**: View for customer support users

To switch between demos, use the demo selector in the user menu.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Storybook](https://storybook.js.org/docs/react/get-started/introduction)

## Deployment

The dashboard can be deployed through Vercel, Netlify, or any static site hosting platform that supports Next.js.

### Storybook Deployment

The Storybook component library is deployed at:
https://storybook-static-3sp2uzsya-deacon-s-projects.vercel.app

## Contributing

Please follow the established patterns when contributing to this project:

1. Use existing component patterns where possible
2. Document new components with JSDoc and Storybook stories
3. Maintain accessibility best practices
4. Test components across various screen sizes
5. Consider the triple purpose of the project in your designs and implementations
