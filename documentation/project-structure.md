# Project Structure

This section provides an overview of the key directories within the `kigo-pro-dashboard` project, helping new developers quickly understand how the project is organized.

[Get acquainted with Next.js's project structure](https://nextjs.org/docs/app/getting-startedure).

```txt
.
├── adr                 # Architectural Decision Records
├── diagrams            # Visual diagrams of the system
├── documentation       # Project documentation
├── public              # Static assets
├── src                 # Source code
│   ├── app             # Next.js App Router
│   ├── components      # UI Components (Atomic Design)
│   │    ├── atoms      # Basic building blocks
│   │    ├── molecules  # Simple combinations of atoms
│   │    ├── organisms  # Complex UI sections
│   │    ├── templates  # Page layouts
│   │    └── shared     # Shared UI utilities
│   ├── config          # Configuration
│   ├── constants       # Constants and enums
│   ├── contexts        # React contexts
│   ├── hooks           # Custom React hooks
│   ├── mocks           # Mock data for testing
│   ├── types           # TypeScript type definitions
│   └── utils           # Utility functions
└── tooling             # Developer tooling configuration
```

## Atomic Design Structure

This project follows atomic design principles, which organize components based on their complexity and purpose:

### Atoms

Atoms are the basic building blocks of the interface - simple, functional elements that serve as the smallest possible components. Examples include:

- Buttons
- Inputs
- Labels
- Icons
- Typography elements

### Molecules

Molecules are groups of atoms bonded together to form a functional unit:

- Form fields (label + input)
- Search bars (input + button)
- Cards
- Dialogs

### Organisms

Organisms are complex UI components composed of groups of molecules and/or atoms:

- Headers
- Footers
- Sidebars
- Complex forms

### Templates

Templates are page-level objects that place components into a layout:

- Dashboard layouts
- Page layouts
- Application frames

## Other Key Directories

### `src/app`

App Router for Next.js 13+. This contains page components and routing structure.

### `src/contexts`

React Context providers for state management.

### `src/hooks`

Custom React hooks for shared functionality.

### `src/utils`

Utility functions and helpers.

### `documentation`

Project documentation including coding standards, architectural decisions, and feature specifications. 