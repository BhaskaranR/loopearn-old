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
      <div className="absolute right-0 top-0">
        <Link
          href="/campaigns"
          className="group flex items-center gap-1 p-3 pr-7 text-sm text-black/50 transition-colors enabled:hover:text-black/80"
        >
          Exit
          <ExpandingArrow className="size-3" />
        </Link>
      </div>
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
