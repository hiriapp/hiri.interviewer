"use client";

import { useEffect, useRef, useCallback } from "react";
import Sortable, { SortableEvent } from "sortablejs";

export interface DraggableOptions {
  group?: string | { name: string; pull?: boolean; put?: boolean };
  animation?: number;
  handle?: string;
  ghostClass?: string;
  chosenClass?: string;
  dragClass?: string;
  forceFallback?: boolean;
  fallbackClass?: string;
  disabled?: boolean;
  onEnd?: (evt: SortableEvent) => void;
  onStart?: (evt: SortableEvent) => void;
  onSort?: (evt: SortableEvent) => void;
  onAdd?: (evt: SortableEvent) => void;
  onUpdate?: (evt: SortableEvent) => void;
  onRemove?: (evt: SortableEvent) => void;
}

export function useDraggable<T extends HTMLElement = HTMLDivElement>(
  options: DraggableOptions = {}
) {
  const elementRef = useRef<T>(null);
  const sortableRef = useRef<Sortable | null>(null);
  const optionsRef = useRef(options);

  // Update options ref when options change
  optionsRef.current = options;

  const handleEnd = useCallback((evt: SortableEvent) => {
    console.log("Drag ended:", {
      from: evt.from.id || "unknown",
      to: evt.to.id || "unknown",
      oldIndex: evt.oldIndex,
      newIndex: evt.newIndex,
    });
    optionsRef.current.onEnd?.(evt);
  }, []);

  const handleStart = useCallback((evt: SortableEvent) => {
    console.log("Drag started");
    optionsRef.current.onStart?.(evt);
  }, []);

  useEffect(() => {
    if (!elementRef.current) return;

    const defaultOptions = {
      group: "dashboard-widgets",
      animation: 150,
      handle: ".drag-handle",
      ghostClass: "sortable-ghost",
      chosenClass: "sortable-chosen",
      dragClass: "sortable-drag",
      forceFallback: true,
      fallbackClass: "sortable-fallback",
      disabled: false,
      ...optionsRef.current,
      onEnd: handleEnd,
      onStart: handleStart,
    };

    sortableRef.current = Sortable.create(elementRef.current, defaultOptions);

    return () => {
      if (sortableRef.current) {
        sortableRef.current.destroy();
        sortableRef.current = null;
      }
    };
  }, [handleEnd, handleStart]);

  const destroy = () => {
    if (sortableRef.current) {
      sortableRef.current.destroy();
      sortableRef.current = null;
    }
  };

  const setEnabled = (enabled: boolean) => {
    if (sortableRef.current) {
      sortableRef.current.option("disabled", !enabled);
    }
  };

  return {
    ref: elementRef,
    destroy,
    setEnabled,
    sortable: sortableRef.current,
  };
} 