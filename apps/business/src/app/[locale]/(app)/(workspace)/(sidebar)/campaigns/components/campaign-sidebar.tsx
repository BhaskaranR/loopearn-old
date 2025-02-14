"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@loopearn/ui/sidebar";
import {
  Calculator,
  Calendar,
  Clock,
  Gamepad2,
  Heart,
  LayoutGrid,
  MessageSquarePlus,
  MousePointerClick,
  Settings,
  TrendingUp,
  Trophy,
  UserCheck,
  UserPlus,
} from "lucide-react";

const campaignTypes = [
  {
    label: "Types",
    items: [
      { id: "game-based", label: "Game-Based", icon: Gamepad2 },
      { id: "action-based", label: "Action-Based", icon: MousePointerClick },
      { id: "time-based", label: "Time-Based", icon: Clock },
      { id: "points-multiplier", label: "Points-Multiplier", icon: Calculator },
      { id: "pop-ups", label: "Pop-ups", icon: MessageSquarePlus },
    ],
  },
  {
    label: "Objective",
    items: [
      { id: "gamify", label: "Gamify", icon: Trophy },
      { id: "acquire", label: "Acquire", icon: UserPlus },
      { id: "engage", label: "Engage", icon: Heart },
      { id: "retain", label: "Retain", icon: UserCheck },
      { id: "personalize", label: "Personalize", icon: Settings },
      { id: "grow", label: "Grow", icon: TrendingUp },
      { id: "occasions", label: "Occasions", icon: Calendar },
    ],
  },
];

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

        {campaignTypes.map((group) => (
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
