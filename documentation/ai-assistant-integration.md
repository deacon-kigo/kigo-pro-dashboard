# AI Assistant Integration with LangChain

This document outlines the integration of LangChain with the Kigo Pro Dashboard's AI Assistant, specifically for the Product Filter feature.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [LangChain Services](#langchain-services)
- [Redux Integration](#redux-integration)
- [Redux Serialization](#redux-serialization)
- [AI Assistant Panel Component](#ai-assistant-panel-component)
- [Product Filter Integration](#product-filter-integration)
- [Extending to Other Features](#extending-to-other-features)

## Architecture Overview

The AI Assistant architecture consists of these main components:

1. **LangChain Services** - A set of services for interacting with AI models
2. **Redux State Management** - Stores AI assistant state and messages
3. **Redux Middleware** - Processes AI assistant actions and integrates with LangChain
4. **AIAssistantPanel Component** - The UI component for the chat interface
5. **Feature-specific Integrations** - Context-aware AI assistance for specific features

The architecture follows these principles:

- Clear separation of concerns
- Context-awareness based on current feature
- Extensibility for adding new features
- Reusability of the AI Assistant component

## LangChain Services

LangChain services are organized in the `services/ai` directory:

```
services/ai/
├── config.ts         # Configuration for AI model providers
├── tools.ts          # LangChain tools for specific tasks
├── chat.ts           # Chat service for conversation management
├── hooks.ts          # React hooks for using AI services
└── index.ts          # Main export file
```

### Configuration Service (`config.ts`)

Handles configuration for different AI model providers (OpenAI, Anthropic) and provides default model selection based on environment variables.

### Tools Service (`tools.ts`)

Defines specialized LangChain tools for product filter tasks:

1. `createProductFilterCriteriaTool` - Generates appropriate criteria values
2. `createFilterNameSuggestionTool` - Suggests product filter names
3. `createFilterAnalysisTool` - Analyzes existing filter criteria
4. `createFilterConversationGuideTool` - Guides the conversation about product filters

### Chat Service (`chat.ts`)

Provides a class for managing chat conversations with:

- Message history management
- System prompt configuration
- Sending messages and processing responses

### Hooks (`hooks.ts`)

React hooks for integrating AI services into components:

- `useChat` - For using the chat service
- `useProductFilterGenerator` - For generating product filter criteria
- `useFilterNameSuggestions` - For suggesting filter names
- `useFilterAnalysis` - For analyzing filter criteria

## Redux Integration

The AI assistant integrates with Redux for state management:

### AI Assistant Slice (`lib/redux/slices/ai-assistantSlice.ts`)

Defines the Redux state for the AI assistant:

- Message history
- Processing status
- System prompt
- Error state
- Context information (including `currentCriteria` for product filters)

Provides actions for:

- Adding messages
- Setting system prompt
- Setting product filter context (now includes `currentCriteria` and _does not_ reset messages)
- Managing processing state

### AI Assistant Middleware (`lib/redux/middleware/ai-assistantMiddleware.ts`)

Processes AI assistant actions:

- Handles message submissions
- Integrates with LangChain services
- Processes option selections
- Generates responses based on context

## Redux Serialization

Redux requires that all state and action data be serializable. This presents challenges when working with objects like Date instances. We've implemented a serialization strategy to handle this requirement:

### Product Filter State Serialization

The `ProductFilterState` interface ensures all data is serializable:

```tsx
export interface ProductFilterState {
  filterName: string;
  queryViewName: string;
  description: string;
  expiryDate: string | null; // Stored as ISO string, not Date object
  criteria: FilterCriteria[];
  isGenerating: boolean;
  lastGeneratedFilter: string | null;
}
```

### Serialization Helper Function

A helper function ensures all properties are serializable:

```tsx
const ensureSerializable = <T>(obj: T): T => {
  // If it's null or undefined, return as is
  if (obj === null || obj === undefined) return obj;

  // If it's a Date, convert to ISO string
  if (obj instanceof Date) return obj.toISOString() as unknown as T;

  // If it's an array, process each element
  if (Array.isArray(obj)) return obj.map(ensureSerializable) as unknown as T;

  // If it's an object, process each property
  if (typeof obj === "object") {
    const result = {} as T;
    Object.entries(obj).forEach(([key, value]) => {
      result[key as keyof T] = ensureSerializable(value);
    });
    return result;
  }

  // Otherwise return as is (for primitives)
  return obj;
};
```

### Action Creators for Date Handling

Custom action creators ensure proper date serialization:

```tsx
// Create a properly typed action creator for expiryDate
export const setExpiryDate = createAction<Date | null>(
  "productFilter/setExpiryDate"
);

// Handle the action in extraReducers to apply serialization
extraReducers: (builder) => {
  builder.addCase(setExpiryDate, (state, action) => {
    state.expiryDate = action.payload ? action.payload.toISOString() : null;
  });
};
```

### UI/Redux Boundary Handling

Components like DatePicker handle the conversion between Redux string format and Date objects:

```tsx
// UI component receives date as string from Redux
const expiryDateStr = useSelector(
  (state: RootState) => state.productFilter.expiryDate
);

// Convert to Date for UI
const expiryDate = expiryDateStr ? new Date(expiryDateStr) : null;

// When date changes, dispatch action with Date object
const handleDateSelect = (date: Date | null) => {
  dispatch(setExpiryDate(date));
};
```

## AI Assistant Panel Component

The `AIAssistantPanel` component (`components/features/ai/AIAssistantPanel.tsx`) provides the chat interface:

- Message display with Markdown support
- Response option buttons
- User input handling
- Scrolling behavior
- Loading states

The component can operate in two modes based on `clientId` and `pathname`:

1. **Demo Mode** - Uses local component state and hardcoded responses/flows for demo scenarios.
2. **LangChain Mode (Simulated)** - (e.g., for Product Filters) Uses Redux state. Sends user messages + context (including current criteria) to Redux. Currently simulates a conversational AI flow:
   - Detects basic entities in user input.
   - Checks against required criteria.
   - Asks clarifying questions for missing required info.
   - Proposes filter generation with confirmation options.
   - Sends structured commands (`apply_updates:`) to the parent component for form manipulation.
     _Note: The actual LangChain backend call is currently simulated._

## Product Filter Integration

The Product Filter feature integrates with the AI assistant:

### Product Filter Creation View

The `ProductFilterCreationView` component integrates the AI assistant:

- Displays the assistant in a side panel
- Initializes the product filter context by dispatching `setProductFilterContext` with `filterName`, `filterDescription`, and the current `filterCriteria`.
- Handles commands from the AI Assistant Panel via the `handleOptionSelected` function to update the form state.

### Data Flow

The bidirectional data flow between the Product Filter UI and AI Assistant:

1. **UI to AI Assistant**: Filter state from the right side UI is shared with the AI assistant through Redux

   - Filter form values (name, queryView, description, etc.) flow to the global Redux state
   - Updates trigger the `setProductFilterContext` action which makes the data available to the AI assistant

2. **AI Assistant to UI**: The assistant can suggest and apply changes to the filter
   - The AI assistant sends commands through option selection (e.g., "apply_updates:")
   - These commands are processed in `handleOptionSelected` to update the Redux state
   - Redux state changes then flow back to the UI components

### Initialization

The context is updated whenever the relevant state changes in the view:

```tsx
// Update AI assistant context (includes criteria)
useEffect(() => {
  dispatch(
    setProductFilterContext({
      filterName,
      filterDescription: description,
      currentCriteria: filterCriteria, // Includes criteria
    })
  );
}, [dispatch, filterName, description, filterCriteria]); // Dependencies updated
```

### Option/Command Handling

The `handleOptionSelected` function now handles more structured commands from the AI assistant, including direct updates with proper serialization:

```tsx
// Handle option selected/commands from AI Assistant
if (optionId.startsWith("apply_updates:")) {
  dispatch(setIsGenerating(true));

  try {
    // Extract the JSON payload from the option ID
    const updatesJson = optionId.replace("apply_updates:", "");
    const updates = JSON.parse(updatesJson);

    // Dispatch action to update the filter in Redux store
    dispatch(
      applyFilterUpdate({
        filterName: updates.filterName,
        queryViewName: updates.queryViewName,
        criteriaToAdd: updates.criteriaToAdd,
        expiryDate: updates.expiryDate
          ? new Date(updates.expiryDate) // Convert string to Date at the boundary
          : undefined,
      })
    );

    // Set last generated filter for UI feedback
    dispatch(setLastGeneratedFilter("complete"));
  } catch (error) {
    console.error("Error applying updates:", error);
  } finally {
    dispatch(setIsGenerating(false));
  }
}
```

### AI Middleware Data Access

The middleware accesses the product filter data through selectors:

```tsx
// Get current context from state
const filterName = state.productFilter?.filterName || "";
const filterDescription = state.productFilter?.description || "";
const currentCriteria = state.aiAssistant.currentCriteria || [];
const conversationHistory = state.aiAssistant.messages;

// Access all filter context with a selector
const completeContext = selectCompleteFilterContext(state);
```

## Extending to Other Features

To add AI assistance to a new feature:

1. **Create Context Action**: Add a context-setting action in the AI assistant slice

   ```tsx
   setNewFeatureContext: (state, action: PayloadAction<NewFeatureContext>) => {
     state.systemPrompt = SYSTEM_PROMPTS.NEW_FEATURE_ASSISTANT;
     state.messages = []; // Reset messages

     // Add initial greeting
     state.messages.push({
       id: Date.now().toString(),
       type: "ai",
       content: `I'm your assistant for [New Feature]...`,
       timestamp: new Date().toISOString(),
       responseOptions: [
         // Add appropriate response options
       ],
     });
   };
   ```

2. **Add Option Handlers**: Handle feature-specific option selections in the middleware

   ```tsx
   if (optionId === "new_feature_option") {
     return {
       content: "Response for new feature option...",
       responseOptions: [
         // Add appropriate response options
       ],
     };
   }
   ```

3. **Add Feature-Specific Tools**: Create new LangChain tools in `tools.ts`

   ```tsx
   export const createNewFeatureTool = () => {
     return new DynamicTool({
       name: "new_feature_tool",
       description: "Description of the tool",
       func: async (params) => {
         // Tool implementation
       },
     });
   };
   ```

4. **Integrate in Feature Component**: Add the AI assistant to the feature component

   ```tsx
   // Initialize AI assistant context
   useEffect(() => {
     dispatch(
       setNewFeatureContext({
         // Context information with serializable values
       })
     );
   }, [dispatch /* dependencies */]);
   ```

5. **Ensure Serialization**: Make sure all state passed to Redux is serializable
   - Convert Date objects to ISO strings
   - Use action creators with proper serialization
   - Handle conversion at UI/Redux boundaries
