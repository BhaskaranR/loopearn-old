"use server";

import { LogEvents } from "@loopearn/events/events";
import { updateUserTeamRole } from "@loopearn/supabase/mutations";
import { revalidatePath as revalidatePathFunc } from "next/cache";
import { authActionClient } from "./safe-action";
import { changeUserRoleSchema } from "./schema";

export const changeUserRoleAction = authActionClient
  .schema(changeUserRoleSchema)
  .metadata({
    name: "change-user-role",
    track: {
      event: LogEvents.UserRoleChange.name,
      channel: LogEvents.UserRoleChange.channel,
    },
  })
  .action(
    async ({
      parsedInput: { userId, businessId, role, revalidatePath },
      ctx: { supabase },
    }) => {
      const { data } = await updateUserTeamRole(supabase, {
        userId,
        businessId,
        role,
      });

      if (revalidatePath) {
        revalidatePathFunc(revalidatePath);
      }

      return data;
    },
  );
