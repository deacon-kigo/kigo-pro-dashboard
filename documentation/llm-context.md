# Kigo Project Context For LLM Assistants

## Repository Overview

This repository (`/Users/dpoon/Documents/Kigo/Repo`) contains three distinct but related projects:

1. **Kigo Admin Tools** - Production repository for the Kigo Pro software
2. **Kigo Pro Dashboard** - A prototype/demo environment that will be renamed to "Kigo Admin Tool Prototype"
3. **Kigo Web SDKs** - Contains the design system with brand colors and styling guidelines

## Project Relationships & Purposes

### 1. Kigo Pro Dashboard (Prototype Repository)
- **Current Focus**: This is the repository we're actively working in
- **Purpose**: 
  - Demo environment for showcasing capabilities
  - Design canvas for UI experimentation
  - UI component library/source of truth
  - Reference implementation
- **Target Users**: Internal teams, design reviewers, and product stakeholders
- **Code Philosophy**:
  - Components should be highly composable
  - Built using atomic design principles (atoms, molecules, organisms, templates)
  - Well-documented
  - Easily extractable for use in the production repository
- **Current Initiative**: 
  - Migrating from a flat directory structure to a proper `/src` directory structure
  - All code is temporarily duplicated between root and `/src` while we migrate imports

### 2. Kigo Admin Tools (Production Repository)
- **Purpose**: 
  - Production-ready implementation of the Kigo Pro software
  - Final destination for battle-tested components from the prototype
- **Target Users**: External customers, actual end users
- **Relationship to Prototype**:
  - Receives refined components from the prototype repository
  - Developers will "pull" components from the prototype for production use
  - Should implement optimized, production-ready versions of prototype components

### 3. Kigo Web SDKs (Design System Repository)
- **Purpose**:
  - Houses the design system and brand guidelines
  - Contains core design tokens, colors, spacing rules, etc.
- **Future Plan**: 
  - The design system will be incorporated into the prototype app
  - Will ensure consistent design application across all Kigo products

## Development Workflow

1. **Design System Definition** (Kigo Web SDKs)
   - Define brand elements, design tokens, and core styles

2. **Component Prototyping** (Kigo Pro Dashboard)
   - Create and refine components using the design system
   - Test in various demo scenarios
   - Document usage patterns and composition strategies

3. **Production Implementation** (Kigo Admin Tools)
   - Front-end developers extract components from the prototype
   - Implement in the production environment with necessary adaptations
   - Optimize for performance and real-world use cases

## Component Philosophy

All UI components should be:

1. **Composable** - Can be combined with other components in various configurations
2. **Extensible** - Easy to extend with additional functionality
3. **Reusable** - Designed for multiple use cases
4. **Documented** - Clear usage examples and guidelines
5. **Consistent** - Follow established design patterns
6. **Accessible** - Meet WCAG guidelines
7. **Performant** - Optimized for speed and efficiency

## Current Migration Context

We are currently migrating the Kigo Pro Dashboard (prototype) from a flat structure to a src-based structure:

- Original paths: `@/components/*`, `@/lib/*`, etc.
- New paths: `@/src/components/*`, `@/src/lib/*`, etc.
- Using component-by-component approach rather than symbolic links
- Working in a dedicated `src-migration` branch
- Both locations contain identical files until migration is complete
- TypeScript path aliases are configured to support both structures during transition

## Technology Stack

- **Frontend Framework**: Next.js
- **Styling**: Tailwind CSS with custom configuration
- **Component Structure**: Atomic Design Methodology
- **State Management**: Redux (for complex state)
- **TypeScript**: For type safety and better developer experience

## Development Priorities

1. Maintain visual consistency with design system
2. Create reusable patterns that can be easily transferred to production
3. Document component usage and composition patterns
4. Ensure accessibility compliance
5. Optimize for developer experience and maintainability

This document serves as a quick reference for LLM assistants to understand the context and purpose of the Kigo projects when starting new chat sessions in Cursor. 