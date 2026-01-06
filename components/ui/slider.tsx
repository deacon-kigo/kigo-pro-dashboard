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
    const [isDragging, setIsDragging] = React.useState(false);
    const singleValue = value[0] || 0;
    const percentage = ((singleValue - min) / (max - min)) * 100;

    const updateValue = (clientX: number) => {
      if (!trackRef.current) return;

      const rect = trackRef.current.getBoundingClientRect();
      const clickPosition = clientX - rect.left;
      const trackWidth = rect.width;
      const clickPercentage = Math.max(
        0,
        Math.min(1, clickPosition / trackWidth)
      );
      const newValue = min + clickPercentage * (max - min);
      const steppedValue = Math.round(newValue / step) * step;
      const clampedValue = Math.max(min, Math.min(max, steppedValue));

      if (onValueChange) {
        onValueChange([clampedValue]);
      }
    };

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      updateValue(event.clientX);
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      event.preventDefault();
      setIsDragging(true);
      updateValue(event.clientX);
    };

    React.useEffect(() => {
      if (!isDragging) return;

      const handleMouseMove = (event: MouseEvent) => {
        updateValue(event.clientX);
      };

      const handleMouseUp = () => {
        setIsDragging(false);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isDragging, min, max, step]);

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
          className="relative h-3 bg-gray-200 rounded-full cursor-pointer"
          onClick={handleClick}
        >
          <div
            className="absolute h-3 bg-blue-500 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
          <div
            className={cn(
              "absolute h-6 w-6 rounded-full bg-white border-3 border-blue-500 shadow-lg top-1/2 -translate-y-1/2 -translate-x-1/2 transition-transform",
              isDragging
                ? "scale-110 cursor-grabbing shadow-xl"
                : "cursor-grab hover:scale-105"
            )}
            style={{ left: `${percentage}%` }}
            onMouseDown={handleMouseDown}
          />
        </div>
      </div>
    );
  }
);

Slider.displayName = "Slider";

export { Slider };
