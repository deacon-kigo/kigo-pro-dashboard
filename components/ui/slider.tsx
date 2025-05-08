"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps {
  value: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      value = [0],
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const trackRef = React.useRef<HTMLDivElement>(null);
    const singleValue = value[0] || 0;
    const percentage = ((singleValue - min) / (max - min)) * 100;

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (!trackRef.current) return;

      const rect = trackRef.current.getBoundingClientRect();
      const clickPosition = event.clientX - rect.left;
      const trackWidth = rect.width;
      const clickPercentage = clickPosition / trackWidth;
      const newValue = min + clickPercentage * (max - min);
      const steppedValue = Math.round(newValue / step) * step;
      const clampedValue = Math.max(min, Math.min(max, steppedValue));

      if (onValueChange) {
        onValueChange([clampedValue]);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full py-4",
          disabled ? "opacity-50 pointer-events-none" : "",
          className
        )}
        {...props}
      >
        <div
          ref={trackRef}
          className="h-2 bg-gray-200 rounded-full cursor-pointer"
          onClick={handleClick}
        >
          <div
            className="absolute h-2 bg-primary rounded-full"
            style={{ width: `${percentage}%` }}
          />
          <div
            className="absolute h-5 w-5 rounded-full bg-white border-2 border-primary top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-grab"
            style={{ left: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

Slider.displayName = "Slider";

export { Slider };
