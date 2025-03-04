"use client";

import { CampaignTemplates, actions } from "@/components/campaign-templates";
import { CampaignRightSidebar } from "@/components/campaign/campaign-right-sidebar";
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@loopearn/ui/breadcrumb";
import { SidebarInset, SidebarProvider } from "@loopearn/ui/sidebar";
import { Home } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface WorkflowItemType {
  id: string;
  title: string;
  icon?: React.ElementType;
  type: "trigger" | "reward";
}

interface WorkflowPageProps {
  campaignId: string;
  campaign;
}

export function WorkflowPage({ campaignId, campaign }: WorkflowPageProps) {
  const [selectedItem, setSelectedItem] = useState<WorkflowItemType | null>(
    null,
  );
  const [triggerItems, setTriggerItems] = useState<WorkflowItemType[]>(
    campaign.actions ||
      []
        .filter((action) => action.action_type === "trigger")
        .map((action) => ({
          id: action.id,
          title: action.title,
          icon: action.icon,
          type: "trigger",
        })),
  );
  const [rewardItems, setRewardItems] = useState<WorkflowItemType[]>(
    campaign.rewards ||
      []
        .filter((reward) => reward.reward_type === "reward")
        .map((reward) => ({
          id: reward.id,
          title: reward.title,
          icon: reward.icon,
          type: "reward",
        })),
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    if (over.id === "triggers-container") {
      const draggedItem = CampaignTemplates.find(
        (item) => item.id === active.id,
      );
      if (draggedItem) {
        setTriggerItems((items) => [
          ...items,
          { ...draggedItem, id: `trigger_${draggedItem.id}` },
        ]);
      }
    } else if (over.id === "rewards-container") {
      const draggedItem = actions.find((item) => item.id === active.id);
      if (draggedItem) {
        setRewardItems((items) => [...items, { ...draggedItem }]);
      }
    } else {
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
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <header className="border-b bg-background p-4 z-30">
        <div className="flex items-center justify-between max-w-[1400px] mx-auto">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">
                    <Home className="h-4 w-4" />
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />

              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/campaigns">Campaigns</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Advanced Campaign</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <SidebarProvider className="h-full">
        <WorkFlowSidebar />
        <SidebarInset>
          <WorkflowCanvas
            className="mt-10"
            triggerItems={triggerItems}
            rewardItems={rewardItems}
            onConfigure={handleConfigure}
          />
          <DragOverlay>
            {activeItem ? (
              <WorkflowItem
                id={activeItem.id}
                title={activeItem.title}
                icon={activeItem.icon}
              />
            ) : null}
          </DragOverlay>
        </SidebarInset>

        <CampaignRightSidebar />
      </SidebarProvider>
    </DndContext>
  );
}
