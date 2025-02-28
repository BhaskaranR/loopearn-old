"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@loopearn/ui/cn";

interface WorkflowCanvasProps {
  className?: string;
}

export function WorkflowCanvas({ className }: WorkflowCanvasProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "h-full w-full rounded-lg border-2 border-dashed p-8",
        isOver ? "border-primary bg-primary/5" : "border-muted",
        className,
      )}
    >
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Drag items here to create your workflow
      </div>
    </div>
  );
}
