import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import type * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarRail,
} from "@loopearn/ui/sidebar";

import {
  CampaignTemplates,
  CampaignTypeGroups,
} from "@/components/campaign-templates";
import { Badge } from "@loopearn/ui/badge";
import { Separator } from "@loopearn/ui/separator";
import { Award, Calendar, Gift, PlusCircle } from "lucide-react";
import { DraggableMenuItem } from "./draggable-menu-item";

interface Action {
  id: string;
  title: string;
  icon: React.ElementType;
}

const actions: Action[] = [
  { id: "reward-coupon", title: "Reward a Coupon", icon: Gift },
  { id: "add-points", title: "Add Points", icon: PlusCircle },
];

export function WorkFlowSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over) {
      console.log(`Dropped ${active.id} over ${over.id}`);
      // Handle the drop - you can implement your logic here
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Sidebar {...props}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Action Based</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {CampaignTemplates.filter((t) => t.type === "action-based").map(
                  (c) => (
                    <DraggableMenuItem
                      key={c.id}
                      id={c.id}
                      title={c.title}
                      icon={c.icon}
                    />
                  ),
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>
              Game Based
              <Badge variant="blue" className="text-xs ml-2">
                Coming Soon
              </Badge>
            </SidebarGroupLabel>
          </SidebarGroup>

          <Separator />
        </SidebarContent>
        <SidebarRail />
        <SidebarFooter>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {actions.map((action) => (
                <DraggableMenuItem
                  key={action.id}
                  id={action.id}
                  title={action.title}
                  icon={action.icon}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarFooter>
      </Sidebar>
    </DndContext>
  );
}
