"use client";

import React, { useState, createContext, useContext, useRef } from "react";
import { AssignToProgramsPanel } from "./AssignToProgramsPanel";
import { AssignmentItem } from "./BulkAssignmentProgress";
import { useBulkAssignment } from "@/hooks/useBulkAssignment";

// Create context for assignment status
interface AssignmentContextType {
  assignmentItems: AssignmentItem[];
  isProcessing: boolean;
  hasActiveAssignments: boolean;
  startAssignment: (items: AssignmentItem[]) => Promise<void>;
  retryFailed: () => Promise<void>;
}

const AssignmentContext = createContext<AssignmentContextType | null>(null);

export const useAssignmentStatus = () => {
  const context = useContext(AssignmentContext);
  console.log("🔍 useAssignmentStatus called, context is:", context);
  console.log("🔍 context null?", context === null);
  console.log("🔍 context undefined?", context === undefined);

  if (!context) {
    console.log(
      "⚠️ useAssignmentStatus returning fallback values - context is null/undefined"
    );
    return {
      assignmentItems: [],
      isProcessing: false,
      hasActiveAssignments: false,
      startAssignment: async () => {},
      retryFailed: async () => {},
    };
  }

  console.log("✅ useAssignmentStatus returning actual context values");
  console.log("✅ context.startAssignment function:", context.startAssignment);
  return context;
};

interface AssignmentManagerProps {
  filterId: string;
  filterName: string;
  children: React.ReactNode;
}

export function AssignmentManager({
  filterId,
  filterName,
  children,
}: AssignmentManagerProps) {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [assignmentItems, setAssignmentItems] = useState<AssignmentItem[]>([]);

  // Initialize bulk assignment hook
  const {
    items: bulkItems,
    isProcessing,
    startAssignment: startBulkAssignment,
    retryFailed,
    resetAssignment,
    getStats,
  } = useBulkAssignment({
    onAssignmentComplete: (results) => {
      console.log("Assignment completed:", results);
      const stats = getStats();

      // Keep the assignment items visible even after completion
      // Auto-clear after successful completion
      if (stats.failed === 0) {
        setTimeout(() => {
          setAssignmentItems([]);
          resetAssignment();
        }, 5000);
      }
    },
    onProgressUpdate: (current, total) => {
      console.log(`Progress: ${current}/${total}`);
    },
  });

  // Handle starting assignment from child components
  const handleStartAssignment = async (items: AssignmentItem[]) => {
    console.log("🚀 Assignment started with items:", items);
    console.log("🚀 handleStartAssignment called in AssignmentManager");
    setAssignmentItems(items);

    try {
      await startBulkAssignment({
        filterId,
        items,
        batchSize: 3,
        delayBetweenBatches: 500,
      });
      console.log("✅ Assignment initiated successfully");
    } catch (error) {
      console.error("❌ Failed to start bulk assignment:", error);
    }
  };

  // Handle retrying failed assignments
  const handleRetryFailed = async () => {
    try {
      await retryFailed(filterId);
    } catch (error) {
      console.error("Failed to retry assignment:", error);
    }
  };

  // Context value
  const contextValue: AssignmentContextType = {
    assignmentItems: bulkItems.length > 0 ? bulkItems : assignmentItems,
    isProcessing,
    hasActiveAssignments:
      (bulkItems.length > 0 ? bulkItems : assignmentItems).length > 0,
    startAssignment: handleStartAssignment,
    retryFailed: handleRetryFailed,
  };

  console.log(
    "🔧 AssignmentManager creating context with startAssignment function:",
    handleStartAssignment
  );

  // Debug logging - only log when assignment items change
  const prevItemsCount = useRef(0);
  if (contextValue.assignmentItems.length !== prevItemsCount.current) {
    console.log("📊 AssignmentManager context value changed:", {
      assignmentItemsCount: contextValue.assignmentItems.length,
      isProcessing: contextValue.isProcessing,
      hasActiveAssignments: contextValue.hasActiveAssignments,
      bulkItemsCount: bulkItems.length,
      localAssignmentItemsCount: assignmentItems.length,
    });
    prevItemsCount.current = contextValue.assignmentItems.length;
  }

  return (
    <AssignmentContext.Provider value={contextValue}>
      {children}

      {/* Optional status modal for detailed view - only show if explicitly requested */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
            <AssignToProgramsPanel
              filterId={filterId}
              filterName={filterName}
              onClose={() => setShowStatusModal(false)}
              statusMode={true}
              assignmentItems={
                bulkItems.length > 0 ? bulkItems : assignmentItems
              }
              onRetryFailed={handleRetryFailed}
            />
          </div>
        </div>
      )}
    </AssignmentContext.Provider>
  );
}
