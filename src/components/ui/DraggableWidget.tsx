"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DraggableWidgetProps {
  children: ReactNode;
  className?: string;
  showHandle?: boolean;
  handlePosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export function DraggableWidget({
  children,
  className,
  showHandle = true,
  handlePosition = "top-right",
}: DraggableWidgetProps) {
  const handlePositionClasses = {
    "top-left": "top-3 left-3",
    "top-right": "top-3 right-3",
    "bottom-left": "bottom-3 left-3",
    "bottom-right": "bottom-3 right-3",
  };

  return (
    <div className={cn("dashboard-widget relative", className)}>
      {showHandle && (
        <span
          className={cn(
            "drag-handle absolute cursor-grab text-gray-400 p-2 rounded-md transition-colors duration-200 hover:bg-gray-100 hover:text-gray-600 active:cursor-grabbing z-10",
            handlePositionClasses[handlePosition]
          )}
          title="Drag to reorder"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </span>
      )}
      {children}
    </div>
  );
}
