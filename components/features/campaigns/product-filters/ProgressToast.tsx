"use client";

import React from "react";
import { Badge } from "@/components/atoms/Badge";
import Progress from "@/components/atoms/Progress/Progress";
import { Button } from "@/components/atoms/Button";
import { CheckCircle, XCircle, Loader2, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProgressToastProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  progress: {
    current: number;
    total: number;
  };
  stats: {
    successful: number;
    failed: number;
    processing: number;
    pending: number;
  };
  isCompleted: boolean;
  isProcessing: boolean;
  onViewDetails?: () => void;
  onRetry?: () => void;
  className?: string;
}

export function ProgressToast({
  isVisible,
  onClose,
  title,
  description,
  progress,
  stats,
  isCompleted,
  isProcessing,
  onViewDetails,
  onRetry,
  className,
}: ProgressToastProps) {
  if (!isVisible) return null;

  const progressPercentage =
    progress.total > 0 ? (progress.current / progress.total) * 100 : 0;
  const hasErrors = stats.failed > 0;
  const hasSuccess = stats.successful > 0;

  // Determine toast color scheme based on status
  const getToastStyle = () => {
    if (isCompleted) {
      if (hasErrors && hasSuccess) {
        return "bg-amber-50 border-amber-200";
      } else if (hasErrors) {
        return "bg-red-50 border-red-200";
      } else {
        return "bg-green-50 border-green-200";
      }
    }
    return "bg-blue-50 border-blue-200";
  };

  // Status icon
  const StatusIcon = () => {
    if (isProcessing) {
      return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
    }
    if (isCompleted) {
      if (hasErrors && hasSuccess) {
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      } else if (hasErrors) {
        return <XCircle className="h-5 w-5 text-red-600" />;
      } else {
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      }
    }
    return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
  };

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 w-96 max-w-sm bg-white border rounded-lg shadow-lg z-50 transform transition-all duration-300 ease-in-out",
        getToastStyle(),
        isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        className
      )}
      role="alert"
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <StatusIcon />
            <div>
              <h4 className="text-sm font-medium text-gray-900">{title}</h4>
              {description && (
                <p className="text-xs text-gray-600 mt-1">{description}</p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Progress</span>
            <span className="text-xs text-gray-600">
              {progress.current} / {progress.total}
            </span>
          </div>
          <Progress
            value={progressPercentage}
            className="w-full"
            size="sm"
            color={
              hasErrors
                ? hasSuccess
                  ? "warning"
                  : "danger"
                : isCompleted
                  ? "success"
                  : "primary"
            }
          />
        </div>

        {/* Status Badges */}
        <div className="flex gap-1 mb-3 flex-wrap">
          {stats.successful > 0 && (
            <Badge className="bg-green-100 text-green-800 text-xs px-2 py-0.5">
              {stats.successful} completed
            </Badge>
          )}
          {stats.failed > 0 && (
            <Badge className="bg-red-100 text-red-800 text-xs px-2 py-0.5">
              {stats.failed} failed
            </Badge>
          )}
          {stats.processing > 0 && (
            <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5">
              {stats.processing} processing
            </Badge>
          )}
          {stats.pending > 0 && (
            <Badge className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5">
              {stats.pending} pending
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end">
          {onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewDetails}
              className="text-xs h-7"
            >
              View Details
            </Button>
          )}
          {isCompleted && hasErrors && onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="text-xs h-7"
            >
              Retry Failed
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
