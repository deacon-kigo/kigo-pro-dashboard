#!/usr/bin/env node

/**
 * Test LangGraph-CopilotKit Integration
 *
 * This script tests the connection between frontend and your LangGraph supervisor
 */

const BASE_URL = "http://localhost:3001";
const BACKEND_URL = "http://localhost:8000";

async function testBackendHealth() {
  console.log("🧪 Testing LangGraph backend health...");

  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    if (response.ok) {
      const data = await response.json();
      console.log("✅ Backend health:", data);
      return true;
    } else {
      console.log("❌ Backend health check failed");
      return false;
    }
  } catch (error) {
    console.log("❌ Backend connection failed:", error.message);
    return false;
  }
}

async function testCopilotKitEndpoint() {
  console.log("🧪 Testing CopilotKit endpoint...");

  try {
    const response = await fetch(`${BACKEND_URL}/copilotkit`);
    console.log("📊 CopilotKit endpoint status:", response.status);
    return response.status === 405; // Should return Method Not Allowed for GET
  } catch (error) {
    console.log("❌ CopilotKit endpoint test failed:", error.message);
    return false;
  }
}

async function testFrontendToCopilotKit() {
  console.log("🧪 Testing frontend CopilotKit connection...");

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

    console.log("📊 Frontend response status:", response.status);

    if (response.ok) {
      console.log("✅ Frontend to CopilotKit connection working");
      return true;
    } else {
      const errorText = await response.text();
      console.log("❌ Frontend connection failed:", errorText);
      return false;
    }
  } catch (error) {
    console.log("❌ Frontend connection failed:", error.message);
    return false;
  }
}

async function runIntegrationTests() {
  console.log("🚀 Testing LangGraph-CopilotKit Integration\n");

  const backendOk = await testBackendHealth();
  console.log("");

  const copilotKitOk = await testCopilotKitEndpoint();
  console.log("");

  if (!backendOk) {
    console.log("❌ Backend must be running first!");
    console.log("💡 Start it with: cd backend && python copilotkit_server.py");
    return;
  }

  const frontendOk = await testFrontendToCopilotKit();
  console.log("");

  if (backendOk && copilotKitOk && frontendOk) {
    console.log("🎉 LangGraph Integration working successfully!");
    console.log(
      "💡 Your frontend actions are now available to LangGraph agents!"
    );
  } else {
    console.log("❌ Integration has issues. Check the logs above.");
  }

  console.log("\n📋 Next steps:");
  console.log("   1. Try asking the AI: 'Create a McDonald's ad'");
  console.log("   2. Watch your LangGraph supervisor route the request");
  console.log("   3. See your frontend actions execute via the agents");
  console.log("   4. Check LangSmith traces if configured");
}

// Run the tests
runIntegrationTests().catch(console.error);
