#!/usr/bin/env node

/**
 * Test CopilotKit to LangGraph Server Integration
 *
 * This script tests the fixed integration between CopilotKit and LangGraph Server
 */

const BASE_URL = "http://localhost:3000";
const LANGGRAPH_URL = "http://localhost:8000";

async function testLangGraphServer() {
  console.log("🧪 Testing LangGraph Server directly...");

  try {
    const response = await fetch(`${LANGGRAPH_URL}/docs`);
    if (response.ok) {
      console.log("✅ LangGraph Server is running");
      return true;
    } else {
      console.log("❌ LangGraph Server not responding");
      return false;
    }
  } catch (error) {
    console.log("❌ LangGraph Server connection failed:", error.message);
    return false;
  }
}

async function testCopilotKitRoute() {
  console.log("🧪 Testing CopilotKit route...");

  const testMessage = {
    messages: [
      { role: "user", content: "Hello, can you help me create a campaign?" },
    ],
    threadId: `test_${Date.now()}`,
  };

  try {
    const response = await fetch(`${BASE_URL}/api/copilotkit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testMessage),
    });

    console.log("📊 Response status:", response.status);
    console.log(
      "📊 Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (response.ok) {
      console.log("✅ CopilotKit route is working");

      // Test streaming response
      const reader = response.body?.getReader();
      if (reader) {
        console.log("🔄 Reading stream...");
        let chunks = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          chunks++;
          const text = new TextDecoder().decode(value);
          console.log(`📦 Chunk ${chunks}:`, text.slice(0, 100) + "...");

          if (chunks >= 3) break; // Limit for testing
        }

        console.log("✅ Streaming response working");
      }

      return true;
    } else {
      const errorText = await response.text();
      console.log("❌ CopilotKit route failed:", errorText);
      return false;
    }
  } catch (error) {
    console.log("❌ CopilotKit route connection failed:", error.message);
    return false;
  }
}

async function runTests() {
  console.log("🚀 Testing CopilotKit → LangGraph Server Integration\n");

  const langGraphOk = await testLangGraphServer();
  console.log("");

  if (!langGraphOk) {
    console.log("❌ LangGraph Server must be running first!");
    console.log("💡 Start it with: npx @langchain/langgraph-cli dev");
    return;
  }

  const copilotKitOk = await testCopilotKitRoute();
  console.log("");

  if (langGraphOk && copilotKitOk) {
    console.log("🎉 Integration working successfully!");
  } else {
    console.log("❌ Integration has issues. Check the logs above.");
  }

  console.log("\n📋 Debugging checklist:");
  console.log("   1. LangGraph Server running on port 8000");
  console.log("   2. Next.js dev server running on port 3000");
  console.log("   3. Check browser console for CopilotKit logs");
  console.log("   4. Check terminal for LangGraph Server logs");
}

// Run the tests
runTests().catch(console.error);
