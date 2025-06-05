"use client";

import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { AssignToProgramsPanel } from "./AssignToProgramsPanel";
import { SelectedProgramsDisplay } from "./SelectedProgramsDisplay";
import { clearAssignment } from "@/lib/redux/slices/assignmentSlice";

// Define bulk assignment status
type BulkAssignmentStatus = "idle" | "assigning" | "success" | "failed";

interface AssignmentManagerProps {
  filterId: string;
  filterName: string;
  onClose?: () => void;
  initialSelection?: string[];
}

export function AssignmentManager({
  filterId,
  filterName,
  onClose,
  initialSelection = [],
}: AssignmentManagerProps) {
  const dispatch = useDispatch();
  const [showSelectionPanel, setShowSelectionPanel] = useState(false);
  const [selectedProgramIds, setSelectedProgramIds] =
    useState<string[]>(initialSelection);
  const [bulkAssignmentStatus, setBulkAssignmentStatus] =
    useState<BulkAssignmentStatus>("idle");

  // Mock bulk assignment process
  const handleStartBulkAssignment = useCallback(
    async (selectedIds: string[], totalCount: number) => {
      console.log("🚀 Starting bulk assignment:", { selectedIds, totalCount });

      setBulkAssignmentStatus("assigning");
      setSelectedProgramIds(selectedIds);

      try {
        // Mock POST request to create filter
        console.log("📤 POST /api/filters - Creating filter...");
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock PATCH request to bulk assign
        console.log(
          "📤 PATCH /api/filters/bulk-assign - Assigning to programs..."
        );
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Simulate success/failure (90% success rate)
        const success = Math.random() > 0.1;

        if (success) {
          setBulkAssignmentStatus("success");
          console.log("✅ Bulk assignment completed successfully");
        } else {
          setBulkAssignmentStatus("failed");
          console.log("❌ Bulk assignment failed");
        }
      } catch (error) {
        console.error("💥 Bulk assignment error:", error);
        setBulkAssignmentStatus("failed");
      }
    },
    []
  );

  // Handle retry for failed assignments
  const handleRetryAssignment = useCallback(() => {
    if (selectedProgramIds.length > 0) {
      handleStartBulkAssignment(selectedProgramIds, selectedProgramIds.length);
    }
  }, [selectedProgramIds, handleStartBulkAssignment]);

  // Handle edit button click
  const handleEditClick = useCallback(() => {
    // Clear assignment state when starting fresh
    dispatch(clearAssignment());
    setBulkAssignmentStatus("idle");
    setShowSelectionPanel(true);
  }, [dispatch]);

  // Handle panel close
  const handlePanelClose = useCallback((newSelectedIds?: string[]) => {
    setShowSelectionPanel(false);
    if (newSelectedIds) {
      setSelectedProgramIds(newSelectedIds);
    }
  }, []);

  // Mock partner data for demonstration
  const mockPartners = [
    {
      id: "partner1",
      name: "Augeo",
      programs: [
        {
          id: "prog1",
          name: "LexisNexis",
          promotedPrograms: [
            { id: "pp1", name: "Legal Research Promotion", active: true },
            { id: "pp2", name: "Student Discount Initiative", active: true },
            { id: "pp3", name: "Professional Certification", active: true },
          ],
        },
        {
          id: "prog2",
          name: "Fidelity Investments",
          promotedPrograms: [
            { id: "pp4", name: "Retirement Planning", active: true },
            { id: "pp5", name: "Wealth Management", active: true },
          ],
        },
      ],
    },
    {
      id: "partner2",
      name: "ampliFI",
      programs: [
        {
          id: "prog3",
          name: "Chase",
          promotedPrograms: [
            { id: "pp6", name: "Credit Card Rewards", active: true },
            { id: "pp7", name: "Business Banking Solutions", active: true },
          ],
        },
      ],
    },
  ];

  if (showSelectionPanel) {
    return (
      <AssignToProgramsPanel
        filterId={filterId}
        filterName={filterName}
        onClose={handlePanelClose}
        onStartBulkAssignment={handleStartBulkAssignment}
        initialSelection={selectedProgramIds}
        partnerData={mockPartners}
      />
    );
  }

  return (
    <div className="space-y-4">
      <SelectedProgramsDisplay
        partners={mockPartners}
        selectedProgramIds={selectedProgramIds}
        onEditClick={handleEditClick}
        bulkAssignmentStatus={bulkAssignmentStatus}
        onRetryAssignment={handleRetryAssignment}
      />

      {onClose && (
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
