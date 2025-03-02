import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import type * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from "@loopearn/ui/sidebar";

import {
  CampaignTemplates,
  CampaignTypeGroups,
  actions,
} from "@/components/campaign-templates";
import { Badge } from "@loopearn/ui/badge";
import { cn } from "@loopearn/ui/cn";
import { Separator } from "@loopearn/ui/separator";
import { DraggableMenuItem } from "./draggable-menu-item";

export function WorkFlowSidebar({ className }: { className?: string }) {
  return (
    <Sidebar className={cn("border-r-0", className)}>
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

      <SidebarRail />
      <SidebarFooter>
        <SidebarGroupLabel>Actions</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {actions.map((item) => (
              <DraggableMenuItem
                key={item.id}
                id={item.id}
                title={item.title}
                icon={item.icon}
              />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarFooter>
    </Sidebar>
  );
}
