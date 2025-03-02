"use server";

import { LogEvents } from "@loopearn/events/events";
import {
  type CreateCampaignParams,
  createCampaign as createCampaignMutation,
  deleteCampaign as deleteCampaignMutation,
  updateCampaign as updateCampaignMutation,
} from "@loopearn/supabase/mutations";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authActionClient } from "./safe-action";
import { createCampaignSchema, updateCampaignSchema } from "./schema";

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
      actions: [
        {
          action_type: parsedInput.trigger.action_type,
          action_details: parsedInput.trigger.social_link,
          required_count: 1,
          order_index: 0,
          is_mandatory: true,
          social_link: parsedInput.trigger.social_link,
          icon_url: null,
          redirection_button_text: null,
          redirection_button_link: null,
        },
      ],
      reward: {
        reward_type: parsedInput.reward.reward_type,
        reward_value: parsedInput.reward.reward_value,
        reward_unit: parsedInput.reward.reward_unit,
        coupon_code: null,
        uses_per_customer: parsedInput.reward.uses_per_customer,
        minimum_purchase_amount:
          parsedInput.reward.minimum_purchase_amount || 0,
      },
    };

    await createCampaignMutation(supabase, params);
    revalidateTag(`campaigns_${user.business_id}`);
    redirect("/campaigns");
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
  .action(async ({ parsedInput, ctx: { supabase } }) => {
    const {
      id,
      revalidatePath: revalidatePathInput,
      ...updateData
    } = parsedInput;

    const campaign = await updateCampaignMutation(supabase, id, {
      ...updateData,
      reward: updateData.reward && {
        ...updateData.reward,
      },
    });

    if (revalidatePathInput) {
      revalidatePath(revalidatePathInput);
    }

    return campaign;
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
