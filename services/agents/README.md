# Kigo Pro AI Agents - LangGraph Studio Setup

## 🎯 Production-First Architecture

Our LangGraph workflow is designed to work seamlessly in both production and LangGraph Studio environments **without separate configurations**.

## 🚀 Using LangGraph Studio

1. **Start Studio**:

   ```bash
   npx @langchain/langgraph-studio
   ```

2. **Select Workflow**:

   - Choose `kigo_supervisor` - this is our **production** workflow
   - Studio will auto-detect the appropriate interface

3. **Test Scenarios**:
   ```
   "Create a new ad campaign"
   "I need help with product filters"
   "Show me analytics for my campaigns"
   "Upload an image for my ad"
   ```

## 🔧 Configuration

- **Config File**: `langgraph.json`
- **Environment**: Uses `.env.local`
- **Tracing**: LangSmith enabled for observability

## 🏗️ Architecture

Our supervisor workflow intelligently handles:

- **Studio Input**: Simple messages → automatically creates context
- **Production Input**: Full Redux state and UI context
- **Agent Routing**: Same logic in both environments
- **State Management**: Unified across environments

**No compromises. No separate workflows. One production-ready system.**
