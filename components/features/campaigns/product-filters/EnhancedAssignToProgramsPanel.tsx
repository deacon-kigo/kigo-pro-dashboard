"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Building,
  Briefcase,
  LayoutGrid,
  CheckCircle,
  MagnifyingGlassIcon,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  BulkAssignmentProgress,
  AssignmentItem,
} from "./BulkAssignmentProgress";
import { ProgressToast } from "./ProgressToast";
import { useBulkAssignment } from "@/hooks/useBulkAssignment";

// Types (simplified for example)
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

interface EnhancedAssignToProgramsPanelProps {
  filterId: string;
  filterName: string;
  onClose: (selectedIds?: string[]) => void;
  partners: Partner[];
  className?: string;
}

export function EnhancedAssignToProgramsPanel({
  filterId,
  filterName,
  onClose,
  partners,
  className,
}: EnhancedAssignToProgramsPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrograms, setSelectedPrograms] = useState<
    Record<string, boolean>
  >({});
  const [expandedPartners, setExpandedPartners] = useState<string[]>([]);
  const [expandedPrograms, setExpandedPrograms] = useState<string[]>([]);

  // Progress dialog and toast states
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [showProgressToast, setShowProgressToast] = useState(false);
  const [assignmentItems, setAssignmentItems] = useState<AssignmentItem[]>([]);
  const [useCompactMode, setUseCompactMode] = useState(false);

  // Initialize bulk assignment hook
  const {
    items: bulkItems,
    isProcessing,
    progress,
    startAssignment,
    retryFailed,
    resetAssignment,
    getStats,
  } = useBulkAssignment({
    onAssignmentComplete: (results) => {
      console.log("Assignment completed:", results);
      // Auto-close toast after successful completion
      if (results.failed.length === 0) {
        setTimeout(() => {
          setShowProgressToast(false);
          onClose(results.successful.map((item) => item.id));
        }, 3000);
      }
    },
    onProgressUpdate: (current, total) => {
      console.log(`Progress: ${current}/${total}`);
    },
  });

  const stats = getStats();

  // Filter partners based on search
  const filteredPartners = partners.filter(
    (partner) =>
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.programs.some(
        (program) =>
          program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          program.promotedPrograms.some((pp) =>
            pp.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
  );

  // Toggle functions
  const togglePartner = (partnerId: string) => {
    setExpandedPartners((prev) =>
      prev.includes(partnerId)
        ? prev.filter((id) => id !== partnerId)
        : [...prev, partnerId]
    );
  };

  const toggleProgram = (programId: string) => {
    setExpandedPrograms((prev) =>
      prev.includes(programId)
        ? prev.filter((id) => id !== programId)
        : [...prev, programId]
    );
  };

  // Selection handlers
  const handleProgramSelection = (programId: string, checked: boolean) => {
    setSelectedPrograms((prev) => ({
      ...prev,
      [programId]: checked,
    }));
  };

  const handlePartnerSelection = (partner: Partner, checked: boolean) => {
    const updates: Record<string, boolean> = {};
    partner.programs.forEach((program) => {
      program.promotedPrograms.forEach((pp) => {
        updates[pp.id] = checked;
      });
    });

    setSelectedPrograms((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  // Get selected count
  const selectedCount = Object.values(selectedPrograms).filter(Boolean).length;

  // Handle assignment start
  const handleStartAssignment = () => {
    const selectedIds = Object.keys(selectedPrograms).filter(
      (id) => selectedPrograms[id]
    );

    if (selectedIds.length === 0) {
      return;
    }

    // Prepare assignment items
    const preparedItems: AssignmentItem[] = [];
    partners.forEach((partner) => {
      partner.programs.forEach((program) => {
        program.promotedPrograms.forEach((pp) => {
          if (selectedIds.includes(pp.id)) {
            preparedItems.push({
              id: pp.id,
              name: pp.name,
              type: "promotedProgram",
              parentName: `${partner.name} > ${program.name}`,
              status: "pending",
            });
          }
        });
      });
    });

    setAssignmentItems(preparedItems);

    if (useCompactMode) {
      setShowProgressToast(true);
      handleBulkAssignment(preparedItems);
    } else {
      setShowProgressDialog(true);
    }
  };

  // Handle bulk assignment
  const handleBulkAssignment = async (items: AssignmentItem[]) => {
    try {
      await startAssignment({
        filterId,
        items,
        batchSize: 3,
        delayBetweenBatches: 500,
      });
    } catch (error) {
      console.error("Failed to start bulk assignment:", error);
    }
  };

  // Handle dialog close
  const handleCloseProgressDialog = () => {
    setShowProgressDialog(false);

    if (stats.isCompleted) {
      if (stats.successful > 0 && stats.failed === 0) {
        setTimeout(() => {
          const selectedIds = bulkItems
            .filter((item) => item.status === "success")
            .map((item) => item.id);
          onClose(selectedIds);
        }, 1500);
      }
    }
  };

  // Handle toast actions
  const handleViewDetails = () => {
    setShowProgressToast(false);
    setShowProgressDialog(true);
  };

  const handleRetryFromToast = async () => {
    try {
      await retryFailed(filterId);
    } catch (error) {
      console.error("Failed to retry assignments:", error);
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Assign Filter to Programs</h3>
        <p className="text-sm text-gray-600 mt-1">
          Assign "{filterName}" to program campaigns
        </p>

        {/* Mode Toggle */}
        <div className="flex items-center gap-2 mt-3">
          <Label htmlFor="compact-mode" className="text-sm">
            Use compact progress notifications
          </Label>
          <Checkbox
            id="compact-mode"
            checked={useCompactMode}
            onCheckedChange={setUseCompactMode}
          />
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search partners, programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Selection Summary */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {selectedCount} programs selected
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedPrograms({})}
              disabled={selectedCount === 0}
            >
              Clear All
            </Button>
            <Button
              size="sm"
              onClick={handleStartAssignment}
              disabled={selectedCount === 0 || isProcessing}
            >
              Assign Selected ({selectedCount})
            </Button>
          </div>
        </div>
      </div>

      {/* Partners List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {filteredPartners.map((partner) => (
            <div key={partner.id} className="border rounded-lg">
              {/* Partner Header */}
              <div
                className="flex items-center p-3 cursor-pointer hover:bg-gray-50"
                onClick={() => togglePartner(partner.id)}
              >
                <div className="mr-2">
                  {expandedPartners.includes(partner.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>

                <Checkbox
                  checked={partner.programs.every((p) =>
                    p.promotedPrograms.every((pp) => selectedPrograms[pp.id])
                  )}
                  onCheckedChange={(checked) =>
                    handlePartnerSelection(partner, !!checked)
                  }
                  onClick={(e) => e.stopPropagation()}
                />

                <Building className="h-4 w-4 mx-2 text-blue-600" />
                <span className="font-medium">{partner.name}</span>

                <Badge variant="outline" className="ml-auto">
                  {partner.programs.length} programs
                </Badge>
              </div>

              {/* Programs */}
              {expandedPartners.includes(partner.id) && (
                <div className="border-t">
                  {partner.programs.map((program) => (
                    <div key={program.id} className="ml-6">
                      <div
                        className="flex items-center p-3 cursor-pointer hover:bg-gray-50"
                        onClick={() => toggleProgram(program.id)}
                      >
                        <div className="mr-2">
                          {expandedPrograms.includes(program.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>

                        <Briefcase className="h-4 w-4 mr-2 text-green-600" />
                        <span className="font-medium">{program.name}</span>

                        <Badge variant="outline" className="ml-auto">
                          {program.promotedPrograms.length} promoted programs
                        </Badge>
                      </div>

                      {/* Promoted Programs */}
                      {expandedPrograms.includes(program.id) && (
                        <div className="ml-6 border-t">
                          {program.promotedPrograms.map((pp) => (
                            <div
                              key={pp.id}
                              className="flex items-center p-3 hover:bg-gray-50"
                            >
                              <Checkbox
                                checked={!!selectedPrograms[pp.id]}
                                onCheckedChange={(checked) =>
                                  handleProgramSelection(pp.id, !!checked)
                                }
                                disabled={pp.active === false}
                              />

                              <LayoutGrid className="h-4 w-4 mx-2 text-purple-600" />
                              <div className="flex-1">
                                <div className="font-medium">{pp.name}</div>
                                {pp.description && (
                                  <div className="text-xs text-gray-500">
                                    {pp.description}
                                  </div>
                                )}
                              </div>

                              {pp.active === false && (
                                <Badge
                                  variant="outline"
                                  className="bg-gray-100"
                                >
                                  Inactive
                                </Badge>
                              )}
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
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button
            onClick={handleStartAssignment}
            disabled={selectedCount === 0 || isProcessing}
          >
            {isProcessing
              ? "Processing..."
              : `Assign ${selectedCount} Programs`}
          </Button>
        </div>
      </div>

      {/* Progress Dialog */}
      <BulkAssignmentProgress
        isOpen={showProgressDialog}
        onClose={handleCloseProgressDialog}
        filterId={filterId}
        filterName={filterName}
        items={bulkItems.length > 0 ? bulkItems : assignmentItems}
        onStartAssignment={() => handleBulkAssignment(assignmentItems)}
        onRetryFailed={() => retryFailed(filterId)}
      />

      {/* Progress Toast */}
      <ProgressToast
        isVisible={showProgressToast}
        onClose={() => setShowProgressToast(false)}
        title="Assigning Filter"
        description={`Assigning "${filterName}" to ${stats.total} programs`}
        progress={progress}
        stats={stats}
        isCompleted={stats.isCompleted}
        isProcessing={isProcessing}
        onViewDetails={handleViewDetails}
        onRetry={handleRetryFromToast}
      />
    </div>
  );
}
