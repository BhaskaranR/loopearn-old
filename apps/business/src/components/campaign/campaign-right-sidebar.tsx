import { Plus } from "lucide-react";
import type * as React from "react";

import { emptyTemplate } from "@/utils/campaigns";
import { Icons } from "@loopearn/ui/icons";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@loopearn/ui/sidebar";

export function CampaignRightSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="none"
      className="sticky hidden lg:flex top-0 h-svh border-l"
      {...props}
    >
      <SidebarHeader className="py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-1">
          <Icons.Workflow className="w-4 h-4" />
          <span>Configure workflow</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarSeparator className="mx-0" />
      </SidebarContent>
    </Sidebar>
  );
}
