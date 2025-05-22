"use client";

import React, { useState, useMemo } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  Building,
  Briefcase,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Define the hierarchical structure
interface PromotedProgram {
  id: string;
  name: string;
  description?: string;
  active?: boolean;
}

interface Program {
  id: string;
  name: string;
  promotedPrograms: PromotedProgram[];
}

interface Partner {
  id: string;
  name: string;
  programs: Program[];
}

interface SelectedProgramsDisplayProps {
  partners: Partner[];
  selectedProgramIds: string[];
  maxHeight?: string;
  onEditClick: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function SelectedProgramsDisplay({
  partners,
  selectedProgramIds,
  maxHeight = "200px",
  onEditClick,
  collapsed = false,
  onToggleCollapse,
}: SelectedProgramsDisplayProps) {
  const [expandedPartners, setExpandedPartners] = useState<
    Record<string, boolean>
  >({});
  const [expandedPrograms, setExpandedPrograms] = useState<
    Record<string, boolean>
  >({});
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  // Filter partners to only include those with selected programs
  const filteredData = useMemo(() => {
    return partners
      .map((partner) => ({
        ...partner,
        programs: partner.programs
          .map((program) => ({
            ...program,
            promotedPrograms: program.promotedPrograms.filter((pp) =>
              selectedProgramIds.includes(pp.id)
            ),
          }))
          .filter((program) => program.promotedPrograms.length > 0),
      }))
      .filter((partner) => partner.programs.length > 0);
  }, [partners, selectedProgramIds]);

  // Calculate selection count info
  const selectionInfo = useMemo(() => {
    let totalSelected = 0;
    let partnerCount = 0;
    let programCount = 0;

    filteredData.forEach((partner) => {
      if (partner.programs.length > 0) partnerCount++;

      partner.programs.forEach((program) => {
        if (program.promotedPrograms.length > 0) programCount++;
        totalSelected += program.promotedPrograms.length;
      });
    });

    return { totalSelected, partnerCount, programCount };
  }, [filteredData]);

  // Toggle expand/collapse for a partner
  const togglePartner = (partnerId: string) => {
    setExpandedPartners((prev) => ({
      ...prev,
      [partnerId]: !prev[partnerId],
    }));
  };

  // Toggle expand/collapse for a program
  const toggleProgram = (programId: string) => {
    setExpandedPrograms((prev) => ({
      ...prev,
      [programId]: !prev[programId],
    }));
  };

  // Toggle expand/collapse all
  const toggleExpandAll = () => {
    const newState = !isAllExpanded;
    setIsAllExpanded(newState);

    const partnerState: Record<string, boolean> = {};
    const programState: Record<string, boolean> = {};

    filteredData.forEach((partner) => {
      partnerState[partner.id] = newState;
      partner.programs.forEach((program) => {
        programState[program.id] = newState;
      });
    });

    setExpandedPartners(partnerState);
    setExpandedPrograms(programState);
  };

  if (collapsed) {
    return (
      <div className="border rounded-md p-3 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium">
              {selectionInfo.totalSelected} program
              {selectionInfo.totalSelected !== 1 ? "s" : ""} selected
            </span>
            <p className="text-xs text-gray-500 mt-0.5">
              From {selectionInfo.partnerCount} partner
              {selectionInfo.partnerCount !== 1 ? "s" : ""}
              and {selectionInfo.programCount} program
              {selectionInfo.programCount !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={onToggleCollapse}>
              View
            </Button>
            <Button size="sm" variant="outline" onClick={onEditClick}>
              Edit
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedProgramIds.length === 0) {
    return (
      <div className="border rounded-md p-3 bg-gray-50 text-center">
        <p className="text-sm text-gray-500">No programs selected</p>
        <Button
          size="sm"
          variant="outline"
          className="mt-2"
          onClick={onEditClick}
        >
          Assign Programs
        </Button>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <div className="flex items-center justify-between bg-gray-50 p-3 border-b">
        <div className="flex items-center">
          <Badge variant="outline" className="mr-2">
            {selectionInfo.totalSelected}
          </Badge>
          <span className="text-sm font-medium">Selected Programs</span>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleExpandAll}
            className="h-8 px-2 text-xs"
          >
            {isAllExpanded ? "Collapse All" : "Expand All"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onToggleCollapse}
            className="h-8 px-2 text-xs"
          >
            Collapse
          </Button>
          <Button size="sm" variant="outline" onClick={onEditClick}>
            Edit
          </Button>
        </div>
      </div>

      <ScrollArea
        className={cn("max-h-[200px]", maxHeight ? `max-h-[${maxHeight}]` : "")}
      >
        <div className="p-2">
          {filteredData.length === 0 ? (
            <div className="text-center p-4 text-sm text-gray-500">
              No programs selected
            </div>
          ) : (
            <div className="space-y-1">
              {filteredData.map((partner) => (
                <Collapsible
                  key={partner.id}
                  open={expandedPartners[partner.id]}
                  className="border border-gray-100 rounded-sm overflow-hidden"
                >
                  <CollapsibleTrigger asChild>
                    <button
                      onClick={() => togglePartner(partner.id)}
                      className="flex items-center w-full p-2 hover:bg-gray-50 text-left"
                    >
                      {expandedPartners[partner.id] ? (
                        <ChevronDown className="h-4 w-4 mr-1 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 mr-1 text-gray-500" />
                      )}
                      <Building className="h-4 w-4 mr-1.5 text-blue-600" />
                      <span className="text-sm font-medium">
                        {partner.name}
                      </span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {partner.programs.reduce(
                          (count, program) =>
                            count + program.promotedPrograms.length,
                          0
                        )}
                      </Badge>
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="pl-6 space-y-1 pb-1">
                      {partner.programs.map((program) => (
                        <Collapsible
                          key={program.id}
                          open={expandedPrograms[program.id]}
                          className="border-l border-gray-200"
                        >
                          <CollapsibleTrigger asChild>
                            <button
                              onClick={() => toggleProgram(program.id)}
                              className="flex items-center w-full p-1.5 hover:bg-gray-50 text-left"
                            >
                              {expandedPrograms[program.id] ? (
                                <ChevronDown className="h-3.5 w-3.5 mr-1 text-gray-500" />
                              ) : (
                                <ChevronRight className="h-3.5 w-3.5 mr-1 text-gray-500" />
                              )}
                              <Briefcase className="h-3.5 w-3.5 mr-1.5 text-purple-600" />
                              <span className="text-xs font-medium">
                                {program.name}
                              </span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {program.promotedPrograms.length}
                              </Badge>
                            </button>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="pl-6 space-y-0.5 pb-1">
                              {program.promotedPrograms.map((pp) => (
                                <div
                                  key={pp.id}
                                  className="flex items-center p-1.5 hover:bg-gray-50"
                                >
                                  <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-green-600" />
                                  <span className="text-xs">{pp.name}</span>
                                  {!pp.active && (
                                    <Badge
                                      variant="outline"
                                      className="ml-1.5 text-[10px] bg-gray-100 text-gray-600"
                                    >
                                      Inactive
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
