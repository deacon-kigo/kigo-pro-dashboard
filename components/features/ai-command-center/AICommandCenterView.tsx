"use client";

import { useSearchParams } from "next/navigation";
import { TuckerAIChatInterface } from "./TuckerAIChatInterface";

const CONVERSATION_FLOWS = {
  "new-mover-journey":
    "Create an AI-powered new mover journey campaign for Q4. I want to target new mortgage customers with personalized gifts and moving-related offers from partners like U-Haul, Public Storage, and Hilton.",
  "starbucks-campaign":
    "Create a Starbucks Coffee Switch conquesting campaign targeting 50,000 members with competitor coffee purchases. Include 1,000 bonus points offer and geofenced delivery near Starbucks locations.",
  "visual-demo":
    "Create a complete campaign for home buyers with interactive visual experience including data discovery, analysis charts, architecture design, and strategy optimization with live dashboard.",
  "back-to-school":
    "Design a back-to-school campaign for families with children targeting school supplies, clothing, and electronics.",
  "weekend-dining":
    "Build a weekend dining and entertainment campaign focusing on restaurants, activities, and local experiences.",
};

export default function AICommandCenterView() {
  const searchParams = useSearchParams();
  const promptKey = searchParams.get("prompt");
  const clientKey = searchParams.get("client");

  console.log(
    "AICommandCenterView - promptKey:",
    promptKey,
    "clientKey:",
    clientKey
  );

  const initialPrompt =
    promptKey &&
    CONVERSATION_FLOWS[promptKey as keyof typeof CONVERSATION_FLOWS]
      ? CONVERSATION_FLOWS[promptKey as keyof typeof CONVERSATION_FLOWS]
      : "Create an AI-powered new mover journey campaign for Q4. I want to target new mortgage customers with personalized gifts and moving-related offers from partners like U-Haul, Public Storage, and Hilton.";

  console.log("AICommandCenterView - Using initial prompt:", initialPrompt);

  return (
    <TuckerAIChatInterface
      onClose={() => {
        // Navigate back to previous page or dashboard
        window.history.back();
      }}
      initialPrompt={initialPrompt}
    />
  );
}
