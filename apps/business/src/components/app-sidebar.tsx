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
  Palette,
  PieChart,
  Settings2,
  Share2,
  Users,
} from "lucide-react";
import type React from "react";
import { Suspense } from "react";

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
  SidebarMenuSkeleton,
  SidebarRail,
} from "@loopearn/ui/sidebar";
import { SidebarOptInForm } from "./sidebar-opt-in-form";
import { TeamMenu } from "./team-menu";
import { TeamSwitcher } from "./team-switcher";
import { ThemeSwitch } from "./theme-switch";
// import { UserSurveyButton } from "./user-survey";

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
    url: "/",
    icon: <PieChart className="h-10 w-10" />,
  },

  projects: [
    {
      name: "Dashboard",
      url: "/",
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
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
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

            <SidebarMenuItem key="theme">
              <SidebarMenuButton>
                <Palette className="h-10 w-10" />
                <span>Theme</span>
                <ThemeSwitch />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* <UserSurveyButton /> */}
        <div className="p-1">
          <SidebarOptInForm />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
