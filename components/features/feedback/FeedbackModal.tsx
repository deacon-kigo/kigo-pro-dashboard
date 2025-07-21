"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/molecules/dialog";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Textarea } from "@/components/atoms/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select";
import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  ArrowUpIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { useToast } from "@/lib/hooks/use-toast";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FeedbackType = "bug" | "feature" | "improvement" | "general";

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>("general");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subjectInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Focus management
  useEffect(() => {
    if (isOpen && subjectInputRef.current) {
      // Small delay to ensure modal is fully rendered
      const timeoutId = setTimeout(() => {
        subjectInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  const feedbackTypeOptions = [
    {
      value: "bug",
      label: "Bug Report",
      description: "Report a problem or issue",
      icon: ExclamationTriangleIcon,
    },
    {
      value: "feature",
      label: "Feature Request",
      description: "Suggest a new feature",
      icon: SparklesIcon,
    },
    {
      value: "improvement",
      label: "Improvement",
      description: "Suggest an enhancement",
      icon: ArrowUpIcon,
    },
    {
      value: "general",
      label: "General Feedback",
      description: "Share your thoughts",
      icon: ChatBubbleLeftRightIcon,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!subject.trim() || !description.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Feedback submitted:", {
        type: feedbackType,
        subject,
        description,
        email,
        timestamp: new Date().toISOString(),
      });

      // Show success toast
      toast({
        title: "✅ Feedback Submitted Successfully",
        description:
          "Thank you for your feedback! We appreciate your input and will review it carefully.",
        className: "!bg-green-100 !border-green-300 !text-green-800",
      });

      // Close modal and reset form
      handleClose();
    } catch (err) {
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFeedbackType("general");
      setSubject("");
      setDescription("");
      setEmail("");
      setError(null);
      onClose();
    }
  };

  // Get the current selected feedback type option for display
  const selectedFeedbackType = feedbackTypeOptions.find(
    (option) => option.value === feedbackType
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-white border border-gray-200 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Share Your Feedback
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Help us improve Kigo Pro by sharing your thoughts, suggestions, or
            reporting issues.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="feedback-type"
              className="text-sm font-medium text-gray-700"
            >
              Feedback Type*
            </Label>
            <Select
              value={feedbackType}
              onValueChange={(value: FeedbackType) => setFeedbackType(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select feedback type">
                  {selectedFeedbackType && (
                    <div className="flex items-center gap-2">
                      <selectedFeedbackType.icon
                        className="h-4 w-4 text-gray-500"
                        aria-hidden="true"
                      />
                      <span>{selectedFeedbackType.label}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {feedbackTypeOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-2 text-sm outline-none focus:bg-gray-100 focus:text-gray-900 data-[state=checked]:bg-blue-50 data-[state=checked]:text-blue-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>span:first-child]:hidden"
                  >
                    <div className="flex items-start gap-3 py-1 w-full">
                      <option.icon
                        className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0 data-[state=checked]:text-blue-600"
                        aria-hidden="true"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {option.label}
                        </div>
                        <div className="text-xs text-gray-500">
                          {option.description}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="subject"
              className="text-sm font-medium text-gray-700"
            >
              Subject*
            </Label>
            <Input
              ref={subjectInputRef}
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your feedback"
              disabled={isSubmitting}
              aria-describedby={error ? "feedback-error" : undefined}
              aria-invalid={!!error}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description*
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide detailed feedback. Include steps to reproduce if reporting a bug."
              rows={4}
              className="resize-none"
              disabled={isSubmitting}
              aria-describedby={error ? "feedback-error" : undefined}
              aria-invalid={!!error}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email (Optional)
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com - for follow-up if needed"
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <div
              id="feedback-error"
              className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200"
              role="alert"
              aria-live="polite"
            >
              <ExclamationCircleIcon
                className="h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || !subject.trim() || !description.trim()}
            >
              {isSubmitting ? (
                <>
                  <div
                    className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"
                    aria-hidden="true"
                  />
                  <span aria-live="polite">Submitting...</span>
                </>
              ) : (
                "Submit Feedback"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
