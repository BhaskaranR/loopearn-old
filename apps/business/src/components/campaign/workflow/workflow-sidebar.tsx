import type * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@loopearn/ui/sidebar";

import {
  CampaignTemplates,
  CampaignTypeGroups,
} from "@/components/campaign-templates";
import { Badge } from "@loopearn/ui/badge";
import { Calendar } from "@loopearn/ui/calendar";
import { Separator } from "@loopearn/ui/separator";
import {
  Award,
  Gift,
  Mail,
  MessageCircle,
  MessageSquare,
  MinusCircle,
  PlusCircle,
  Smartphone,
  Tag,
  Webhook,
} from "lucide-react";

const data = {
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        {
          title: "Installation",
          url: "#",
        },
        {
          title: "Project Structure",
          url: "#",
        },
      ],
    },
    {
      title: "Building Your Application",
      url: "#",
      items: [
        {
          title: "Routing",
          url: "#",
        },
        {
          title: "Data Fetching",
          url: "#",
          isActive: true,
        },
        {
          title: "Rendering",
          url: "#",
        },
        {
          title: "Caching",
          url: "#",
        },
        {
          title: "Styling",
          url: "#",
        },
        {
          title: "Optimizing",
          url: "#",
        },
        {
          title: "Configuring",
          url: "#",
        },
        {
          title: "Testing",
          url: "#",
        },
        {
          title: "Authentication",
          url: "#",
        },
        {
          title: "Deploying",
          url: "#",
        },
        {
          title: "Upgrading",
          url: "#",
        },
        {
          title: "Examples",
          url: "#",
        },
      ],
    },
    {
      title: "API Reference",
      url: "#",
      items: [
        {
          title: "Components",
          url: "#",
        },
        {
          title: "File Conventions",
          url: "#",
        },
        {
          title: "Functions",
          url: "#",
        },
        {
          title: "next.config.js Options",
          url: "#",
        },
        {
          title: "CLI",
          url: "#",
        },
        {
          title: "Edge Runtime",
          url: "#",
        },
      ],
    },
    {
      title: "Architecture",
      url: "#",
      items: [
        {
          title: "Accessibility",
          url: "#",
        },
        {
          title: "Fast Refresh",
          url: "#",
        },
        {
          title: "Next.js Compiler",
          url: "#",
        },
        {
          title: "Supported Browsers",
          url: "#",
        },
        {
          title: "Turbopack",
          url: "#",
        },
      ],
    },
    {
      title: "Community",
      url: "#",
      items: [
        {
          title: "Contribution Guide",
          url: "#",
        },
      ],
    },
  ],
};

const triggers = [
  { title: "Facebook Follow", icon: "icon-facebook-follow" },
  { title: "Facebook Like", icon: "icon-facebook-like" },
  { title: "Facebook Comment", icon: "icon-facebook-comment" },
  { title: "Facebook Share", icon: "icon-facebook-share" },
  { title: "Facebook Post", icon: "icon-facebook-post" },
  { title: "Facebook Page", icon: "icon-facebook-page" },
  { title: "Facebook Event", icon: "icon-facebook-event" },
];

const gameBasedTriggers = [
  { title: "Facebook Follow", icon: "icon-facebook-follow" },
  { title: "Facebook Like", icon: "icon-facebook-like" },
  { title: "Facebook Comment", icon: "icon-facebook-comment" },
  { title: "Facebook Share", icon: "icon-facebook-share" },
  { title: "Facebook Post", icon: "icon-facebook-post" },
];

const actions = [
  { title: "Reward a Coupon", icon: "icon-coupon" },
  { title: "Add Points", icon: "icon-add-points" },
];

const iconMap = {
  "icon-coupon": <Gift />,
  "icon-badge": <Award />,
  "icon-add-points": <PlusCircle />,
  "icon-event": <Calendar />,
  "icon-tier": <Award />,
  "icon-reward": <Award />,
  "icon-segment-entered": <Award />,
  "icon-segment-exited": <Award />,
  "icon-tag-added": <Award />,
};

export function WorkFlowSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Action Based</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {CampaignTemplates.filter((t) => t.type === "action-based").map(
                (c) => {
                  return (
                    <div
                      key={c.id}
                      className="flex items-center p-3 mb-2 bg-white rounded  hover:bg-gray-100 transition-shadow duration-200"
                      draggable
                      onDragStart={(e) =>
                        e.dataTransfer.setData("text/plain", c.title)
                      }
                    >
                      <c.icon className="w-4 h-4 mr-2" />
                      {c.title}
                    </div>
                  );
                },
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
          {/* <SidebarGroupContent>
            <SidebarMenu>
              {CampaignTemplates.filter((t) => t.type === "game-based").map(
                (c) => {
                  return (
                    <div
                      key={c.id}
                      className="flex items-center p-3 mb-2 bg-white rounded shadow-md hover:shadow-xl hover:bg-gray-100 transition-shadow duration-200"
                      draggable
                      onDragStart={(e) =>
                        e.dataTransfer.setData("text/plain", c.title)
                      }
                    >
                      <div className="text-green-500">
                        <c.icon className="w-4 h-4 mr-2" />
                      </div>
                      <div className="ml-3">
                        <span className="font-medium"> {c.title}</span>
                      </div>
                    </div>
                  );
                },
              )}
            </SidebarMenu>
          </SidebarGroupContent> */}
        </SidebarGroup>

        <Separator />
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <SidebarGroupLabel>Actions</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {actions.map((action) => (
              <div
                key={action.title}
                className="flex items-center p-3 mb-2 bg-white rounded shadow-md hover:shadow-xl hover:bg-gray-100 transition-shadow duration-200"
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData("text/plain", action.title)
                }
              >
                <div className="text-green-500">{iconMap[action.icon]}</div>
                <div className="ml-3">
                  <span className="font-medium">{action.title}</span>
                </div>
              </div>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarFooter>
    </Sidebar>
  );
}
