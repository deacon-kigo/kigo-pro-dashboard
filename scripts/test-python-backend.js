#!/usr/bin/env node

/**
 * Test Python LangGraph Backend Connection
 *
 * This script tests the connection between the frontend and Python backend.
 */

const BASE_URL = "http://localhost:8000";

async function testBackendConnection() {
  console.log("🐍 Testing Python LangGraph Backend Connection...\n");

  try {
    // Test 1: Health Check
    console.log("1. Testing health endpoint...");
    const healthResponse = await fetch(`${BASE_URL}/health`);

    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log("✅ Health check passed:", healthData);
    } else {
      console.log("❌ Health check failed:", healthResponse.status);
      return;
    }

    // Test 2: Chat Endpoint
    console.log("\n2. Testing chat endpoint...");
    const chatResponse = await fetch(`${BASE_URL}/api/copilotkit/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Hello, I want to create an ad",
        context: {
          currentPage: "/dashboard",
          userRole: "admin",
          campaignData: {},
          sessionId: "test_session_123",
        },
      }),
    });

    if (chatResponse.ok) {
      const chatData = await chatResponse.json();
      console.log("✅ Chat endpoint working:");
      console.log("   Message:", chatData.message?.substring(0, 100) + "...");
      console.log(
        "   Has Actions:",
        !!(
          chatData.actions?.length ||
          chatData.workflow_data?.pending_actions?.length
        )
      );
      console.log("   Requires Approval:", !!chatData.requires_approval);

      if (chatData.requires_approval) {
        console.log("   🔔 Human-in-the-loop workflow detected!");
      }
    } else {
      console.log("❌ Chat endpoint failed:", chatResponse.status);
      const errorText = await chatResponse.text();
      console.log("   Error:", errorText);
      return;
    }

    console.log("\n🎉 Python backend is working correctly!");
    console.log("📝 Next steps:");
    console.log("   1. Start your Next.js frontend: npm run dev");
    console.log(
      "   2. Ensure NEXT_PUBLIC_COPILOT_RUNTIME_URL=http://localhost:8000"
    );
    console.log('   3. Open the chat and try: "I want to create an ad"');
    console.log("   4. Check for approval workflows and action execution");
  } catch (error) {
    console.log("❌ Connection failed:", error.message);
    console.log("\n💡 Make sure:");
    console.log(
      "   1. Python backend is running: cd backend && python main.py"
    );
    console.log("   2. Backend is accessible at http://localhost:8000");
    console.log("   3. CORS is properly configured");
  }
}

// Run the test
testBackendConnection();
