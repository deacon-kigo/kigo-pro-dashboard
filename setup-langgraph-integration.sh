#!/bin/bash
echo "🔗 Setting up LangGraph Integration for Kigo Pro"
echo "================================================"

echo ""
echo "📝 Add these environment variables to your .env.local file:"
echo ""
echo "# CopilotKit Backend Configuration"
echo "REMOTE_ACTION_URL=http://localhost:8000/copilotkit"
echo ""
echo "# OpenAI Configuration (required)"
echo "OPENAI_API_KEY=your_openai_api_key_here"
echo ""
echo "# Optional: LangSmith tracing"
echo "LANGSMITH_API_KEY=your_langsmith_api_key_here"
echo "LANGCHAIN_TRACING_V2=true"
echo ""

echo "🐍 Installing required Python packages..."
cd backend
pip install copilotkit fastapi uvicorn[standard]

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the integrated system:"
echo "1. Start LangGraph backend: cd backend && python copilotkit_server.py"
echo "2. Start frontend: npm run dev"
echo ""
echo "💡 Your existing frontend actions will now be available to LangGraph agents!" 