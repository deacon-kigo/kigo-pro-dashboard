"use client";

import React from "react";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Badge } from "./badge";
import { CheckCircle, XCircle, Clock, User, AlertTriangle } from "lucide-react";
import { useHumanInTheLoop } from "../../lib/hooks/useHumanInTheLoop";

interface ApprovalWorkflowUIProps {
  className?: string;
}

export function ApprovalWorkflowUI({ className }: ApprovalWorkflowUIProps) {
  const {
    activeWorkflows,
    currentWorkflow,
    currentItemIndex,
    approveItem,
    rejectItem,
    modifyItem,
    completeWorkflow,
    cancelWorkflow,
  } = useHumanInTheLoop();

  // Don't render if no active workflows
  if (!currentWorkflow || activeWorkflows.length === 0) {
    return null;
  }

  const currentItem = currentWorkflow.items[currentItemIndex];
  const totalItems = currentWorkflow.items.length;
  const isLastItem = currentItemIndex === totalItems - 1;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "modified":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "modified":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${className}`}
    >
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {currentWorkflow.title}
              </CardTitle>
              <CardDescription>{currentWorkflow.description}</CardDescription>
            </div>
            <Badge variant="outline">
              {currentItemIndex + 1} of {totalItems}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentItemIndex + 1) / totalItems) * 100}%`,
              }}
            />
          </div>

          {/* Current Item */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">{currentItem.title}</h3>
              <Badge className={getStatusColor(currentItem.status)}>
                {getStatusIcon(currentItem.status)}
                {currentItem.status}
              </Badge>
            </div>

            <p className="text-gray-600 mb-4">{currentItem.description}</p>

            {/* Current Item Data */}
            {currentItem.data && (
              <div className="bg-white rounded-md p-3 mb-4">
                <h4 className="font-medium mb-2">Details:</h4>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(currentItem.data, null, 2)}
                </pre>
              </div>
            )}

            {/* Action Buttons for Current Item */}
            {currentItem.status === "pending" && (
              <div className="flex gap-2">
                <Button
                  onClick={() => approveItem(currentItem.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => rejectItem(currentItem.id, "User rejected")}
                  variant="destructive"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() =>
                    modifyItem(currentItem.id, {
                      ...currentItem.data,
                      modified: true,
                    })
                  }
                  variant="outline"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Modify
                </Button>
              </div>
            )}
          </div>

          {/* Workflow Summary */}
          <div className="space-y-2">
            <h4 className="font-medium">All Items:</h4>
            {currentWorkflow.items.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-2 rounded-md ${
                  index === currentItemIndex
                    ? "bg-blue-50 border border-blue-200"
                    : "bg-gray-50"
                }`}
              >
                <span className="text-sm">{item.title}</span>
                <Badge className={getStatusColor(item.status)}>
                  {getStatusIcon(item.status)}
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>

          {/* Workflow Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              onClick={() => cancelWorkflow(currentWorkflow.id)}
              variant="outline"
            >
              Cancel Workflow
            </Button>

            {isLastItem && currentItem.status !== "pending" && (
              <Button
                onClick={() => completeWorkflow(currentWorkflow.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                Complete Workflow
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ApprovalWorkflowUI;
