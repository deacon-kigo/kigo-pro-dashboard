"use client";

import React from "react";
import { Label } from "@/components/atoms/Label";
import { Checkbox } from "@/components/atoms/Checkbox";
import { CampaignDistribution } from "@/lib/redux/slices/campaignSlice";
import { Badge } from "@/components/atoms/Badge";

interface DistributionFormProps {
  formData: CampaignDistribution;
  updateDistribution: (data: Partial<CampaignDistribution>) => void;
}

const DistributionForm: React.FC<DistributionFormProps> = ({
  formData,
  updateDistribution,
}) => {
  // Channel options
  const channelOptions = [
    { id: "email", label: "Email", icon: "📧" },
    { id: "social", label: "Social Media", icon: "👥" },
    { id: "display", label: "Display Ads", icon: "🖼️" },
    { id: "search", label: "Search Ads", icon: "🔍" },
    { id: "inapp", label: "In-App", icon: "📱" },
  ];

  // Program options
  const programOptions = [
    { id: "loyalty", label: "Loyalty Program", icon: "🏆" },
    { id: "referral", label: "Referral Program", icon: "👋" },
    { id: "rewards", label: "Rewards Program", icon: "🎁" },
  ];

  // Handle channel selection
  const handleChannelChange = (channelId: string, isChecked: boolean) => {
    const updatedChannels = isChecked
      ? [...formData.channels, channelId]
      : formData.channels.filter((id) => id !== channelId);
    updateDistribution({ channels: updatedChannels });
  };

  // Handle program selection
  const handleProgramChange = (programId: string, isChecked: boolean) => {
    const updatedPrograms = isChecked
      ? [...formData.programs, programId]
      : formData.programs.filter((id) => id !== programId);
    updateDistribution({ programs: updatedPrograms });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Distribution Channels</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Choose how and where your campaign will be distributed
        </p>
      </div>

      {/* Distribution Channels */}
      <div className="space-y-4">
        <Label>Channels*</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {channelOptions.map((channel) => (
            <div
              key={channel.id}
              className="flex items-center space-x-3 rounded-md border p-3"
            >
              <Checkbox
                id={`channel-${channel.id}`}
                checked={formData.channels.includes(channel.id)}
                onCheckedChange={(checked) =>
                  handleChannelChange(channel.id, checked === true)
                }
              />
              <div className="flex flex-1 items-center justify-between">
                <label
                  htmlFor={`channel-${channel.id}`}
                  className="flex items-center cursor-pointer"
                >
                  <span className="mr-2">{channel.icon}</span>
                  <span>{channel.label}</span>
                </label>
                {formData.channels.includes(channel.id) && (
                  <Badge variant="outline">Selected</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Select distribution channels for your campaign
        </p>
      </div>

      {/* Loyalty Programs */}
      <div className="space-y-4">
        <Label>Loyalty Programs</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {programOptions.map((program) => (
            <div
              key={program.id}
              className="flex items-center space-x-3 rounded-md border p-3"
            >
              <Checkbox
                id={`program-${program.id}`}
                checked={formData.programs.includes(program.id)}
                onCheckedChange={(checked) =>
                  handleProgramChange(program.id, checked === true)
                }
              />
              <div className="flex flex-1 items-center justify-between">
                <label
                  htmlFor={`program-${program.id}`}
                  className="flex items-center cursor-pointer"
                >
                  <span className="mr-2">{program.icon}</span>
                  <span>{program.label}</span>
                </label>
                {formData.programs.includes(program.id) && (
                  <Badge variant="outline">Selected</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Optional: Add loyalty programs to your campaign
        </p>
      </div>
    </div>
  );
};

export default DistributionForm;
