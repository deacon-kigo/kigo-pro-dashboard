"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/atoms/Calendar/Calendar";
import { Button } from "@/components/atoms/Button";
import { Label } from "@/components/atoms/Label";
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
  // Use a simple boolean state for open/close
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Label htmlFor={label}>{label}</Label>
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full justify-start text-left font-normal mt-1",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>

        {isOpen && (
          <div className="absolute mt-2 bg-white border rounded-md shadow-lg z-50">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                onDateChange(newDate || null);
                setIsOpen(false);
              }}
              initialFocus
            />
          </div>
        )}
      </div>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
};

export default DatePickerField;
