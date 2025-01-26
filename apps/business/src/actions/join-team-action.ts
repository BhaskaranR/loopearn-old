"use server";

import { LogEvents } from "@loopearn/events/events";
import { joinTeamByInviteCode } from "@loopearn/supabase/mutations";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { authActionClient } from "./safe-action";
import { joinTeamSchema } from "./schema";

export const joinTeamAction = authActionClient
  .schema(joinTeamSchema)
  .metadata({
    name: "join-team",
    track: {
      event: LogEvents.ChangeTeam.name,
      channel: LogEvents.ChangeTeam.channel,
    },
  })
  .action(async ({ parsedInput: { code }, ctx: { supabase, user } }) => {
    await joinTeamByInviteCode(supabase, code);

    revalidateTag(`pending_business_invites_${user.id}`);
    revalidateTag(`teams_${user.id}`);
    revalidateTag(`user_${user.id}`);

    redirect("/");
  });
