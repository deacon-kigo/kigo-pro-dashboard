# Kigo Pro Dashboard

A prototype dashboard environment for the Kigo Pro platform that showcases UI components and dashboard features.

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

## Design System Approach

Kigo Pro maintains brand consistency with the wider Kigo ecosystem while implementing components using Tailwind CSS rather than Material UI:

1. **Design Tokens**: We extract design tokens (colors, typography, spacing) from the Kigo Web SDK
2. **Tailwind Integration**: These tokens are integrated into our Tailwind configuration
3. **Custom Components**: We create custom Tailwind-based components that align with Kigo branding

This approach allows us to maintain a consistent visual identity while benefiting from Tailwind's developer experience and flexibility.

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

3. Document with JSDoc:
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

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Start Storybook
npm run storybook
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Inter](https://fonts.google.com/specimen/Inter), which is the Kigo brand font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
