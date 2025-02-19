"use server";

import { LogEvents } from "@loopearn/events/events";
import {
  createCampaign as createCampaignMutation,
  deleteCampaign as deleteCampaignMutation,
  updateCampaign as updateCampaignMutation,
} from "@loopearn/supabase/mutations";
import { revalidatePath } from "next/cache";
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
  .action(async ({ parsedInput, ctx: { supabase } }) => {
    const campaign = await createCampaignMutation(supabase, {
      ...parsedInput,
      reward: {
        ...parsedInput.reward,
        action_type: parsedInput.trigger.action_type,
        action_details: parsedInput.trigger.social_link,
      },
    });

    return campaign;
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
