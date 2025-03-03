"use client";

import { CampaignTemplates, actions } from "@/components/campaign-templates";
import { WorkflowCanvas } from "@/components/campaign/workflow/workflow-canvas";
import { WorkflowItem } from "@/components/campaign/workflow/workflow-item";
import { WorkFlowSidebar } from "@/components/campaign/workflow/workflow-sidebar";
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Button } from "@loopearn/ui/button";
import { Input } from "@loopearn/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@loopearn/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@loopearn/ui/sheet";
import { SidebarInset, SidebarProvider } from "@loopearn/ui/sidebar";
import {
  ArrowLeft,
  Clock,
  Crown,
  Mail,
  MessageSquare,
  MinusCircle,
  Phone,
  Play,
  PlusCircle,
  Settings,
  Star,
  Tag,
  Webhook,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface WorkflowItemType {
  id: string;
  title: string;
  icon?: React.ElementType;
  type: "trigger" | "reward";
}

export default function WorkflowPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WorkflowItemType | null>(
    null,
  );
  const [triggerItems, setTriggerItems] = useState<WorkflowItemType[]>([]);
  const [rewardItems, setRewardItems] = useState<WorkflowItemType[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const router = useRouter();

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    if (over.id === "triggers-container") {
      // Item was dropped in triggers container
      const draggedItem = CampaignTemplates.find(
        (item) => item.id === active.id,
      );
      if (draggedItem) {
        setTriggerItems((items) => [...items, { ...draggedItem }]);
      }
    } else if (over.id === "rewards-container") {
      // Item was dropped in rewards container
      const draggedItem = actions.find((item) => item.id === active.id);
      if (draggedItem) {
        setRewardItems((items) => [...items, { ...draggedItem }]);
      }
    } else {
      // Handle reordering within containers
      const container = over.id.includes("triggers")
        ? triggerItems
        : rewardItems;
      const setItems = over.id.includes("triggers")
        ? setTriggerItems
        : setRewardItems;

      const oldIndex = container.findIndex((item) => item.id === active.id);
      const newIndex = container.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        setItems((items) => arrayMove(items, oldIndex, newIndex));
      }
    }
  };

  const activeItem = activeId
    ? [...CampaignTemplates, ...triggerItems, ...rewardItems].find(
        (item) => item.id === activeId,
      )
    : null;

  const handleConfigure = (item: WorkflowItemType) => {
    setSelectedItem(item);
    setIsSheetOpen(true);
  };

  return (
    <SidebarProvider>
      <div className="h-screen w-full flex flex-col">
        {/* Header */}
        <header className="border-b bg-background p-4 z-30">
          <div className="flex items-center justify-between max-w-[1400px] mx-auto">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/campaigns/create")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-semibold">Advanced Campaign</h1>
            </div>
            <div className="flex-1 max-w-[400px] mx-4">
              <Input placeholder="Workflow Name" className="h-9 text-base" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Close
              </Button>
              <Button variant="outline" size="sm">
                Save as draft
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button size="sm">
                <Play className="h-4 w-4 mr-2" />
                Execute
              </Button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="flex-1">
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex h-full">
              <WorkFlowSidebar className="h-full py-10" />
              <div className="flex-1 p-4 bg-dot-pattern">
                <WorkflowCanvas
                  triggerItems={triggerItems}
                  rewardItems={rewardItems}
                  onConfigure={handleConfigure}
                />
              </div>
            </div>

            <DragOverlay>
              {activeItem ? (
                <WorkflowItem
                  id={activeItem.id}
                  title={activeItem.title}
                  icon={activeItem.icon}
                />
              ) : null}
            </DragOverlay>
          </DndContext>

          {/* Coupon Sheet */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>
                  {selectedItem?.title || "Configure Item"}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <div className="space-y-4">
                  {selectedItem?.type === "trigger" ? (
                    <div>Trigger</div>
                  ) : (
                    <div>Reward</div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </SidebarProvider>
  );
}
