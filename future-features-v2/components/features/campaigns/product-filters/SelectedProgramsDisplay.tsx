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
  Clock,
  Loader2,
  XCircle,
  ExpandIcon,
  Minimize2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AssignmentItem } from "./BulkAssignmentProgress";

// Redux imports
import {
  selectAssignmentItems,
  selectAssignmentStats,
} from "@/lib/redux/selectors/assignmentSelectors";
import { updateAssignmentItemStatus } from "@/lib/redux/slices/assignmentSlice";

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
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function SelectedProgramsDisplay({
  partners,
  selectedProgramIds,
  onEditClick,
}: SelectedProgramsDisplayProps) {
  const dispatch = useDispatch();
  // Use Redux selectors for assignment data
  const assignmentItems = useSelector(selectAssignmentItems);
  const assignmentStats = useSelector(selectAssignmentStats);

  console.log("🎯 SelectedProgramsDisplay Redux state:", {
    selectedProgramIdsCount: selectedProgramIds.length,
    assignmentItemsCount: assignmentItems.length,
    assignmentStats,
  });

  const [expandedPartners, setExpandedPartners] = useState<string[]>([]);
  const [expandedPrograms, setExpandedPrograms] = useState<string[]>([]);

  // Status icon component
  const StatusIcon = ({ status }: { status: AssignmentItem["status"] }) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-3 w-3" color="#16a34a" />;
      case "failed":
        return <XCircle className="h-2.5 w-2.5 text-red-600" />;
      case "processing":
        return <Loader2 className="h-2.5 w-2.5 text-blue-600 animate-spin" />;
      default:
        return <Clock className="h-2.5 w-2.5 text-gray-400" />;
    }
  };

  // Get assignment status for a promoted program using Redux data
  const getAssignmentStatus = (promotedProgramId: string) => {
    const foundItem = assignmentItems.find(
      (item) => item.id === promotedProgramId
    );
    return foundItem?.status;
  };

  // Check if any program is being assigned
  const hasActiveAssignments = assignmentItems.length > 0;

  // Check if all assignments are completed (no processing items)
  const isAssignmentComplete =
    hasActiveAssignments &&
    assignmentStats &&
    assignmentStats.processing === 0 &&
    assignmentStats.completed === assignmentStats.total;

  // Helper function to get background color based on status
  const getStatusBackgroundColor = (items: AssignmentItem[]) => {
    if (items.length === 0) return "";

    const processing = items.filter(
      (item) => item.status === "processing"
    ).length;
    const failed = items.filter((item) => item.status === "failed").length;
    const success = items.filter((item) => item.status === "success").length;

    if (processing > 0) return "bg-blue-50";
    if (failed > 0 && success === 0) return "bg-red-50";
    if (failed > 0) return "bg-yellow-50";
    if (success === items.length) return "bg-green-50";
    return "";
  };

  // Retry failed assignment
  const handleRetryFailed = (itemId: string) => {
    dispatch(
      updateAssignmentItemStatus({
        itemId,
        status: "pending",
      })
    );

    // Simulate retry with processing -> success/fail
    setTimeout(() => {
      dispatch(
        updateAssignmentItemStatus({
          itemId,
          status: "processing",
        })
      );

      setTimeout(
        () => {
          const success = Math.random() > 0.3; // 70% success rate on retry
          dispatch(
            updateAssignmentItemStatus({
              itemId,
              status: success ? "success" : "failed",
              error: success ? undefined : "Retry failed - network error",
            })
          );
        },
        Math.random() * 1500 + 1000
      );
    }, 300);
  };

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
    <div className="border rounded-md overflow-hidden flex flex-col h-full">
      {/* Streamlined Header - Fixed Height */}
      <div className="flex items-center justify-between bg-slate-50 p-4 border-b flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            {hasActiveAssignments && !isAssignmentComplete ? (
              <div className="relative">
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
              </div>
            ) : hasActiveAssignments && isAssignmentComplete ? (
              <CheckCircle className="h-5 w-5" color="#16a34a" />
            ) : (
              <CheckCircle className="h-5 w-5" color="#16a34a" />
            )}
            <div className="flex flex-col">
              <div className="font-semibold text-sm leading-tight">
                {hasActiveAssignments && !isAssignmentComplete
                  ? "Bulk Assignment in Progress"
                  : hasActiveAssignments && isAssignmentComplete
                    ? "Programs Assigned"
                    : "Programs Selected"}
              </div>
              {hasActiveAssignments &&
              assignmentStats &&
              assignmentStats.total > 0 ? (
                <div className="text-xs text-gray-600 flex items-center space-x-4 mt-1">
                  <span className="font-medium text-gray-900">
                    {assignmentStats.completed}/{assignmentStats.total}
                  </span>
                  <div className="flex items-center space-x-3">
                    {assignmentStats.successful > 0 && (
                      <span className="text-green-600 font-medium">
                        ✓ {assignmentStats.successful}
                      </span>
                    )}
                    {assignmentStats.failed > 0 && (
                      <span className="text-red-600 font-medium">
                        ✗ {assignmentStats.failed}
                      </span>
                    )}
                    {assignmentStats.processing > 0 && (
                      <span className="text-blue-600 font-medium">
                        ⟳ {assignmentStats.processing}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-600 mt-1">
                  {selectionInfo.totalSelected} programs across{" "}
                  {selectionInfo.partnerCount} partners
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Expand/Collapse Toggle */}
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleExpandAll}
            className="h-8 w-8 p-0 hover:bg-white"
            title={expandedPartners.length > 0 ? "Collapse All" : "Expand All"}
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
            disabled={hasActiveAssignments && !isAssignmentComplete}
            title={
              hasActiveAssignments && !isAssignmentComplete
                ? "Cannot edit selection while bulk assignment is in progress"
                : hasActiveAssignments && isAssignmentComplete
                  ? "Edit and reassign programs"
                  : "Edit program selection"
            }
          >
            <PencilIcon className="h-3 w-3" />
            <span className="text-xs font-medium">
              {hasActiveAssignments && isAssignmentComplete
                ? "Reassign"
                : "Edit"}
            </span>
          </Button>
        </div>
      </div>

      {/* Full Height Scrollable Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="divide-y divide-gray-100">
            {filteredData.map((partner) => {
              const partnerItems = assignmentItems.filter((item) =>
                partner.programs.some((prog) =>
                  prog.promotedPrograms.some((pp) => pp.id === item.id)
                )
              );

              return (
                <div key={partner.id} className="bg-white">
                  {/* Partner Level - Perfectly Aligned */}
                  <div
                    className={cn(
                      "flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-all duration-200",
                      getStatusBackgroundColor(partnerItems),
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
                          {hasActiveAssignments && partnerItems.length > 0 && (
                            <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                              {
                                partnerItems.filter(
                                  (i) =>
                                    i.status === "success" ||
                                    i.status === "failed"
                                ).length
                              }
                              /{partnerItems.length}
                            </span>
                          )}
                        </div>
                        {isAssignmentComplete && (
                          <span className="text-xs text-green-600 font-medium">
                            Programs Assigned
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Section: Status + Count */}
                    <div className="flex items-center space-x-3">
                      {hasActiveAssignments && partnerItems.length > 0 && (
                        <div className="w-5 h-5 flex items-center justify-center">
                          {(() => {
                            const processing = partnerItems.filter(
                              (i) => i.status === "processing"
                            ).length;
                            const failed = partnerItems.filter(
                              (i) => i.status === "failed"
                            ).length;
                            const completed = partnerItems.filter(
                              (i) =>
                                i.status === "success" || i.status === "failed"
                            ).length;

                            if (processing > 0) {
                              return (
                                <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                              );
                            } else if (completed === partnerItems.length) {
                              return failed > 0 ? (
                                <XCircle className="h-4 w-4 text-red-600" />
                              ) : (
                                <CheckCircle
                                  className="h-4 w-4"
                                  color="#16a34a"
                                />
                              );
                            }
                            return <Clock className="h-4 w-4 text-gray-400" />;
                          })()}
                        </div>
                      )}

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
                      {partner.programs.map((program) => {
                        const programItems = assignmentItems.filter((item) =>
                          program.promotedPrograms.some(
                            (pp) => pp.id === item.id
                          )
                        );

                        return (
                          <div key={program.id}>
                            {/* Program Level - Fixed Layout */}
                            <div
                              className={cn(
                                "flex items-center px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-all duration-200",
                                getStatusBackgroundColor(programItems),
                                expandedPrograms.includes(program.id)
                                  ? "bg-gray-50"
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
                                    {hasActiveAssignments &&
                                      programItems.length > 0 && (
                                        <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                                          {
                                            programItems.filter(
                                              (i) =>
                                                i.status === "success" ||
                                                i.status === "failed"
                                            ).length
                                          }
                                          /{programItems.length}
                                        </span>
                                      )}
                                  </div>
                                </div>
                              </div>

                              {/* Right Section: Status + Count - Compact */}
                              <div className="flex items-center space-x-2">
                                {hasActiveAssignments &&
                                  programItems.length > 0 && (
                                    <div className="w-4 h-4 flex items-center justify-center">
                                      {(() => {
                                        const processing = programItems.filter(
                                          (i) => i.status === "processing"
                                        ).length;
                                        const failed = programItems.filter(
                                          (i) => i.status === "failed"
                                        ).length;
                                        const completed = programItems.filter(
                                          (i) =>
                                            i.status === "success" ||
                                            i.status === "failed"
                                        ).length;

                                        if (processing > 0) {
                                          return (
                                            <Loader2 className="h-3.5 w-3.5 text-blue-600 animate-spin" />
                                          );
                                        } else if (
                                          completed === programItems.length
                                        ) {
                                          return failed > 0 ? (
                                            <XCircle className="h-3.5 w-3.5 text-red-600" />
                                          ) : (
                                            <CheckCircle
                                              className="h-3.5 w-3.5"
                                              color="#16a34a"
                                            />
                                          );
                                        }
                                        return (
                                          <Clock className="h-3.5 w-3.5 text-gray-400" />
                                        );
                                      })()}
                                    </div>
                                  )}

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
                                {program.promotedPrograms.map(
                                  (promotedProgram) => {
                                    const status = getAssignmentStatus(
                                      promotedProgram.id
                                    );
                                    const statusBg =
                                      status === "processing"
                                        ? "bg-blue-50"
                                        : status === "success"
                                          ? "bg-green-50"
                                          : status === "failed"
                                            ? "bg-red-50"
                                            : "";

                                    return (
                                      <div
                                        key={promotedProgram.id}
                                        className={cn(
                                          "flex items-center px-4 py-2 transition-all duration-200",
                                          statusBg
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
                                          </div>
                                        </div>

                                        {/* Right Section: Status + Actions - Horizontal Layout */}
                                        <div className="flex items-center space-x-3">
                                          {status && (
                                            <div className="flex items-center space-x-1.5">
                                              <div className="w-4 h-4 flex items-center justify-center">
                                                <StatusIcon status={status} />
                                              </div>
                                              <span className="text-xs font-medium text-gray-600 capitalize whitespace-nowrap">
                                                {status === "processing"
                                                  ? "Assigning"
                                                  : status}
                                              </span>
                                            </div>
                                          )}

                                          {status === "failed" && (
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() =>
                                                handleRetryFailed(
                                                  promotedProgram.id
                                                )
                                              }
                                              className="h-6 px-2 text-xs font-medium"
                                            >
                                              <RefreshCw className="h-2.5 w-2.5 mr-1" />
                                              Retry
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredData.length === 0 && (
              <div className="flex items-center justify-center py-12 text-gray-500">
                <div className="text-center">
                  <LayoutGrid className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm font-medium">No programs selected</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Select programs to see assignment progress
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
