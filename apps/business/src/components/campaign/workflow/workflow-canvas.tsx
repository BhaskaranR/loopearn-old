"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@loopearn/ui/cn";
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
  onConfigure?: (item: WorkflowCanvasProps["triggerItems"][0]) => void;
}

function DroppableContainer({
  id,
  items,
  title,
  className,
  onConfigure,
}: {
  id: string;
  items: WorkflowCanvasProps["triggerItems"];
  title: string;
  className?: string;
  onConfigure?: WorkflowCanvasProps["onConfigure"];
}) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "rounded-lg border-2 border-dashed p-4 max-w-2xl mx-auto",
        isOver ? "border-primary bg-primary/5" : "border-muted",
        className,
      )}
    >
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
                {...item}
                onConfigure={() => onConfigure?.(item)}
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
  onConfigure,
}: WorkflowCanvasProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <h3 className="text-lg font-semibold mb-2">Triggers</h3>
        <DroppableContainer
          id="triggers-container"
          items={triggerItems}
          title="triggers"
          onConfigure={onConfigure}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Rewards</h3>
        <DroppableContainer
          id="rewards-container"
          items={rewardItems}
          title="rewards"
          onConfigure={onConfigure}
        />
      </div>
    </div>
  );
}
