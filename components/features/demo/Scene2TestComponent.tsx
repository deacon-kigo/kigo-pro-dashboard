"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ABCFIDemoChat } from "./ABCFIDemoChat";
import { CampaignPlanCard } from "./CampaignPlanCard";

/**
 * Test component to verify Scene 2 campaign UI rendering fix
 * This component can be used to test the complete Scene 2 flow
 */
export function Scene2TestComponent() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [testStage, setTestStage] = useState<"initial" | "chat" | "standalone">(
    "initial"
  );

  const handleDashboardTransition = (step: string, data?: any) => {
    console.log("🧪 Test: Dashboard transition called with:", step, data);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Test Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🧪 Scene 2 Campaign UI Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              This test component verifies that the Scene 2 campaign UI renders
              correctly in the Kigo Pro demo chat.
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => setTestStage("chat")}
                variant={testStage === "chat" ? "default" : "outline"}
              >
                Test Chat Flow
              </Button>
              <Button
                onClick={() => setTestStage("standalone")}
                variant={testStage === "standalone" ? "default" : "outline"}
              >
                Test Standalone Component
              </Button>
              <Button
                onClick={() => setTestStage("initial")}
                variant={testStage === "initial" ? "default" : "outline"}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Instructions */}
        {testStage === "chat" && (
          <Card>
            <CardHeader>
              <CardTitle>Interactive Scene 2 Flow Test Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Click "Open Chat" to start the demo chat</li>
                <li>
                  Type: "one of my goals this quarter is to increase engagement
                  among key customer segments"
                </li>
                <li>Wait for the 5 journey cards to appear</li>
                <li>
                  Type: "Home buyers. I met with the mortgage team yesterday and
                  they're looking for significant incremental revenue
                  opportunities."
                </li>
                <li>
                  <strong>Campaign Plan Shows:</strong> AI shows complete
                  campaign plan first
                </li>
                <li>
                  <strong>Step 1 - Gift Configuration:</strong> AI guides Tucker
                  through gift selection
                </li>
                <li>
                  <strong>Step 2 - Customer Journey:</strong> AI moves to
                  journey configuration
                </li>
                <li>
                  <strong>Step 3 - Partner Network:</strong> AI completes with
                  partner selection
                </li>
                <li>
                  <strong>Campaign Complete:</strong> AI confirms campaign is
                  ready to launch
                </li>
              </ol>
              <Button onClick={() => setIsChatOpen(true)} className="mt-4">
                Open Interactive Chat
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Standalone Component Test */}
        {testStage === "standalone" && (
          <Card>
            <CardHeader>
              <CardTitle>Standalone Campaign Plan Component</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                This shows the campaign plan component in isolation to verify it
                renders correctly:
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Compact Version */}
                <div>
                  <h3 className="font-semibold mb-3">
                    Compact Version (used in chat)
                  </h3>
                  <CampaignPlanCard
                    title="New Homeowner Welcome Campaign"
                    isCompact={true}
                    className="max-w-sm"
                  />
                </div>

                {/* Full Version */}
                <div>
                  <h3 className="font-semibold mb-3">Full Version</h3>
                  <CampaignPlanCard
                    title="New Homeowner Welcome Campaign"
                    isCompact={false}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle>Expected Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-green-700">
                  ✅ Success Criteria:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
                  <li>
                    AI shows complete campaign plan immediately after "Excellent
                    choice..."
                  </li>
                  <li>Campaign plan displays all 3 sections properly</li>
                  <li>
                    AI automatically starts step-by-step configuration flow
                  </li>
                  <li>Gift selection UI renders below AI message vertically</li>
                  <li>
                    Each step flows automatically to the next after user input
                  </li>
                  <li>Journey and partner UIs appear in sequence</li>
                  <li>Final success message confirms campaign completion</li>
                  <li>No console errors during the clean flow</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-red-700">
                  ❌ Failure Indicators:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
                  <li>Interactive components don't appear or are broken</li>
                  <li>Steps don't advance after user selections</li>
                  <li>AI responses are missing or incorrect</li>
                  <li>Configuration data isn't passed between steps</li>
                  <li>Console errors about missing handlers or props</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <ABCFIDemoChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onDashboardTransition={handleDashboardTransition}
      />
    </div>
  );
}
