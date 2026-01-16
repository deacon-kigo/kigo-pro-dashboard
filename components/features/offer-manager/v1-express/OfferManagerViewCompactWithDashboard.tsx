"use client";

import React, { useState, useEffect } from "react";
import OfferManagerDashboardV1 from "../v1/OfferManagerDashboardV1";
import OfferManagerViewCompact from "./OfferManagerViewCompact";

interface OfferManagerViewCompactWithDashboardProps {
  onCreatingChange?: (isCreating: boolean) => void;
  autoStart?: boolean;
}

export default function OfferManagerViewCompactWithDashboard({
  onCreatingChange,
  autoStart = false,
}: OfferManagerViewCompactWithDashboardProps = {}) {
  const [isCreatingOffer, setIsCreatingOffer] = useState(autoStart);

  // Notify parent when creating state changes
  useEffect(() => {
    onCreatingChange?.(isCreatingOffer);
  }, [isCreatingOffer, onCreatingChange]);

  const handleStartCreation = () => {
    setIsCreatingOffer(true);
  };

  const handleBackToDashboard = () => {
    setIsCreatingOffer(false);
  };

  // Show dashboard when not creating
  if (!isCreatingOffer) {
    return <OfferManagerDashboardV1 onCreateOffer={handleStartCreation} />;
  }

  // Show compact creation form when creating
  return (
    <OfferManagerViewCompact
      onCreatingChange={onCreatingChange}
      autoStart={true}
      onBackToDashboard={handleBackToDashboard}
    />
  );
}
