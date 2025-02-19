"use server";

import { LogEvents } from "@loopearn/events/events";
import {
  type CreateCampaignParams,
  createCampaign as createCampaignMutation,
  deleteCampaign as deleteCampaignMutation,
  updateCampaign as updateCampaignMutation,
} from "@loopearn/supabase/mutations";
import { revalidatePath } from "next/cache";
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
    try {
      const params: CreateCampaignParams = {
        ...parsedInput,
        business_id: user.business_id,
        start_date: parsedInput.start_date || new Date().toISOString(),
        end_date: parsedInput.end_date || null,
        name: parsedInput.name,
        type: parsedInput.type,
        visibility: parsedInput.visibility,
        reward: {
          ...parsedInput.reward,
          reward_type: parsedInput.reward.reward_type,
          action_type: parsedInput.trigger.action_type,
          action_details: parsedInput.trigger.social_link,
          uses_per_customer: parsedInput.reward.uses_per_customer,
        },
        min_tier: parsedInput.min_tier,
      };
      if (!isValidUUID(params.business_id)) {
        throw new Error("Invalid business_id format");
      }
      await createCampaignMutation(supabase, params);
      redirect("/campaigns");
    } catch (error) {
      console.error("Failed to create campaign", error);
      throw new Error("Failed to create campaign");
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
        action_type: updateData.trigger?.action_type,
        action_details: updateData.trigger?.social_link,
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

function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
