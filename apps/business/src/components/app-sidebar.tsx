"use client";

import {
  AppWindow,
  AudioWaveform,
  Brain,
  Command,
  CreditCard,
  Frame,
  GalleryVerticalEnd,
  Home,
  Moon,
  PieChart,
  Settings2,
  Share2,
  Users,
} from "lucide-react";
import type React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@loopearn/ui/sidebar";
import { SidebarOptInForm } from "./sidebar-opt-in-form";
import { TeamSwitcher } from "./team-switcher";

// Dynamically import NavProjects with no SSR

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  dashboard: {
    name: "Dashboard",
    url: "/dashboard",
    icon: <PieChart className="h-10 w-10" />,
  },
  teams: [
    {
      name: "Penelope & The Beauty Bar",
      logo: GalleryVerticalEnd,
      plan: "Beauty & Spa",
    },
    {
      name: "European Rejuvenation Center.",
      logo: AudioWaveform,
      plan: "Health & Fitness",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Health & Fitness",
    },
  ],
  projects: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: <Home className="h-10 w-10" />,
    },
    {
      name: "Campaigns",
      url: "/campaigns",
      icon: <Frame className="h-10 w-10" />,
    },
    {
      name: "Leads",
      url: "/leads",
      icon: <PieChart className="h-10 w-10" />,
    },
    {
      name: "Apps",
      url: "/apps",
      icon: <AppWindow className="h-10 w-10" />,
    },
    {
      name: "Influencers",
      url: "/influencers",
      icon: <Share2 className="h-10 w-10" />,
    },
  ],
  ai: [
    {
      name: "My AI Agent",
      url: "/ai-agent",
      icon: <Brain className="h-10 w-10" />,
    },
  ],
  application: [
    {
      name: "Settings",
      url: "/settings",
      icon: <Settings2 className="h-10 w-10" />,
    },
    {
      name: "Subscription",
      url: "/subscription",
      icon: <CreditCard className="h-10 w-10" />,
    },
    {
      name: "Teams",
      url: "/settings/members",
      icon: <Users className="h-10 w-10" />,
    },
    {
      name: "Theme",
      url: "/theme",
      icon: <Moon className="h-10 w-10" />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarMenu>
            {data.projects.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    {item.icon}
                    <span>{item.name}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>AI</SidebarGroupLabel>
          <SidebarMenu>
            {data.ai.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    {item.icon}
                    <span>{item.name}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarMenu>
            {data.application.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    {item.icon}
                    <span>{item.name}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-1">
          <SidebarOptInForm />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
