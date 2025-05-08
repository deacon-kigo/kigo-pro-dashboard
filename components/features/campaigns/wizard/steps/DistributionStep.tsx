"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@/components/atoms/Label";
import { Checkbox } from "@/components/ui/checkbox";
import { CampaignDistribution } from "@/lib/redux/slices/campaignSlice";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/atoms/Select";

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
      id: "email",
      label: "Email",
      description: "Send targeted emails to selected audience segments",
    },
    {
      id: "social",
      label: "Social Media",
      description: "Promote through social media platforms",
    },
    {
      id: "display",
      label: "Display Ads",
      description: "Show banner ads on relevant websites",
    },
    {
      id: "search",
      label: "Search Ads",
      description: "Target users through search engine ads",
    },
    {
      id: "inapp",
      label: "In-App",
      description: "Deliver notifications through mobile applications",
    },
  ];

  // Partners
  const partnerOptions = [
    { id: "google", label: "Google Ads" },
    { id: "meta", label: "Meta (Facebook & Instagram)" },
    { id: "pinterest", label: "Pinterest" },
    { id: "twitter", label: "Twitter" },
  ];

  // Mock Programs data (in production, this would come from Kigo Core Server API)
  const [programs, setPrograms] = useState([
    { id: "program1", label: "Summer Promotion" },
    { id: "program2", label: "Holiday Special" },
    { id: "program3", label: "Back to School" },
    { id: "program4", label: "Spring Sale" },
  ]);

  // Mock Program Campaigns data (in production, this would come from Kigo Core Server API)
  const [programCampaigns, setProgramCampaigns] = useState([
    { id: "campaign1", label: "Q3 2023 Campaign" },
    { id: "campaign2", label: "End of Year Blitz" },
    { id: "campaign3", label: "New Year Kickoff" },
    { id: "campaign4", label: "Summer Flash Sale" },
  ]);

  // Loading states for async data
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false);

  // This step is optional, so it's always valid
  useEffect(() => {
    setStepValidation(true);
  }, [setStepValidation]);

  // Fetch programs and campaign data on component mount
  useEffect(() => {
    // Simulating API calls to Kigo Core Server
    // In production, replace with actual API calls

    setIsLoadingPrograms(true);
    // Mock API call to get programs
    const programsTimer = setTimeout(() => {
      // Programs would be fetched here in production
      setIsLoadingPrograms(false);
    }, 1000);

    setIsLoadingCampaigns(true);
    // Mock API call to get program campaigns
    const campaignsTimer = setTimeout(() => {
      // Program campaigns would be fetched here in production
      setIsLoadingCampaigns(false);
    }, 1500);

    // Cleanup timers
    return () => {
      clearTimeout(programsTimer);
      clearTimeout(campaignsTimer);
    };
  }, []);

  // Toggle channel selection
  const toggleChannel = (channelId: string) => {
    const updatedChannels = formData.channels.includes(channelId)
      ? formData.channels.filter((id) => id !== channelId)
      : [...formData.channels, channelId];

    updateDistribution({ channels: updatedChannels });
  };

  // Toggle partner selection
  const togglePartner = (partnerId: string) => {
    const updatedPartners = formData.partners.includes(partnerId)
      ? formData.partners.filter((id) => id !== partnerId)
      : [...formData.partners, partnerId];

    updateDistribution({ partners: updatedPartners });
  };

  // Toggle program selection
  const toggleProgram = (programId: string) => {
    const updatedPrograms = formData.programs.includes(programId)
      ? formData.programs.filter((id) => id !== programId)
      : [...formData.programs, programId];

    updateDistribution({ programs: updatedPrograms });
  };

  // Toggle program campaign selection
  const toggleProgramCampaign = (campaignId: string) => {
    const updatedCampaigns = formData.programCampaigns.includes(campaignId)
      ? formData.programCampaigns.filter((id) => id !== campaignId)
      : [...formData.programCampaigns, campaignId];

    updateDistribution({ programCampaigns: updatedCampaigns });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Distribution Channels</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Select channels and partners for your campaign distribution.
      </p>

      <div className="space-y-6">
        {/* Distribution Channels */}
        <div className="border rounded-md p-4 space-y-4">
          <h4 className="font-medium">Distribution Channels</h4>
          <p className="text-sm text-muted-foreground">
            Select the channels through which your campaign will be distributed.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
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

        {/* Partners */}
        <div className="border rounded-md p-4 space-y-4">
          <h4 className="font-medium">Partners (Optional)</h4>
          <p className="text-sm text-muted-foreground">
            Select external partners to help with campaign distribution.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            {partnerOptions.map((partner) => (
              <div
                key={partner.id}
                className={`p-3 border rounded-md cursor-pointer transition-all ${
                  formData.partners.includes(partner.id)
                    ? "border-primary bg-primary/5"
                    : "hover:border-muted-foreground"
                }`}
                onClick={() => togglePartner(partner.id)}
              >
                <div className="flex items-start">
                  <Checkbox
                    id={`partner-${partner.id}`}
                    checked={formData.partners.includes(partner.id)}
                    className="mt-1 mr-2"
                  />
                  <Label
                    htmlFor={`partner-${partner.id}`}
                    className="font-medium cursor-pointer"
                  >
                    {partner.label}
                  </Label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Programs */}
        <div className="border rounded-md p-4 space-y-4">
          <h4 className="font-medium">Programs</h4>
          <p className="text-sm text-muted-foreground">
            Select programs to associate with this campaign.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            {isLoadingPrograms ? (
              <div className="col-span-full p-4 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Loading programs from Kigo Core Server...
                </p>
              </div>
            ) : programs.length > 0 ? (
              programs.map((program) => (
                <div
                  key={program.id}
                  className={`p-3 border rounded-md cursor-pointer transition-all ${
                    formData.programs.includes(program.id)
                      ? "border-primary bg-primary/5"
                      : "hover:border-muted-foreground"
                  }`}
                  onClick={() => toggleProgram(program.id)}
                >
                  <div className="flex items-start">
                    <Checkbox
                      id={`program-${program.id}`}
                      checked={formData.programs.includes(program.id)}
                      className="mt-1 mr-2"
                    />
                    <Label
                      htmlFor={`program-${program.id}`}
                      className="font-medium cursor-pointer"
                    >
                      {program.label}
                    </Label>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full p-4 text-center text-sm text-muted-foreground">
                No programs available. Please contact your administrator.
              </div>
            )}
          </div>
        </div>

        {/* Program Campaigns */}
        <div className="border rounded-md p-4 space-y-4">
          <h4 className="font-medium">Program Campaigns</h4>
          <p className="text-sm text-muted-foreground">
            Select program campaigns to associate with this campaign.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            {isLoadingCampaigns ? (
              <div className="col-span-full p-4 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Loading program campaigns from Kigo Core Server...
                </p>
              </div>
            ) : programCampaigns.length > 0 ? (
              programCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className={`p-3 border rounded-md cursor-pointer transition-all ${
                    formData.programCampaigns.includes(campaign.id)
                      ? "border-primary bg-primary/5"
                      : "hover:border-muted-foreground"
                  }`}
                  onClick={() => toggleProgramCampaign(campaign.id)}
                >
                  <div className="flex items-start">
                    <Checkbox
                      id={`campaign-${campaign.id}`}
                      checked={formData.programCampaigns.includes(campaign.id)}
                      className="mt-1 mr-2"
                    />
                    <Label
                      htmlFor={`campaign-${campaign.id}`}
                      className="font-medium cursor-pointer"
                    >
                      {campaign.label}
                    </Label>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full p-4 text-center text-sm text-muted-foreground">
                No program campaigns available. Please contact your
                administrator.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributionStep;
