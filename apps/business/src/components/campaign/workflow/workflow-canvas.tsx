"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@loopearn/ui/cn";
import { Separator } from "@loopearn/ui/separator";
import { WorkflowItem } from "./workflow-item";

interface WorkflowCanvasProps {
  className?: string;
  triggerItems: Array<{
    id: string;
    title: string;
    icon?: React.ElementType;
  }>;
  rewardItems: Array<{
    id: string;
    title: string;
    icon?: React.ElementType;
  }>;
}

function DroppableContainer({
  id,
  items,
  title,
  className,
}: {
  id: string;
  items: WorkflowCanvasProps["triggerItems"];
  title: string;
  className?: string;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "rounded-lg border-2 border-dashed p-4 mx-auto",
        "transition-colors duration-200",
        isOver ? "border-primary bg-primary/5" : "border-muted",
        className,
      )}
    >
      <h3 className="text-lg font-semibold mb-2 capitalize">{title}</h3>
      <Separator className="my-2" />
      {items.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-muted-foreground">
          Drag {title} here
        </div>
      ) : (
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((item) => (
              <WorkflowItem
                key={item.id}
                id={item.id}
                title={item.title}
                icon={item.icon}
              />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
}

export function WorkflowCanvas({
  className,
  triggerItems,
  rewardItems,
}: WorkflowCanvasProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <DroppableContainer
        id="triggers-container"
        items={triggerItems}
        title="triggers"
        className="max-w-xl h-[80%] mx-auto"
      />

      <DroppableContainer
        id="rewards-container"
        items={rewardItems}
        title="rewards"
        className="max-w-xl mx-auto"
      />
    </div>
  );
}
