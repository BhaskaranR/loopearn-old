"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@loopearn/ui/cn";
import { GripVertical } from "lucide-react";
import type { ElementType } from "react";

interface DraggableMenuItemProps {
  id: string;
  title: string;
  icon?: ElementType;
  className?: string;
}

export function DraggableMenuItem({
  id,
  title,
  icon: Icon,
  className,
}: DraggableMenuItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
    });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 50 : undefined,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "flex items-center p-3 mb-2 bg-card rounded-lg border shadow-sm",
        "hover:border-primary/50 transition-all duration-200",
        isDragging && "opacity-50",
        className,
      )}
    >
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
  );
}
