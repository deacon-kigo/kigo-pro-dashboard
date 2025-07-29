# Kigo Pro Python Backend

FastAPI + LangGraph backend for better Studio integration and Python ecosystem benefits.

## Setup

1. **Install Python dependencies:**

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Create .env file:**

   ```bash
   # Copy from the main project .env.local
   cp ../.env.local .env

   # Or create a new .env with:
   OPENAI_API_KEY=your_key_here
   LANGCHAIN_TRACING_V2=true
   LANGCHAIN_API_KEY=your_langsmith_key_here
   ```

3. **Start the backend:**

   ```bash
   python main.py
   # or
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Start LangGraph Studio:**
   ```bash
   langgraph dev
   ```

## Integration with Frontend

The FastAPI backend provides a CopilotKit-compatible endpoint at:

- `POST /api/copilotkit/chat` - Chat endpoint for CopilotKit integration

To connect the Next.js frontend to this backend, update the CopilotKit configuration to point to `http://localhost:8000`.

## LangGraph Studio

The Python version should have full chat mode support in LangGraph Studio:

- Navigate to the Studio URL shown in the terminal
- Chat mode should work immediately with the `messages` field

## Benefits

- ✅ **Full LangGraph Studio chat mode support**
- ✅ **Better Python ecosystem integration**
- ✅ **Proven FastAPI + LangGraph pattern**
- ✅ **Same business logic as TypeScript version**
- ✅ **Drop-in replacement for existing frontend**
