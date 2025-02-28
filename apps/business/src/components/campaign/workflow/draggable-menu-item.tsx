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
      data: { title },
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
        "flex items-center p-3 mb-2 bg-white rounded cursor-grab hover:bg-gray-100 transition-all duration-200",
        "active:cursor-grabbing active:scale-95",
        "dark:bg-secondary dark:hover:bg-secondary/80",
        isDragging && "opacity-50",
        className,
      )}
    >
      {Icon && (
        <div className="text-muted-foreground">
          <Icon className="w-4 h-4 mr-2" />
        </div>
      )}
      <span className="font-medium">{title}</span>
      <GripVertical className="w-4 h-4 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
