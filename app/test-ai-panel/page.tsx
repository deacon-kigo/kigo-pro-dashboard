"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card/Card";
import { Button } from "@/components/atoms/Button";
import { ExtendedAIAssistantPanel } from "@/components/features/campaigns/ads-create/ExtendedAIAssistantPanel";

export default function TestAIPanel() {
  const [mockFormState, setMockFormState] = useState({
    campaignName: "",
    campaignDescription: "",
    campaignWeight: "",
    startDate: null,
    endDate: null,
    budget: "",
    mediaTypes: [],
    locations: [],
  });

  // Handle AI assistant option selection
  const handleOptionSelected = (optionId: string) => {
    console.log("Option selected:", optionId);
  };

  // Handle form updates from the workflow
  const handleFormUpdate = (updates: Record<string, any>) => {
    console.log("Form updates:", updates);
    setMockFormState((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  // Handle workflow completion
  const handleWorkflowComplete = (results: Record<string, any>) => {
    console.log("Workflow completed with results:", results);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 bg-primary text-white">
        <h1 className="text-xl font-bold">Extended AI Assistant Panel Test</h1>
        <p className="text-sm opacity-80">
          Testing the integration of enhanced workflow visualization with AI
          Assistant
        </p>
      </div>

      <div className="flex-1 p-4 flex gap-4">
        <div className="w-[320px] flex-shrink-0">
          <Card className="p-0 h-full">
            <ExtendedAIAssistantPanel
              title="AI Campaign Assistant"
              description="Design campaigns with AI assistance"
              onOptionSelected={handleOptionSelected}
              initialFormState={mockFormState}
              onFormUpdate={handleFormUpdate}
              onWorkflowComplete={handleWorkflowComplete}
            />
          </Card>
        </div>

        {/* Mock form state visualization */}
        <div className="flex-1">
          <Card className="p-4 h-full">
            <h2 className="text-lg font-medium mb-4">Campaign Form Preview</h2>
            <p className="text-sm text-gray-500 mb-4">
              This shows how the AI workflow updates the form in real-time as
              steps are completed.
            </p>

            <div className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Campaign Name</h3>
                  <p className="mt-1 py-2 px-3 bg-gray-50 rounded border text-sm">
                    {mockFormState.campaignName || "Not set"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium">Campaign Weight</h3>
                  <p className="mt-1 py-2 px-3 bg-gray-50 rounded border text-sm">
                    {mockFormState.campaignWeight || "Not set"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium">Description</h3>
                <p className="mt-1 py-2 px-3 bg-gray-50 rounded border text-sm min-h-[60px]">
                  {mockFormState.campaignDescription || "Not set"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Budget</h3>
                  <p className="mt-1 py-2 px-3 bg-gray-50 rounded border text-sm">
                    {mockFormState.budget
                      ? `$${mockFormState.budget}`
                      : "Not set"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium">Media Types</h3>
                  <div className="mt-1 py-2 px-3 bg-gray-50 rounded border text-sm min-h-[36px]">
                    {mockFormState.mediaTypes &&
                    mockFormState.mediaTypes.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {mockFormState.mediaTypes.map((type, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    ) : (
                      "Not set"
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium">Target Locations</h3>
                <div className="mt-1 py-2 px-3 bg-gray-50 rounded border text-sm min-h-[60px]">
                  {mockFormState.locations &&
                  mockFormState.locations.length > 0 ? (
                    <div className="space-y-1">
                      {mockFormState.locations.map((loc: any, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            {loc.type}
                          </span>
                          <span>{loc.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    "Not set"
                  )}
                </div>
              </div>

              {/* Action button to reset form */}
              <div className="mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMockFormState({
                      campaignName: "",
                      campaignDescription: "",
                      campaignWeight: "",
                      startDate: null,
                      endDate: null,
                      budget: "",
                      mediaTypes: [],
                      locations: [],
                    });
                  }}
                >
                  Reset Form
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
