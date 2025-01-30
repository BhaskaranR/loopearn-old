"use server";

import { LogEvents } from "@loopearn/events/events";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { authActionClient } from "./safe-action";

export const disconnectAppAction = authActionClient
  .schema(
    z.object({
      appId: z.string(),
    }),
  )
  .metadata({
    name: "disconnect-app",
    track: {
      event: LogEvents.DisconnectApp.name,
      channel: LogEvents.DisconnectApp.channel,
    },
  })
  .action(async ({ parsedInput: { appId }, ctx: { supabase, user } }) => {
    const { data } = await supabase
      .from("apps")
      .delete()
      .eq("app_id", appId)
      .eq("business_id", user.business_id)
      .select();

    revalidatePath("/apps");

    return data;
  });
