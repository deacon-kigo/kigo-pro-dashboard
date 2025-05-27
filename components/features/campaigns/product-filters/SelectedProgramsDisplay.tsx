"use client";

import React, { useState, useMemo } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronDown,
  ChevronRight,
  Building,
  Briefcase,
  LayoutGrid,
  CheckCircle,
  PencilIcon,
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
}

export function SelectedProgramsDisplay({
  partners,
  selectedProgramIds,
  maxHeight = "200px",
  onEditClick,
}: SelectedProgramsDisplayProps) {
  const [expandedPartners, setExpandedPartners] = useState<string[]>([]);
  const [expandedPrograms, setExpandedPrograms] = useState<string[]>([]);

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

  // Toggle expansion of a partner
  const togglePartner = (partnerId: string) => {
    setExpandedPartners((prev) => {
      const newExpandedPartners = prev.includes(partnerId)
        ? prev.filter((id) => id !== partnerId)
        : [...prev, partnerId];
      return newExpandedPartners;
    });
  };

  // Toggle expansion of a program
  const toggleProgram = (programId: string) => {
    setExpandedPrograms((prev) => {
      const newExpandedPrograms = prev.includes(programId)
        ? prev.filter((id) => id !== programId)
        : [...prev, programId];
      return newExpandedPrograms;
    });
  };

  // Toggle expand/collapse all
  const toggleExpandAll = () => {
    if (expandedPartners.length === 0) {
      // Expand all
      const allPartnerIds = filteredData.map((partner) => partner.id);
      const allProgramIds: string[] = [];

      filteredData.forEach((partner) => {
        partner.programs.forEach((program) => {
          allProgramIds.push(program.id);
        });
      });

      setExpandedPartners(allPartnerIds);
      setExpandedPrograms(allProgramIds);
    } else {
      // Collapse all
      setExpandedPartners([]);
      setExpandedPrograms([]);
    }
  };

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
    <div className="border rounded-md overflow-hidden">
      <div className="flex items-center justify-between bg-slate-50 p-3 border-b">
        <div className="flex items-center">
          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
          <span className="text-sm font-medium">Selected Programs</span>
          <Badge variant="outline" className="ml-2 text-xs">
            {selectionInfo.totalSelected}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleExpandAll}
            className="h-8 px-2 text-xs"
          >
            {expandedPartners.length > 0 ? "Collapse All" : "Expand All"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onEditClick}
            className="flex items-center gap-1"
          >
            <PencilIcon className="h-3 w-3" />
            Edit
          </Button>
        </div>
      </div>

      <ScrollArea
        className={cn("overflow-auto", maxHeight ? `max-h-[${maxHeight}]` : "")}
        style={{ maxHeight }}
      >
        <div className="space-y-1">
          {filteredData.map((partner) => (
            <div key={partner.id} className="border-b last:border-b-0">
              {/* Partner level */}
              <div
                className={`flex items-center p-3 hover:bg-slate-50 cursor-pointer ${
                  expandedPartners.includes(partner.id) ? "border-b" : ""
                }`}
                onClick={() => togglePartner(partner.id)}
              >
                <div className="mr-2">
                  {expandedPartners.includes(partner.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>

                <div className="flex items-center flex-1">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="font-medium text-sm">{partner.name}</span>
                  </div>
                </div>

                <Badge variant="outline" className="text-xs">
                  {partner.programs.reduce(
                    (count, program) => count + program.promotedPrograms.length,
                    0
                  )}
                </Badge>
              </div>

              {/* Programs under this partner */}
              {expandedPartners.includes(partner.id) && (
                <div className="pl-9">
                  {partner.programs.map((program) => (
                    <div key={program.id} className="border-t">
                      {/* Program level */}
                      <div
                        className={`flex items-center p-3 hover:bg-slate-50 cursor-pointer ${
                          expandedPrograms.includes(program.id)
                            ? "border-b"
                            : ""
                        }`}
                        onClick={() => toggleProgram(program.id)}
                      >
                        <div className="mr-2">
                          {expandedPrograms.includes(program.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>

                        <div className="flex items-center flex-1">
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-2 text-green-600" />
                            <span className="font-medium text-sm">
                              {program.name}
                            </span>
                          </div>
                        </div>

                        <Badge variant="outline" className="text-xs">
                          {program.promotedPrograms.length}
                        </Badge>
                      </div>

                      {/* Promoted Programs under this program */}
                      {expandedPrograms.includes(program.id) && (
                        <div className="pl-9">
                          {program.promotedPrograms.map((promotedProgram) => (
                            <div
                              key={promotedProgram.id}
                              className="flex items-center p-3 hover:bg-slate-50 border-t"
                            >
                              <div className="flex items-center flex-1">
                                <LayoutGrid className="h-4 w-4 mr-2 text-purple-600" />
                                <div>
                                  <span className="block font-medium text-sm">
                                    {promotedProgram.name}
                                  </span>
                                  {promotedProgram.description && (
                                    <p className="text-xs text-gray-500">
                                      {promotedProgram.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {filteredData.length === 0 && (
            <div className="text-center p-4 text-sm text-gray-500">
              No programs selected
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
