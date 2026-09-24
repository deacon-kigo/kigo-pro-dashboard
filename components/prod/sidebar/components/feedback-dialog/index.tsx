"use client";

import type { FeedbackFormValues } from "./schema";
import type { Option } from "@/components/prod/select/types";

import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import type { GroupBase, OptionProps, SingleValueProps } from "react-select";
import { components } from "react-select";

import { CheckIcon } from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "@/components/prod/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/prod/dialog";
import { Input } from "@/components/prod/input";
import { Label } from "@/components/prod/label";
import { SingleSelect } from "@/components/prod/select/single";
import { Textarea } from "@/components/prod/textarea";
import { useToast } from "@/components/prod/hooks/use-toast";
import { cn } from "@/components/prod/utils/cn";

import { writeFeedback } from "./actions/write-feedback";
import { FEEDBACK_TYPES } from "./constants";
import { FeedbackFormSchema } from "./schema";

const FEEDBACK_TYPE_OPTIONS = FEEDBACK_TYPES.map((type) => ({
  label: type.label,
  value: type.label,
}));

const SingleValue = <TOption extends Option>({
  data,
  ...props
}: SingleValueProps<TOption, false, GroupBase<TOption>>) => {
  const feedbackType = FEEDBACK_TYPES.find(
    (type) => type.label === data.label
  )!;
  const Icon = feedbackType.icon;

  return (
    <components.SingleValue
      {...props}
      className={cn(props.className, "!flex !items-center !gap-2")}
      data={data}
    >
      <Icon className="size-4" />
      <span className="block font-medium"> {data.label}</span>
    </components.SingleValue>
  );
};

const CustomOption = <TOption extends Option>({
  data,
  ...props
}: OptionProps<TOption, false, GroupBase<TOption>>) => {
  const feedbackType = FEEDBACK_TYPES.find(
    (type) => type.label === data.label
  )!;
  const Icon = feedbackType.icon;
  const { subtitle } = feedbackType;

  return (
    <components.Option
      {...props}
      className={cn(props.className, "!flex !items-center !gap-2")}
      data={data}
    >
      <Icon className="size-4" />
      <div>
        <span className="block font-medium"> {data.label}</span>
        <span className="text-muted-foreground text-xs"> {subtitle}</span>
      </div>
      {props.isSelected && (
        <CheckIcon
          className="absolute top-1/2 right-3 size-4 translate-x-1 -translate-y-1/2"
          data-testid="check-icon"
        />
      )}
    </components.Option>
  );
};

interface FeedBackDialogProps {
  isOpen: boolean;
  onToggleOpen: () => void;
}

const FeedbackDialog = ({ isOpen, onToggleOpen }: FeedBackDialogProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const {
    control,
    formState: { isSubmitting, isValid },
    handleSubmit,
    register,
    reset,
  } = useForm<FeedbackFormValues>({
    defaultValues: {
      description: "",
      feedbackType: FEEDBACK_TYPE_OPTIONS[0]!,
      subject: "",
    },
    mode: "onChange",
    resolver: yupResolver(FeedbackFormSchema),
  });
  const { toast } = useToast();

  const handleCloseDialog = () => {
    reset();
    onToggleOpen();
  };

  const handleSubmitFeedback = async (data: FeedbackFormValues) => {
    try {
      await writeFeedback({ ...data });

      toast({
        description: "Thank you for your feedback!",
        title: "Feedback submitted",
        variant: "success",
      });

      handleCloseDialog();
    } catch {
      toast({
        description: "Something went wrong. Please try again.",
        title: "Error submitting feedback",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog onOpenChange={handleCloseDialog} open={isOpen}>
      <DialogContent ref={dialogRef}>
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
          <DialogDescription>
            Help us improve Kigo Pro by sharing your thoughts, suggestions, or
            reporting issues.
          </DialogDescription>
        </DialogHeader>
        <form
          name="feedback-form"
          onSubmit={handleSubmit(handleSubmitFeedback)}
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="feedbackType">Feedback Type*</Label>
              <Controller
                control={control}
                name="feedbackType"
                render={({ field }) => (
                  <SingleSelect
                    menuPortalTarget={dialogRef.current}
                    menuPosition="fixed"
                    options={FEEDBACK_TYPE_OPTIONS}
                    styles={{
                      /*
                       * * Workaround fix for menu positioning not working properly inside the dialog
                       * * see: https://github.com/JedWatson/react-select/issues/4680#issuecomment-883375414
                       */
                      menuPortal: ({
                        left: _left,
                        top: _top,
                        ...provided
                      }) => ({
                        ...provided,
                      }),
                    }}
                    {...field}
                    className="h-10"
                    components={{ Option: CustomOption, SingleValue }}
                    id="feedbackType"
                  />
                )}
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject*</Label>
              <Input
                {...register("subject")}
                id="subject"
                maxLength={50}
                placeholder="Brief description of your feedback..."
              />
            </div>
            <div>
              <Label htmlFor="description">Description*</Label>
              <Textarea
                {...register("description")}
                id="description"
                placeholder="Please provide detailed. Include steps to reproduce if reporting a bug..."
              />
            </div>
          </div>
          <DialogFooter className="mt-4 gap-2">
            <Button
              color="secondary"
              onClick={handleCloseDialog}
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={isSubmitting || !isValid} type="submit">
              Submit Feedback
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { FeedbackDialog };
