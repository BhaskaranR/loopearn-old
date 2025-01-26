"use server";

import { LogEvents } from "@loopearn/events/events";
import { getBusinessMembers } from "@loopearn/supabase/cached-queries";
import { leaveBusiness } from "@loopearn/supabase/mutations";
import {
  revalidatePath as revalidatePathFunc,
  revalidateTag,
} from "next/cache";
import { redirect } from "next/navigation";
import { authActionClient } from "./safe-action";
import { leaveTeamSchema } from "./schema";

export const leaveTeamAction = authActionClient
  .schema(leaveTeamSchema)
  .metadata({
    name: "leave-team",
    track: {
      event: LogEvents.LeaveTeam.name,
      channel: LogEvents.LeaveTeam.channel,
    },
  })
  .action(
    async ({
      parsedInput: { businessId, role, redirectTo, revalidatePath },
      ctx: { user, supabase },
    }) => {
      const businessMembersData = await getBusinessMembers();

      const totalOwners = businessMembersData?.data?.filter(
        (member) => member.role === "owner",
      ).length;

      if (role === "owner" && totalOwners === 1) {
        throw Error("Action not allowed");
      }

      const { data, error } = await leaveBusiness(supabase, {
        businessId,
        userId: user.id,
      });

      revalidateTag(`user_${user.id}`);
      revalidateTag(`teams_${user.id}`);

      if (revalidatePath) {
        revalidatePathFunc(revalidatePath);
      }

      if (redirectTo) {
        redirect(redirectTo);
      }

      return data;
    },
  );
