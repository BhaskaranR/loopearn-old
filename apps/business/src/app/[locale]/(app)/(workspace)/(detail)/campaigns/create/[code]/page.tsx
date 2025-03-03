"use client";
import type { CreateCampaignFormValues } from "@/actions/schema";
import CampaignManager from "@/components/campaign/campaign-manager";
import { CampaignSidebar } from "@/components/campaign/campaign-sidebar";
import { getCampaignTemplate } from "@/utils/campaigns";
import { ScrollArea } from "@loopearn/ui/scroll-area";
import { SidebarProvider } from "@loopearn/ui/sidebar";
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

  // Get the template for UI/defaults
  const template = getCampaignTemplate(params.code.toString());
  if (!template) {
    redirect("/not-found");
  }

  // Create initial form data from template
  const initialFormData: CreateCampaignFormValues = {
    name: template.defaultName,
    description: template.defaultDescription,
    type: template.type,
    is_repeatable: template.is_repeatable,
    max_achievement: template.max_achievement,
    min_tier: template.min_tier,
    visibility: template.visibility,
    status: template.status,
    is_live_on_marketplace: template.is_live_on_marketplace,
    campaign_actions: [
      {
        action_type: template.selectedAction,
        required_count: 1,
        order_index: 0,
        is_mandatory: true,
        platform: template.platform,
        social_link: "",
        icon_url: "",
        redirection_button_text: "",
        redirection_button_link: "",
      },
    ],
    campaign_rewards: {
      reward_type:
        template.campaign_rewards?.reward_type || "percentage_discount",
      reward_value: template.campaign_rewards?.reward_value || 10,
      reward_unit: template.campaign_rewards?.reward_unit || "%",
      uses_per_customer: template.campaign_rewards?.uses_per_customer || 1,
      minimum_purchase_amount:
        template.campaign_rewards?.minimum_purchase_amount || 0,
      expires_after: template.campaign_rewards?.expires_after || null,
    },
  };

  return (
    <div className="flex h-full">
      <SidebarProvider defaultOpen>
        <CampaignSidebar
          selectedType={selectedType}
          onSelectType={(type) => {
            router.push(`/campaigns/create/${type}`);
            setSelectedType(type);
          }}
        />

        <ScrollArea
          className="h-[calc(100vh-10px)] bg-background flex w-full flex-col gap-4 text-left"
          hideScrollbar
        >
          <div className="relative flex flex-col items-center min-h-screen justify-center">
            <div className="flex w-full md:max-w-3xl flex-col items-center justify-center">
              <CampaignManager
                template={template}
                initialData={initialFormData}
                mode="create"
              />
            </div>
          </div>
        </ScrollArea>
      </SidebarProvider>
    </div>
  );
}
