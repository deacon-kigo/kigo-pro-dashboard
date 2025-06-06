"use client";

import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
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
  Loader2,
  XCircle,
  ExpandIcon,
  Minimize2,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BulkAssignmentStatus } from "./useAssignmentWorkflow";

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
  onEditClick: () => void;
  bulkAssignmentStatus?: BulkAssignmentStatus;
  onRetryAssignment?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function SelectedProgramsDisplay({
  partners,
  selectedProgramIds,
  onEditClick,
  bulkAssignmentStatus = "idle",
  onRetryAssignment,
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

  // Get status icon and text based on bulk assignment status
  const getStatusInfo = () => {
    switch (bulkAssignmentStatus) {
      case "assigning":
        return {
          icon: <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />,
          title: "Bulk Assignment in Progress",
          subtitle: `Assigning filter to ${selectionInfo.totalSelected} programs...`,
        };
      case "success":
        return {
          icon: <CheckCircle className="h-5 w-5" color="#16a34a" />,
          title: "Programs Assigned Successfully",
          subtitle: `Filter assigned to ${selectionInfo.totalSelected} programs`,
        };
      case "failed":
        return {
          icon: <XCircle className="h-5 w-5 text-red-600" />,
          title: "Assignment Failed",
          subtitle: `Failed to assign filter to programs`,
        };
      default:
        return {
          icon: <CheckCircle className="h-5 w-5" color="#16a34a" />,
          title: "Programs Selected",
          subtitle: `${selectionInfo.totalSelected} programs across ${selectionInfo.partnerCount} partners`,
        };
    }
  };

  const statusInfo = getStatusInfo();

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
    <div className="border rounded-md overflow-hidden flex flex-col h-full">
      {/* Streamlined Header - Fixed Height */}
      <div className="flex items-center justify-between bg-slate-50 p-4 border-b flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            {statusInfo.icon}
            <div className="flex flex-col">
              <div className="font-semibold text-sm leading-tight">
                {statusInfo.title}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {statusInfo.subtitle}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Retry Button for Failed State */}
          {bulkAssignmentStatus === "failed" && onRetryAssignment && (
            <Button
              size="sm"
              variant="outline"
              onClick={onRetryAssignment}
              className="flex items-center gap-1.5 h-8 px-3"
            >
              <RefreshCw className="h-3 w-3" />
              <span className="text-xs font-medium">Retry</span>
            </Button>
          )}

          {/* Expand/Collapse Toggle */}
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleExpandAll}
            className="h-8 w-8 p-0 hover:bg-white"
            title={expandedPartners.length > 0 ? "Collapse All" : "Expand All"}
            disabled={bulkAssignmentStatus === "assigning"}
          >
            {expandedPartners.length > 0 ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <ExpandIcon className="h-4 w-4" />
            )}
          </Button>

          {/* Edit Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={onEditClick}
            className="flex items-center gap-1.5 h-8 px-3"
            disabled={bulkAssignmentStatus === "assigning"}
            title={
              bulkAssignmentStatus === "assigning"
                ? "Cannot edit selection while assignment is in progress"
                : bulkAssignmentStatus === "success"
                  ? "Edit and reassign programs"
                  : "Edit program selection"
            }
          >
            <PencilIcon className="h-3 w-3" />
            <span className="text-xs font-medium">
              {bulkAssignmentStatus === "success" ? "Reassign" : "Edit"}
            </span>
          </Button>
        </div>
      </div>

      {/* Full Height Scrollable Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="divide-y divide-gray-100">
            {filteredData.map((partner) => (
              <div key={partner.id} className="bg-white">
                {/* Partner Level - Perfectly Aligned */}
                <div
                  className={cn(
                    "flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-all duration-200",
                    expandedPartners.includes(partner.id) ? "bg-gray-50" : ""
                  )}
                  onClick={() => togglePartner(partner.id)}
                >
                  {/* Left Section: Expand Icon + Partner Info */}
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                      {expandedPartners.includes(partner.id) ? (
                        <ChevronDown className="h-4 w-4 text-gray-600" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-600" />
                      )}
                    </div>

                    <div className="w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                      <Building className="h-4 w-4 text-blue-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-sm text-gray-900 truncate">
                          {partner.name}
                        </span>
                      </div>
                      {bulkAssignmentStatus === "success" && (
                        <span className="text-xs text-green-600 font-medium">
                          Programs Assigned
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Section: Count */}
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant="outline"
                      className="text-xs font-medium px-2 py-1"
                    >
                      {partner.programs.reduce(
                        (count, program) =>
                          count + program.promotedPrograms.length,
                        0
                      )}
                    </Badge>
                  </div>
                </div>

                {/* Programs under this partner */}
                {expandedPartners.includes(partner.id) && (
                  <div className="bg-gray-25">
                    {partner.programs.map((program) => (
                      <div key={program.id}>
                        {/* Program Level - Fixed Layout */}
                        <div
                          className={cn(
                            "flex items-center px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-all duration-200",
                            expandedPrograms.includes(program.id)
                              ? "bg-gray-50 border-b"
                              : ""
                          )}
                          onClick={() => toggleProgram(program.id)}
                        >
                          {/* Indentation spacer */}
                          <div className="w-4 flex-shrink-0" />

                          {/* Left Section: Expand Icon + Program Info */}
                          <div className="flex items-center flex-1 min-w-0">
                            <div className="w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">
                              {expandedPrograms.includes(program.id) ? (
                                <ChevronDown className="h-3 w-3 text-gray-600" />
                              ) : (
                                <ChevronRight className="h-3 w-3 text-gray-600" />
                              )}
                            </div>

                            <div className="w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">
                              <Briefcase className="h-3.5 w-3.5 text-green-600" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-sm text-gray-800 truncate">
                                  {program.name}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right Section: Count */}
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className="text-xs font-medium px-1.5 py-0.5"
                            >
                              {program.promotedPrograms.length}
                            </Badge>
                          </div>
                        </div>

                        {/* Promoted Programs under this program */}
                        {expandedPrograms.includes(program.id) && (
                          <div className="bg-white">
                            {program.promotedPrograms.map((promotedProgram) => (
                              <div
                                key={promotedProgram.id}
                                className={cn(
                                  "flex items-center px-4 py-2 transition-all duration-200",
                                  promotedProgram.active === false
                                    ? "opacity-60"
                                    : ""
                                )}
                              >
                                {/* Double indentation spacer for promoted programs */}
                                <div className="w-8 flex-shrink-0" />

                                {/* Left Section: Icon + Program Info */}
                                <div className="flex items-center flex-1 min-w-0">
                                  <div className="w-5 h-5 flex items-center justify-center mr-3 flex-shrink-0">
                                    <LayoutGrid className="h-3 w-3 text-purple-600" />
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <span className="font-medium text-sm text-gray-800 truncate block">
                                      {promotedProgram.name}
                                    </span>
                                    {promotedProgram.description && (
                                      <p className="text-xs text-gray-500">
                                        {promotedProgram.description}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Right Section: Status Badge */}
                                <div className="flex items-center gap-2">
                                  {bulkAssignmentStatus === "success" && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-green-50 text-green-700 border-green-200"
                                    >
                                      Assigned
                                    </Badge>
                                  )}
                                  {bulkAssignmentStatus === "failed" && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-red-50 text-red-700 border-red-200"
                                    >
                                      Failed
                                    </Badge>
                                  )}
                                  {bulkAssignmentStatus === "assigning" && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                    >
                                      Assigning...
                                    </Badge>
                                  )}
                                  {promotedProgram.active === false && (
                                    <Badge
                                      variant="outline"
                                      className="bg-gray-100"
                                    >
                                      Inactive
                                    </Badge>
                                  )}
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
              <div className="flex items-center justify-center py-12 text-gray-500">
                <div className="text-center">
                  <LayoutGrid className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm font-medium">No programs selected</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Select programs to see assignment status
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
