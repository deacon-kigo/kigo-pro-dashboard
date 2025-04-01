# Coding Standards

This document describes recommendations and code standards for writing code for the Kigo Pro Dashboard repo.

## General Rules

- Write **Functional components** instead of Class-based components.
- Use [hooks](https://react.dev/reference/react/hooks) when applicable.
- Do not use magic numbers and strings. Use variables and enums instead.
- Use absolute path imports.

## Naming

- Use `.tsx` extension for React components.
- Use **camelCase** for variables and functions names.
- Use **PascalCase** for React components and camelCase for their instances.
- Use **UPPER_SNAKE_CASE** for constants and enum values.

## Atomic Design Structure

This project follows atomic design principles to organize components:

- **Atoms**: Basic building blocks (Button, Input, Label, etc.)
- **Molecules**: Simple combinations of atoms (Dialog, Chart, etc.)
- **Organisms**: Complex UI sections (Header, Sidebar, etc.)
- **Templates**: Page layouts (StandardDashboard, AppLayout, etc.)

Each component should be organized in its appropriate category folder with the following structure:

```
/ComponentName
  index.ts          # Export the component
  ComponentName.tsx # The actual component
  ComponentName.stories.tsx # Storybook stories
  ComponentName.test.tsx # Tests (when applicable)
```



