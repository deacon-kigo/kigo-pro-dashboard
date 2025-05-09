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
import { Button } from "@/components/atoms/Button";
import Card from "@/components/atoms/Card/Card";
import { Badge } from "@/components/atoms/Badge";
import { Input } from "@/components/atoms/Input";
import { Search, Check, Info, Plus, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  // Local state for search
  const [programSearchTerm, setProgramSearchTerm] = useState("");
  const [campaignSearchTerm, setCampaignSearchTerm] = useState("");

  // Distribution channels
  const channelOptions = [
    {
      id: "email",
      label: "Email",
      description:
        "Send targeted emails to selected audience segments through loyalty programs",
    },
    {
      id: "social",
      label: "Loyalty Social",
      description:
        "Promote through Kigo's loyalty program social media integrations",
    },
    {
      id: "display",
      label: "Display Ads",
      description: "Show banner ads on loyalty program websites and apps",
    },
    {
      id: "search",
      label: "Loyalty Search",
      description: "Target users through loyalty program search features",
    },
    {
      id: "inapp",
      label: "In-App",
      description:
        "Deliver notifications through Kigo's WalletOS and loyalty program apps",
    },
  ];

  // Mock Programs data (in production, this would come from Kigo Core Server API)
  const [programs, setPrograms] = useState([
    {
      id: "program1",
      name: "CVS ExtraCare",
      members: "76M+",
      icon: "https://example.com/cvs-icon.png",
      description: "Pharmacy and retail rewards program",
    },
    {
      id: "program2",
      name: "Albertsons for U",
      members: "35M+",
      icon: "https://example.com/albertsons-icon.png",
      description: "Grocery rewards and personalized deals",
    },
    {
      id: "program3",
      name: "T-Mobile Tuesdays",
      members: "28M+",
      icon: "https://example.com/tmobile-icon.png",
      description: "Wireless carrier rewards program",
    },
    {
      id: "program4",
      name: "Best Buy Rewards",
      members: "12M+",
      icon: "https://example.com/bestbuy-icon.png",
      description: "Electronics retailer rewards program",
    },
    {
      id: "program5",
      name: "Chipotle Rewards",
      members: "8M+",
      icon: "https://example.com/chipotle-icon.png",
      description: "Restaurant loyalty program",
    },
  ]);

  // Mock Program Campaigns data (in production, this would come from Kigo Core Server API)
  const [programCampaigns, setProgramCampaigns] = useState([
    {
      id: "campaign1",
      name: "Summer Savings",
      program: "CVS ExtraCare",
      startDate: "2023-06-01",
      endDate: "2023-08-31",
      status: "Active",
    },
    {
      id: "campaign2",
      name: "Back to School",
      program: "Albertsons for U",
      startDate: "2023-07-15",
      endDate: "2023-09-15",
      status: "Active",
    },
    {
      id: "campaign3",
      name: "Holiday Deals",
      program: "Best Buy Rewards",
      startDate: "2023-11-01",
      endDate: "2023-12-31",
      status: "Scheduled",
    },
    {
      id: "campaign4",
      name: "Fall Promotion",
      program: "T-Mobile Tuesdays",
      startDate: "2023-09-01",
      endDate: "2023-11-30",
      status: "Scheduled",
    },
    {
      id: "campaign5",
      name: "New Year Kickoff",
      program: "Chipotle Rewards",
      startDate: "2024-01-01",
      endDate: "2024-02-28",
      status: "Scheduled",
    },
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

  // Select all channels (default behavior in spec)
  const selectAllChannels = () => {
    updateDistribution({
      channels: channelOptions.map((channel) => channel.id),
    });
  };

  // Filter programs by search term
  const filteredPrograms = programs.filter((program) =>
    program.name.toLowerCase().includes(programSearchTerm.toLowerCase())
  );

  // Filter program campaigns by search term
  const filteredCampaigns = programCampaigns.filter(
    (campaign) =>
      campaign.name.toLowerCase().includes(campaignSearchTerm.toLowerCase()) ||
      campaign.program.toLowerCase().includes(campaignSearchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
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

        {/* Programs */}
        <div className="border rounded-md p-4 space-y-4">
          <h4 className="font-medium">Loyalty Programs</h4>
          <p className="text-sm text-muted-foreground">
            Select the loyalty programs to include in your campaign
            distribution.
          </p>

          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search loyalty programs..."
              value={programSearchTerm}
              onChange={(e) => setProgramSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Selected Programs display */}
          {formData.programs.length > 0 && (
            <div className="flex flex-wrap gap-2 my-3">
              {formData.programs.map((programId) => {
                const program = programs.find((p) => p.id === programId);
                return program ? (
                  <Badge
                    key={program.id}
                    variant="secondary"
                    className="pl-2 pr-1 py-1 flex items-center gap-1"
                  >
                    {program.name}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleProgram(program.id);
                      }}
                      className="h-5 w-5 rounded-full hover:bg-muted inline-flex items-center justify-center"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ) : null;
              })}
            </div>
          )}

          <div className="mt-3">
            <ScrollArea className="h-[250px] rounded-md border">
              {isLoadingPrograms ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                  <p className="ml-2 text-sm text-muted-foreground">
                    Loading loyalty programs...
                  </p>
                </div>
              ) : filteredPrograms.length > 0 ? (
                <div className="p-1">
                  {filteredPrograms.map((program) => (
                    <div
                      key={program.id}
                      className={`p-3 border rounded-md mb-2 cursor-pointer transition-all flex ${
                        formData.programs.includes(program.id)
                          ? "border-primary bg-primary/5"
                          : "hover:border-muted-foreground"
                      }`}
                      onClick={() => toggleProgram(program.id)}
                    >
                      <div className="flex-shrink-0 mr-3 flex items-center">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          {program.icon ? (
                            <img
                              src={program.icon}
                              alt={program.name}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <span className="text-lg font-bold">
                              {program.name.charAt(0)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <div className="font-medium">{program.name}</div>
                          <Badge variant="outline">{program.members}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {program.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-2 flex items-center">
                        <Checkbox
                          id={`program-${program.id}`}
                          checked={formData.programs.includes(program.id)}
                          className="mt-1 mr-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-4">
                  <Info className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-center text-sm text-muted-foreground">
                    No loyalty programs found matching your search.
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        {/* Program Campaigns */}
        <div className="border rounded-md p-4 space-y-4">
          <h4 className="font-medium">Program Campaigns</h4>
          <p className="text-sm text-muted-foreground">
            Select existing program campaigns to associate with this campaign.
          </p>

          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search program campaigns..."
              value={campaignSearchTerm}
              onChange={(e) => setCampaignSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Selected Program Campaigns display */}
          {formData.programCampaigns.length > 0 && (
            <div className="flex flex-wrap gap-2 my-3">
              {formData.programCampaigns.map((campaignId) => {
                const campaign = programCampaigns.find(
                  (c) => c.id === campaignId
                );
                return campaign ? (
                  <Badge
                    key={campaign.id}
                    variant="secondary"
                    className="pl-2 pr-1 py-1 flex items-center gap-1"
                  >
                    {campaign.name}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleProgramCampaign(campaign.id);
                      }}
                      className="h-5 w-5 rounded-full hover:bg-muted inline-flex items-center justify-center"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ) : null;
              })}
            </div>
          )}

          <div className="mt-3">
            <ScrollArea className="h-[250px] rounded-md border">
              {isLoadingCampaigns ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                  <p className="ml-2 text-sm text-muted-foreground">
                    Loading program campaigns...
                  </p>
                </div>
              ) : filteredCampaigns.length > 0 ? (
                <div className="p-1">
                  {filteredCampaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className={`p-3 border rounded-md mb-2 cursor-pointer transition-all ${
                        formData.programCampaigns.includes(campaign.id)
                          ? "border-primary bg-primary/5"
                          : "hover:border-muted-foreground"
                      }`}
                      onClick={() => toggleProgramCampaign(campaign.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {campaign.program}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {campaign.startDate} to {campaign.endDate}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              campaign.status === "Active"
                                ? "default"
                                : "outline"
                            }
                          >
                            {campaign.status}
                          </Badge>
                          <Checkbox
                            id={`campaign-${campaign.id}`}
                            checked={formData.programCampaigns.includes(
                              campaign.id
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-4">
                  <Info className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-center text-sm text-muted-foreground">
                    No program campaigns found matching your search.
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributionStep;
