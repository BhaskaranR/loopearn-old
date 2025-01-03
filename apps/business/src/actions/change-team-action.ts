"use server";

import { LogEvents } from "@loopearn/events/events";
import { updateUser } from "@loopearn/supabase/mutations";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { authActionClient } from "./safe-action";
import { changeBusinessSchema } from "./schema";

export const changeTeamAction = authActionClient
  .schema(changeBusinessSchema)
  .metadata({
    name: "change-team",
    track: {
      event: LogEvents.ChangeTeam.name,
      channel: LogEvents.ChangeTeam.channel,
    },
  })
  .action(
    async ({ parsedInput: { businessId, redirectTo }, ctx: { supabase } }) => {
      const user = await updateUser(supabase, { business_id: businessId });

      if (!user?.data) {
        return;
      }

      revalidateTag(`user_${user.data.id}`);

      redirect(redirectTo);
    },
  );
