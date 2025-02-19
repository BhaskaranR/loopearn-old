"use client";
import CampaignManager from "@/components/campaign/campaign-manager";
import { CampaignSidebar } from "@/components/campaign/campaign-sidebar";
import { getCampaignTemplate } from "@/utils/campaigns";
import { ExpandingArrow } from "@loopearn/ui/icons";
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
        <div className="flex-1 space-y-6 p-8 pt-6">
          <CampaignManager
            template={template}
            defaultIcon={template.icon}
            defaultPlatform={template.platform}
          />
        </div>
      </SidebarProvider>
    </div>
  );
}
