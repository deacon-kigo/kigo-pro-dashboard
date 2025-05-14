"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@/components/atoms/Label";
import { Checkbox } from "@/components/ui/checkbox";
import { CampaignDistribution } from "@/lib/redux/slices/campaignSlice";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Check } from "lucide-react";

interface DistributionStepProps {
  formData: CampaignDistribution;
  updateDistribution: (data: Partial<CampaignDistribution>) => void;
  setStepValidation: (isValid: boolean) => void;
}

const DistributionStep: React.FC<DistributionStepProps> = ({
  formData,
  updateDistribution,
  setStepValidation,
}) => {
  // Distribution channels
  const channelOptions = [
    {
      id: "top",
      label: "TOP",
      description:
        "Premium placement at the top of Kigo partner platforms for maximum visibility",
    },
    {
      id: "local_plus",
      label: "Local+",
      description:
        "Geographically targeted distribution to relevant local audiences",
    },
    {
      id: "airdrop",
      label: "Airdrop",
      description:
        "Direct delivery to selected user segments based on preferences",
    },
  ];

  // This step is optional, so it's always valid
  useEffect(() => {
    setStepValidation(true);
  }, [setStepValidation]);

  // Toggle channel selection
  const toggleChannel = (channelId: string) => {
    const updatedChannels = formData.channels.includes(channelId)
      ? formData.channels.filter((id) => id !== channelId)
      : [...formData.channels, channelId];

    updateDistribution({ channels: updatedChannels });
  };

  // Select all channels
  const selectAllChannels = () => {
    updateDistribution({
      channels: channelOptions.map((channel) => channel.id),
    });
  };

  return (
    <div className="space-y-6">
      {/* Distribution Channels */}
      <div className="border rounded-md p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-medium">Distribution Channels</h4>
            <p className="text-sm text-muted-foreground">
              Select the channels through which your campaign will be
              distributed.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={selectAllChannels}>
            <Check className="mr-1 h-4 w-4" />
            Select All
          </Button>
        </div>

        <div className="space-y-3 mt-3">
          {channelOptions.map((channel) => (
            <div
              key={channel.id}
              className={`p-3 border rounded-md cursor-pointer transition-all ${
                formData.channels.includes(channel.id)
                  ? "border-primary bg-primary/5"
                  : "hover:border-muted-foreground"
              }`}
              onClick={() => toggleChannel(channel.id)}
            >
              <div className="flex items-start">
                <Checkbox
                  id={`channel-${channel.id}`}
                  checked={formData.channels.includes(channel.id)}
                  className="mt-1 mr-2"
                />
                <div>
                  <Label
                    htmlFor={`channel-${channel.id}`}
                    className="font-medium cursor-pointer"
                  >
                    {channel.label}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    {channel.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DistributionStep;
