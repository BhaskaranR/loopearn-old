import type { UpdateCampaignFormValues } from "@/actions/schema";
import { type CampaignTemplate, getCampaignTemplate } from "@/utils/campaigns";
import type { CampaignWithActionsRewards } from "@loopearn/supabase/types";
import { Button } from "@loopearn/ui/button";
import {
  ExpandingArrow,
  ExpandingChevronLeft,
  Icons,
} from "@loopearn/ui/icons";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@loopearn/ui/sidebar";
import { Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import type * as React from "react";
import CampaignForm from "./campaign-form";
import CampaignFormReward from "./campaign-form-reward";
import CampaignFormTrigger from "./campaign-form-trigger";

type CampaignRightSidebarProps = React.ComponentProps<typeof Sidebar> & {
  template: CampaignTemplate;
  campaign: CampaignWithActionsRewards;
};

export function CampaignRightSidebar({
  campaign,
  template,
  ...props
}: CampaignRightSidebarProps) {
  const [stepId, setStepId] = useQueryState("stepId");
  const [rewardId, setRewardId] = useQueryState("rewardId");

  // Convert campaign to form values format
  const initialFormData: UpdateCampaignFormValues = {
    id: campaign.id,
    name: campaign.name,
    description: campaign.description,
    type: campaign.type as "SignUp" | "Reward Campaign" | "Other",
    is_repeatable: campaign.is_repeatable,
    max_achievement: campaign.max_achievement,
    min_tier: campaign.min_tier,
    visibility: campaign.visibility as "AlwaysVisible" | "NotVisible",
    status: campaign.status as "active" | "inactive",
    is_live_on_marketplace: campaign.is_live_on_marketplace,
    start_date: campaign.start_date,
    end_date: campaign.end_date,

    campaign_rewards: {
      reward_type: campaign.campaign_rewards?.[0]?.reward_type as
        | "coupon"
        | "rank_points"
        | "wallet_points"
        | "wallet_multiplier"
        | "percentage_discount"
        | "fixed_amount_discount"
        | "free_product"
        | "free_shipping",
      reward_value: campaign.campaign_rewards?.[0]?.reward_value ?? 0,
      reward_unit: campaign.campaign_rewards?.[0]?.reward_unit as
        | "currency"
        | "points"
        | "%",
      minimum_purchase_amount:
        campaign.campaign_rewards?.[0]?.minimum_purchase_amount ?? 0,
      expires_after: campaign.campaign_rewards?.[0]?.expires_after ?? null,
    },
  };

  const selectedAction = (initialFormData.campaign_actions || []).find(
    (action) => action.id === stepId,
  );

  const selectedReward = initialFormData.campaign_rewards;

  if (stepId && stepId !== "reward-coupon") {
    return (
      <Sidebar
        collapsible="none"
        className="sticky hidden lg:flex top-0 h-svh border-l w-[320px]"
        {...props}
      >
        <SidebarHeader className="py-5 border-b border-sidebar-border">
          <div className="flex items-center">
            {/* <Icons.Workflow className="w-4 h-4" /> */}

            <Button
              variant="link"
              className="group flex items-center  p-3 pr-7 text-sm text-black/50 transition-colors enabled:hover:text-black/80"
              onClick={() => setStepId(null)}
            >
              <ExpandingChevronLeft className="size-6" />
            </Button>
            <span>Configure Action</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-5">
          <CampaignFormTrigger
            template={template}
            initialData={selectedAction}
          />
        </SidebarContent>
      </Sidebar>
    );
  }

  if (stepId && stepId === "reward-coupon") {
    return (
      <Sidebar
        collapsible="none"
        className="sticky hidden lg:flex top-0 h-svh border-l w-[320px]"
        {...props}
      >
        <SidebarHeader className="py-5 border-b border-sidebar-border">
          <div className="flex items-center">
            <Button
              variant="link"
              className="group flex items-center  p-3 pr-7 text-sm text-black/50 transition-colors enabled:hover:text-black/80"
              onClick={() => setStepId(null)}
            >
              <ExpandingChevronLeft className="size-6" />
            </Button>
            <span>Configure Action</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-5">
          <CampaignFormReward
            template={template}
            initialData={selectedReward}
          />
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar
      collapsible="none"
      className="sticky hidden lg:flex top-0 h-svh border-l w-[320px]"
      {...props}
    >
      <SidebarHeader className="py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-1">
          <Icons.Workflow className="w-4 h-4" />
          <span>Configure workflow</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-5">
        <CampaignForm template={template} initialData={initialFormData} />
      </SidebarContent>
    </Sidebar>
  );
}
