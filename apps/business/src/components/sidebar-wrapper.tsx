"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@loopearn/ui/sidebar";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const AssistantModal = dynamic(
  () => import("./assistant/assistant-modal").then((mod) => mod.AssistantModal),
  { ssr: false },
);

const HotKeys = dynamic(() => import("./hot-keys").then((mod) => mod.HotKeys), {
  ssr: false,
});

interface SidebarWrapperProps {
  headerContent: React.ReactNode;
  children?: React.ReactNode;
}

export function SidebarWrapper({
  headerContent,
  children,
}: SidebarWrapperProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="relative">
        {headerContent}
        <div className="relative">{children}</div>
        <AssistantModal />
        <HotKeys />
      </SidebarInset>
    </SidebarProvider>
  );
}
