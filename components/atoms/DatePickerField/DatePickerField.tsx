"use client";

import React, { useCallback, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/atoms/Calendar/Calendar";
import { Button } from "@/components/atoms/Button";
import { Label } from "@/components/atoms/Label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/Popover/Popover";
import { cn } from "@/lib/utils";

interface DatePickerFieldProps {
  label: string;
  date?: Date;
  onDateChange: (date: Date | null) => void;
  description?: string;
  disabled?: boolean;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  date,
  onDateChange,
  description,
  disabled = false,
}) => {
  // Use internal state for popover open/close to avoid Radix UI update loops
  const [open, setOpen] = useState(false);

  // Memoize date handling to prevent unnecessary updates
  const handleDateSelect = useCallback(
    (newDate: Date | undefined) => {
      onDateChange(newDate || null);
      setOpen(false); // Close the popover after selection
    },
    [onDateChange]
  );

  return (
    <div>
      <Label htmlFor={label}>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "w-full justify-start text-left font-normal mt-1",
              !date && "text-muted-foreground"
            )}
            disabled={disabled}
            onClick={() => setOpen(true)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
};

export default DatePickerField;
