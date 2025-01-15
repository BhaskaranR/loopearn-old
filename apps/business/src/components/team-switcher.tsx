"use client";
import { changeTeamAction } from "@/actions/change-team-action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@loopearn/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@loopearn/ui/sidebar";
import { ChevronsUpDown, Plus } from "lucide-react";
import Image from "next/image";
import * as React from "react";

export const TeamSwitcher = () => {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(null);
  const [teams, setTeams] = React.useState([]);

  React.useEffect(() => {
    async function fetchTeams() {
      try {
        const response = await fetch("/api/teams");
        if (!response.ok) {
          throw new Error("Failed to fetch teams");
        }
        const data = await response.json();
        setTeams(data);
        setActiveTeam(data[0]); // Set the first team as active by default
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    }

    fetchTeams();
  }, []);

  if (!activeTeam)
    return <div className="size-8 bg-gray-200 animate-pulse rounded-full" />;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {activeTeam?.avatar_url ? (
                  <Image
                    src={activeTeam.avatar_url}
                    alt={activeTeam.business_name}
                    width={24}
                    height={24}
                    className="size-4 shrink-0"
                  />
                ) : (
                  <div className="size-4 shrink-0 bg-gray-200 animate-pulse rounded-full">
                    {/* Skeleton loader for avatar */}
                  </div>
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTeam?.business_name}
                </span>
                <span className="truncate text-xs">{activeTeam?.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Organizations
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.id}
                onClick={() => setActiveTeam(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  {team.avatar_url ? (
                    <Image
                      src={team.avatar_url}
                      alt={team.business_name}
                      width={24}
                      height={24}
                      className="size-4 shrink-0"
                    />
                  ) : (
                    <div className="size-4 shrink-0 bg-gray-200 animate-pulse rounded-full">
                      {/* Skeleton loader for avatar */}
                    </div>
                  )}
                </div>
                {team.business_name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
