"use server";

import { LogEvents } from "@loopearn/events/events";
import {
  type CreateCampaignParams,
  createCampaign as createCampaignMutation,
  createCampaignTriggerAction,
  createCampaignTriggerReward,
  deleteCampaign as deleteCampaignMutation,
  updateCampaign as updateCampaignMutation,
} from "@loopearn/supabase/mutations";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authActionClient } from "./safe-action";
import {
  campaignActionSchema,
  campaignRewardSchema,
  createCampaignActionSchema,
  createCampaignRewardSchema,
  createCampaignSchema,
  updateCampaignSchema,
} from "./schema";

export const createCampaignAction = authActionClient
  .schema(createCampaignSchema)
  .metadata({
    name: "create-campaign",
    track: {
      event: LogEvents.CampaignCreate.name,
      channel: LogEvents.CampaignCreate.channel,
    },
  })
  .action(async ({ parsedInput, ctx: { user, supabase } }) => {
    const params: CreateCampaignParams = {
      business_id: user.business_id,
      name: parsedInput.name,
      description: parsedInput.description,
      type: parsedInput.type,
      is_repeatable: parsedInput.is_repeatable,
      max_achievement: parsedInput.max_achievement,
      min_tier: parsedInput.min_tier,
      visibility: parsedInput.visibility,
      status: parsedInput.status,
      start_date: parsedInput.start_date || new Date().toISOString(),
      end_date: parsedInput.end_date || null,
      expires_after: null,
      is_live_on_marketplace: parsedInput.is_live_on_marketplace,
      actions: (parsedInput.campaign_actions || []).map((action, index) => ({
        action_type: action.action_type ?? "",
        action_details: action.action_details,
        required_count: action.required_count ?? 1,
        order_index: action.order_index ?? index,
        is_mandatory: action.is_mandatory ?? true,
        social_link: action.social_link,
        platform: action.platform,
        icon_url: action.icon_url ?? null,
        redirection_button_text: action.redirection_button_text ?? null,
        redirection_button_link: action.redirection_button_link ?? null,
      })),
      reward: parsedInput.campaign_rewards
        ? {
            reward_type: parsedInput.campaign_rewards.reward_type,
            reward_value: parsedInput.campaign_rewards.reward_value,
            reward_unit: parsedInput.campaign_rewards.reward_unit,
            coupon_code: null,
            uses_per_customer: parsedInput.campaign_rewards.uses_per_customer,
            minimum_purchase_amount:
              parsedInput.campaign_rewards.minimum_purchase_amount ?? 0,
            expires_after: parsedInput.campaign_rewards.expires_after ?? null,
          }
        : undefined,
    };

    const campaign = await createCampaignMutation(supabase, params);
    revalidateTag(`campaigns_${user.business_id}`);

    if (parsedInput.redirect_to) {
      redirect(`${parsedInput.redirect_to}/${campaign.id}`);
    } else {
      return { success: true, id: campaign.id };
    }
  });

export const updateCampaignAction = authActionClient
  .schema(updateCampaignSchema)
  .metadata({
    name: "update-campaign",
    track: {
      event: LogEvents.CampaignUpdate.name,
      channel: LogEvents.CampaignUpdate.channel,
    },
  })
  .action(async ({ parsedInput, ctx: { user, supabase } }) => {
    const { id, ...updateData } = parsedInput;
    const { campaign_actions, campaign_rewards, ...campaignData } = updateData;

    await updateCampaignMutation(supabase, id, {
      ...campaignData,
      actions: (updateData.campaign_actions || []).map((action, index) => ({
        action_type: action.action_type ?? "",
        action_details: action.action_details,
        required_count: action.required_count ?? 1,
        order_index: action.order_index ?? index,
        is_mandatory: action.is_mandatory ?? true,
        social_link: action.social_link,
        platform: action.platform,
        icon_url: action.icon_url ?? null,
        redirection_button_text: action.redirection_button_text ?? null,
        redirection_button_link: action.redirection_button_link ?? null,
      })),
      reward: updateData.campaign_rewards && {
        reward_type: updateData.campaign_rewards.reward_type,
        reward_value: updateData.campaign_rewards.reward_value,
        reward_unit: updateData.campaign_rewards.reward_unit,
        coupon_code: null,
        uses_per_customer: updateData.campaign_rewards.uses_per_customer,
        minimum_purchase_amount:
          updateData.campaign_rewards.minimum_purchase_amount ?? 0,
        expires_after: updateData.campaign_rewards.expires_after ?? null,
      },
    });

    revalidateTag(`campaigns_${user.business_id}`);
    revalidateTag(`campaign_${id}`);
    revalidatePath(`/campaigns/edit/${id}`);
  });

export const deleteCampaignAction = authActionClient
  .schema(z.object({ id: z.string().uuid() }))
  .metadata({
    name: "delete-campaign",
    track: {
      event: LogEvents.CampaignDelete.name,
      channel: LogEvents.CampaignDelete.channel,
    },
  })
  .action(async ({ parsedInput: { id }, ctx: { supabase } }) => {
    const { success } = await deleteCampaignMutation(supabase, id);
    return { success, id };
  });

export const createCampaignTrigger = authActionClient
  .schema(createCampaignActionSchema)
  .metadata({
    name: "create-campaign-action",
    track: {
      event: LogEvents.CampaignActionCreate.name,
      channel: LogEvents.CampaignActionCreate.channel,
    },
  })
  .action(async ({ parsedInput, ctx: { user, supabase } }) => {
    await createCampaignTriggerAction(supabase, parsedInput);
    revalidateTag(`campaigns_${user.business_id}`);
    revalidateTag(`campaign_${parsedInput.campaign_id}`);
    revalidatePath(`/campaigns/create/workflow/${parsedInput.campaign_id}`);
  });

export const createCampaignReward = authActionClient
  .schema(createCampaignRewardSchema)
  .metadata({
    name: "create-campaign-reward",
    track: {
      event: LogEvents.CampaignRewardCreate.name,
      channel: LogEvents.CampaignRewardCreate.channel,
    },
  })
  .action(async ({ parsedInput, ctx: { user, supabase } }) => {
    await createCampaignTriggerReward(supabase, parsedInput);
    revalidateTag(`campaigns_${user.business_id}`);
    revalidateTag(`campaign_${parsedInput.campaign_id}`);
    revalidatePath(`/campaigns/create/workflow/${parsedInput.campaign_id}`);
  });
