"use client";

import { CampaignTypeGroups } from "@/components/campaign-templates";
import { Logo } from "@/components/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@loopearn/ui/sidebar";
import { LayoutGrid } from "lucide-react";

interface CampaignSidebarProps {
  selectedType: string | null;
  onSelectType: (type: string) => void;
}

export function CampaignSidebar({
  selectedType,
  onSelectType,
}: CampaignSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="gap-4">
        <Logo className="font-semibold h-8 w-auto" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>All</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={!selectedType}
                  onClick={() => onSelectType("")}
                >
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  All Templates
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {CampaignTypeGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={selectedType === item.id}
                      onClick={() => onSelectType(item.id)}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
