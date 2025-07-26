"use client";

import { ReactNode, forwardRef } from "react";
import { useDraggable, DraggableOptions } from "@/hooks/useDraggable";
import { cn } from "@/lib/utils";

interface DraggableContainerProps {
  children: ReactNode;
  id?: string;
  className?: string;
  draggableOptions?: DraggableOptions;
}

export const DraggableContainer = forwardRef<
  HTMLDivElement,
  DraggableContainerProps
>(({ children, id, className, draggableOptions = {} }, forwardedRef) => {
  const { ref } = useDraggable<HTMLDivElement>(draggableOptions);

  return (
    <div
      ref={(node) => {
        ref.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      }}
      id={id}
      className={cn("space-y-6", className)}
    >
      {children}
    </div>
  );
});

DraggableContainer.displayName = "DraggableContainer";
