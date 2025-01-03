"use server";

import { LogEvents } from "@loopearn/events/events";
import { deleteTeamMember } from "@loopearn/supabase/mutations";
import { revalidatePath as revalidatePathFunc } from "next/cache";
import { authActionClient } from "./safe-action";
import { deleteTeamMemberSchema } from "./schema";

export const deleteTeamMemberAction = authActionClient
  .schema(deleteTeamMemberSchema)
  .metadata({
    name: "delete-team-member",
    track: {
      event: LogEvents.DeleteTeamMember.name,
      channel: LogEvents.DeleteTeamMember.channel,
    },
  })
  .action(
    async ({
      parsedInput: { revalidatePath, businessId, userId },
      ctx: { supabase },
    }) => {
      const { data } = await deleteTeamMember(supabase, { businessId, userId });

      if (revalidatePath) {
        revalidatePathFunc(revalidatePath);
      }

      return data;
    },
  );
