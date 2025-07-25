# CopilotKit Quick Start Guide

## TL;DR - Working Implementation Pattern

✅ **Architecture**: Frontend actions called directly by AI  
✅ **Backend**: Minimal CopilotRuntime  
✅ **Actions**: Registered via `useCopilotAction` hooks  
✅ **State**: Direct Redux/React state updates

## Essential Files Structure

```
src/
├── hooks/
│   └── useCopilotActions.ts     # 🎯 Core action definitions
├── providers/
│   └── CopilotProvider.tsx      # Integration & context
├── app/api/copilotkit/
│   └── route.ts                 # Minimal backend runtime
└── components/ui/
    └── ApprovalUI.tsx           # Human-in-loop components
```

## Implementation Steps

### 1. Install Dependencies

```bash
npm install @copilotkit/react-core @copilotkit/react-ui @copilotkit/runtime
```

### 2. Create Action Hook

```typescript
// hooks/useCopilotActions.ts
import { useCopilotAction } from "@copilotkit/react-core";
import { useRouter } from "next/navigation";

export function useCopilotActions() {
  const router = useRouter();

  useCopilotAction({
    name: "navigateToPage",
    description: "Navigate user to a specific page in the application",
    parameters: [
      {
        name: "page",
        type: "string",
        description: "Page to navigate to (dashboard, settings, profile, etc.)",
        required: true,
      },
    ],
    handler: async ({ page }) => {
      router.push(`/${page}`);
      return `Navigated to ${page}. How can I help you here?`;
    },
  });

  useCopilotAction({
    name: "createItem",
    description: "Create a new item with provided details",
    parameters: [
      { name: "title", type: "string", required: true },
      { name: "description", type: "string", required: false },
    ],
    handler: async ({ title, description }) => {
      // Your creation logic here
      const newItem = { id: Date.now(), title, description };

      // Update your state (Redux, context, etc.)
      // dispatch(addItem(newItem));

      return `Created "${title}" successfully!`;
    },
  });
}
```

### 3. Setup Provider

```typescript
// providers/CopilotProvider.tsx
"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useCopilotActions } from "../hooks/useCopilotActions";
import { useCopilotReadable } from "@copilotkit/react-core";

export function CopilotProvider({ children }) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      {children}
      <ActionRegistry />
      <CopilotSidebar
        instructions={`You are a helpful AI assistant.

🚀 **ACTIONS - Use These Immediately:**
• Navigation: "go to X" → CALL navigateToPage
• Creation: "create X" → CALL createItem

**CRITICAL**: When users request actions, CALL them immediately - don't just describe!`}
        labels={{
          title: "AI Assistant",
          initial: "Hi! I can help you navigate and create things. What would you like to do?",
        }}
      />
    </CopilotKit>
  );
}

function ActionRegistry() {
  useCopilotActions();

  // Provide app context to AI
  useCopilotReadable({
    description: "Current application state and context",
    value: {
      currentPage: window.location.pathname,
      timestamp: new Date().toISOString(),
      // Add your app state here
    },
  });

  return null;
}
```

### 4. Create API Route

```typescript
// app/api/copilotkit/route.ts
import { NextRequest } from "next/server";
import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const runtime = new CopilotRuntime({
  // Keep empty - let frontend actions handle everything
});

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: new OpenAIAdapter({ openai }),
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
```

### 5. Integrate in App

```typescript
// app/layout.tsx or _app.tsx
import { CopilotProvider } from "../providers/CopilotProvider";

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <CopilotProvider>
          {children}
        </CopilotProvider>
      </body>
    </html>
  );
}
```

## Testing Your Implementation

### Environment Setup

```bash
# Add to .env.local
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_FEATURE_COPILOT_CHAT=true
```

### Test Phrases

```bash
# Start your app
npm run dev

# Try these in the chat:
"navigate to dashboard"     # → Should call navigateToPage
"go to settings"           # → Should call navigateToPage
"create item called Test"  # → Should call createItem
```

### Expected Behavior

✅ **Good**: AI immediately calls actions and performs navigation/creation  
❌ **Bad**: AI responds with "I can help you navigate..." without taking action

## Common Action Patterns

### Navigation Action

```typescript
useCopilotAction({
  name: "navigateToSection",
  parameters: [
    { name: "section", type: "string", required: true },
    { name: "subsection", type: "string", required: false },
  ],
  handler: async ({ section, subsection }) => {
    const path = subsection ? `/${section}/${subsection}` : `/${section}`;
    router.push(path);
    return `Navigated to ${section}${subsection ? ` → ${subsection}` : ""}`;
  },
});
```

### CRUD Action

```typescript
useCopilotAction({
  name: "manageEntity",
  parameters: [
    { name: "action", type: "string", required: true }, // create, update, delete
    { name: "entityType", type: "string", required: true },
    { name: "data", type: "object", required: true },
  ],
  handler: async ({ action, entityType, data }) => {
    switch (action) {
      case "create":
        // dispatch(createEntity({ type: entityType, data }));
        return `Created ${entityType}`;
      case "update":
        // dispatch(updateEntity({ type: entityType, data }));
        return `Updated ${entityType}`;
      case "delete":
        // dispatch(deleteEntity({ type: entityType, id: data.id }));
        return `Deleted ${entityType}`;
    }
  },
});
```

### Approval Action

```typescript
useCopilotAction({
  name: "requestApproval",
  parameters: [
    { name: "action", type: "string", required: true },
    { name: "details", type: "string", required: true },
  ],
  handler: async ({ action, details }) => {
    // Show approval UI
    const approved = await showApprovalDialog({ action, details });

    if (approved) {
      await executeAction(action);
      return `${action} approved and executed.`;
    }
    return `${action} was not approved.`;
  },
});
```

## Debugging Tips

### Check AI Instructions

Make sure your instructions emphasize **calling actions**:

```typescript
// ✅ Good
"When users want to navigate, CALL navigateToPage immediately";

// ❌ Bad
"I can help you navigate to different pages";
```

### Verify Action Registration

```typescript
// Add logging to confirm actions are registered
useCopilotAction({
  name: "testAction",
  handler: async (params) => {
    console.log("Action called with:", params);
    return "Action executed successfully";
  },
});
```

### Context Debugging

```typescript
useCopilotReadable({
  description: "Debug info",
  value: {
    currentPage: pathname,
    debug: "Actions should be available",
    timestamp: Date.now(),
  },
});
```

## Next Steps

1. **Add More Actions**: Expand based on your app's needs
2. **State Integration**: Connect actions to your state management
3. **Error Handling**: Add try-catch blocks in action handlers
4. **Generative UI**: Return React components from actions
5. **Testing**: Write tests for action handlers

---

_Ready to build powerful AI-integrated applications with CopilotKit!_
