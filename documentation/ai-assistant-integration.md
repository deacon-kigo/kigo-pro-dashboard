# AI Assistant Integration with LangChain

This document outlines the integration of LangChain with the Kigo Pro Dashboard's AI Assistant, specifically for the Product Filter feature.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [LangChain Services](#langchain-services)
- [Redux Integration](#redux-integration)
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
- Context information

Provides actions for:

- Adding messages
- Setting system prompt
- Setting product filter context
- Managing processing state

### AI Assistant Middleware (`lib/redux/middleware/ai-assistantMiddleware.ts`)

Processes AI assistant actions:

- Handles message submissions
- Integrates with LangChain services
- Processes option selections
- Generates responses based on context

## AI Assistant Panel Component

The `AIAssistantPanel` component (`components/features/ai/AIAssistantPanel.tsx`) provides the chat interface:

- Message display with Markdown support
- Response option buttons
- User input handling
- Scrolling behavior
- Loading states

The component can operate in two modes:

1. **Demo Mode** - Uses hardcoded responses for demo scenarios
2. **LangChain Mode** - Uses LangChain services for real AI responses

It automatically detects the appropriate mode based on the current route.

## Product Filter Integration

The Product Filter feature integrates with the AI assistant:

### Product Filter Creation View

The `ProductFilterCreationView` component integrates the AI assistant:

- Displays the assistant in a side panel
- Initializes the product filter context
- Handles option selections to update the form

### Initialization

```tsx
// Initialize AI assistant with product filter context
useEffect(() => {
  dispatch(
    setProductFilterContext({
      filterName,
      filterDescription: description,
    })
  );
}, [dispatch, filterName, description]);
```

### Option Handling

```tsx
// Handle option selected from AI Assistant
const handleOptionSelected = (optionId: string) => {
  // Handle different AI suggestions for product filters
  if (optionId.startsWith("suggest_name:")) {
    const suggestedName = optionId.replace("suggest_name:", "");
    setFilterName(suggestedName);
  } else if (optionId.startsWith("suggest_criteria:")) {
    // Parse criteria data from option ID
    const criteriaData = JSON.parse(optionId.replace("suggest_criteria:", ""));
    setCriteriaType(criteriaData.type);
    setCriteriaValue(criteriaData.value);
    setCriteriaOperator(criteriaData.operator || "equals");
  }
};
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
       timestamp: new Date(),
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
         // Context information
       })
     );
   }, [dispatch]);

   return (
     <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
       {/* Feature UI */}
       <div className="lg:col-span-8">{/* Feature content */}</div>

       {/* AI Assistant Panel */}
       <div className="lg:col-span-4">
         <Card className="h-full p-0 overflow-hidden flex flex-col">
           <AIAssistantPanel
             onOptionSelected={handleOptionSelected}
             className="h-full"
           />
         </Card>
       </div>
     </div>
   );
   ```
