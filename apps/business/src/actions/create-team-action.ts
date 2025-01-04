"use server";

import { LogEvents } from "@loopearn/events/events";
import { createBusiness, updateUser } from "@loopearn/supabase/mutations";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { authActionClient } from "./safe-action";
import { createBusinessSchema } from "./schema";

export const createBusinessAction = authActionClient
  .schema(createBusinessSchema)
  .metadata({
    name: "create-team",
    track: {
      event: LogEvents.CreateTeam.name,
      channel: LogEvents.CreateTeam.channel,
    },
  })
  .action(async ({ parsedInput: { name, redirectTo }, ctx: { supabase } }) => {
    const team_id = await createBusiness(supabase, { name });
    const user = await updateUser(supabase, { team_id });

    if (!user?.data) {
      return;
    }

    revalidateTag(`user_${user.data.id}`);
    revalidateTag(`teams_${team_id}`);

    if (redirectTo) {
      redirect(redirectTo);
    }

    return team_id;
  });
