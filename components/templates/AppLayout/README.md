# AppLayout Component

## Overview

The AppLayout component serves as the main layout wrapper for the Kigo Pro Dashboard application. It provides a consistent layout structure with a responsive sidebar, header, and content area.

## Features

- Fixed sidebar with toggle functionality
- Responsive header that adjusts to sidebar width
- Main content area with proper spacing
- Support for AI Chat and Demo Spotlight features
- Client-side rendering safety for hydration
- CSS variable-based layout coordination

## Usage

```tsx
import AppLayout from "@/components/templates/AppLayout/AppLayout";

export default function MyPage() {
  return (
    <AppLayout>
      {/* Your page content here */}
      <div className="bg-white p-6 rounded-lg">
        <h1>My Page</h1>
        <p>Content goes here...</p>
      </div>
    </AppLayout>
  );
}
```

## Component Structure

The AppLayout consists of:

1. **Sidebar**: Fixed position sidebar with toggle functionality
2. **Header**: Top navigation bar with search and actions
3. **Main Content Area**: Flexible content container with proper spacing
4. **AIChat**: Chat assistant component (hidden by default)
5. **DemoSpotlight**: Demo feature highlighting utility

## Storybook Documentation

The AppLayout has comprehensive Storybook documentation with various configurations:

- Default layout with expanded sidebar
- Collapsed sidebar variation
- Responsive layout demonstration

Please refer to `AppLayout.stories.tsx` for examples of various configurations.

## CSS Variables

The component sets and uses the following CSS variables:

- `--sidebar-width`: Controls the width of the sidebar and content area spacing
