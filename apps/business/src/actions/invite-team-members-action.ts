"use server";

import { env } from "@/env.mjs";
import { resend } from "@/utils/resend";
import InviteEmail from "@loopearn/email/emails/invite";
import { getI18n } from "@loopearn/email/locales";
import { LogEvents } from "@loopearn/events/events";
import { client as RedisClient } from "@loopearn/kv/client";
import type { Database } from "@loopearn/supabase/db";
import { render } from "@react-email/render";
import { revalidatePath as revalidatePathFunc } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { nanoid } from "nanoid";
import { authActionClient } from "./safe-action";
import { inviteTeamMembersSchema } from "./schema";

export const inviteTeamMembersAction = authActionClient
  .schema(inviteTeamMembersSchema)
  .metadata({
    name: "invite-team-members",
    track: {
      event: LogEvents.InviteTeamMembers.name,
      channel: LogEvents.InviteTeamMembers.channel,
    },
  })
  .action(
    async ({
      parsedInput: { saveOnly, invites, redirectTo, revalidatePath },
      ctx: { user, supabase },
    }) => {
      const { t } = getI18n({ locale: user.locale || "en" });

      const location = headers().get("x-vercel-ip-city") ?? "Unknown";
      const ip = headers().get("x-forwarded-for") ?? "127.0.0.1";

      const data = invites?.map((invite) => ({
        ...invite,
        business_id: user?.business_users[0]?.business_id,
        invited_by: user.id,
      }));

      if (saveOnly) {
        await RedisClient.set(
          `invites:${user?.business_users[0]?.business_id}`,
          data,
          {
            ex: 60 * 60 * 24 * 15, // 15 days
          },
        );
      }

      const { data: invtesData, error } = await supabase
        .from("user_invites")
        .upsert(data, {
          onConflict: "email, business_id",
          ignoreDuplicates: false,
        })
        .select("email, code, user:invited_by(*), business:business_id(*)");

      console.log(error);

      const emails = invtesData?.map(async (invites) => {
        const user =
          invites.user as Database["public"]["Tables"]["users"]["Row"];
        const business =
          invites.business as Database["public"]["Tables"]["business"]["Row"];
        return {
          from: "LoopEarn <support@loopearn.com>",
          to: [invites.email],
          subject: t("invite.subject", {
            invitedByName: user.full_name,
            teamName: business.business_name,
          }),
          headers: {
            "X-Entity-Ref-ID": nanoid(),
          },
          html: await render(
            InviteEmail({
              invitedByEmail: user.username,
              invitedByName: user.full_name,
              email: invites.email,
              teamName: business.business_name,
              inviteCode: invites.code,
              ip,
              location,
              locale: user.locale,
            }),
          ),
        };
      });

      const htmlEmails = await Promise.all(emails);

      await resend.batch.send(htmlEmails);

      if (revalidatePath) {
        revalidatePathFunc(revalidatePath);
      }

      if (redirectTo) {
        redirect(redirectTo);
      }
    },
  );
