"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@loopearn/ui/button";
import { cn } from "@loopearn/ui/cn";
import { GripVertical, Settings } from "lucide-react";
import type { CSSProperties } from "react";

interface WorkflowItemProps {
  id: string;
  title: string;
  icon?: React.ElementType;
  className?: string;
  onConfigure?: () => void;
}

export function WorkflowItem({
  id,
  title,
  icon: Icon,
  className,
  onConfigure,
}: WorkflowItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        "relative flex flex-col p-4 bg-card rounded-lg border shadow-sm w-full",
        "hover:border-primary/50 transition-all duration-200",
        isDragging && ["opacity-75", "border-primary", "shadow-lg", "z-50"],
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 flex-1">
          {Icon && (
            <div className={cn("text-muted-foreground")}>
              <Icon className="w-4 h-4" />
            </div>
          )}
          <span className="font-medium">{title}</span>
        </div>
        <div
          {...listeners}
          className="touch-none cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
