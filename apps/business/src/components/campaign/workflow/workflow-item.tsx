"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@loopearn/ui/button";
import { cn } from "@loopearn/ui/cn";
import { GripVertical, Settings } from "lucide-react";
import type { ElementType } from "react";

interface WorkflowItemProps {
  id: string;
  title: string;
  icon?: ElementType;
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "flex flex-col p-4 bg-card rounded-lg border shadow-sm",
        "hover:border-primary/50 transition-all duration-200",
        isDragging && "opacity-50",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 flex-1">
          {Icon && (
            <div className="text-muted-foreground">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <span className="font-medium">{title}</span>
        </div>
        <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
      </div>

      <Button
        variant="link"
        className="mt-2 pl-0 text-xs text-muted-foreground hover:text-primary"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onConfigure?.();
        }}
      >
        <Settings className="w-3 h-3 mr-1" />
        Configure
      </Button>
    </div>
  );
}
