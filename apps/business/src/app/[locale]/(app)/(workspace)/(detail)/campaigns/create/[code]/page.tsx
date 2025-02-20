"use client";
import CampaignManager from "@/components/campaign/campaign-manager";
import { CampaignSidebar } from "@/components/campaign/campaign-sidebar";
import { getCampaignTemplate } from "@/utils/campaigns";
import { ExpandingArrow } from "@loopearn/ui/icons";
import { ScrollArea } from "@loopearn/ui/scroll-area";
import { SidebarProvider } from "@loopearn/ui/sidebar";
import Link from "next/link";
import { notFound, redirect, useRouter } from "next/navigation";
import { useState } from "react";

interface CampaignCreatePageProps {
  params: {
    code: string;
  };
}

export default function CampaignCreatePage({
  params,
}: CampaignCreatePageProps) {
  if (!params.code) {
    redirect("/not-found");
  }
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const router = useRouter();
  const template = getCampaignTemplate(params.code.toString());
  if (!template) {
    redirect("/not-found");
  }
  return (
    <div className="flex h-full">
      <SidebarProvider defaultOpen>
        <CampaignSidebar
          selectedType={selectedType}
          onSelectType={(type) => {
            router.push(`/campaigns/create?type=${type}`);
            setSelectedType(type);
          }}
        />

        <ScrollArea
          className="h-[calc(100vh-10px)]  bg-background flex w-full flex-col gap-4 text-left"
          hideScrollbar
        >
          <div className="relative flex flex-col items-center min-h-screen justify-center">
            <div className="flex w-full  md:max-w-3xl flex-col items-center justify-center">
              <CampaignManager
                template={template}
                defaultIcon={template.icon}
                defaultPlatform={template.platform}
              />
            </div>
          </div>
        </ScrollArea>
      </SidebarProvider>
    </div>
  );
}
