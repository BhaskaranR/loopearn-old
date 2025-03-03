import type { UpdateCampaignFormValues } from "@/actions/schema";
import CampaignManager from "@/components/campaign/campaign-manager";
import { getCampaignTemplate } from "@/utils/campaigns";
import { getCampaignById } from "@loopearn/supabase/cached-queries";
import { notFound } from "next/navigation";

interface CampaignDetailPageProps {
  params: {
    id: string;
  };
}

export default async function CampaignDetailPage({
  params,
}: CampaignDetailPageProps) {
  const { data: campaign } = await getCampaignById(params.id);

  if (!campaign) {
    return notFound();
  }

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
    campaign_actions: [
      {
        action_type: campaign.campaign_actions?.[0]?.action_type ?? "",
        social_link: campaign.campaign_actions?.[0]?.social_link ?? "",
        action_details: campaign.campaign_actions?.[0]?.action_details ?? "",
        required_count: campaign.campaign_actions?.[0]?.required_count ?? 1,
        order_index: campaign.campaign_actions?.[0]?.order_index ?? 0,
        is_mandatory: campaign.campaign_actions?.[0]?.is_mandatory ?? true,
        platform: campaign.campaign_actions?.[0]?.platform,
        icon_url: campaign.campaign_actions?.[0]?.icon_url,
        redirection_button_text:
          campaign.campaign_actions?.[0]?.redirection_button_text,
        redirection_button_link:
          campaign.campaign_actions?.[0]?.redirection_button_link,
      },
    ],
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

  const template = getCampaignTemplate(
    campaign.campaign_actions?.[0]?.platform,
  );

  if (!template) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <CampaignManager
        mode="edit"
        initialData={initialFormData}
        template={template}
      />
    </div>
  );
}
