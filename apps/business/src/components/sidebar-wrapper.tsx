"use client";

import { AppSidebar } from "@/components/app-sidebar";
// import { Header } from "@/components/header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@loopearn/ui/breadcrumb";
import { Separator } from "@loopearn/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@loopearn/ui/sidebar";
import dynamic from "next/dynamic";

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
