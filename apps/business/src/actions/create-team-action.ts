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
  .action(
    async ({
      parsedInput: { name, slug, redirectTo },
      ctx: {
        supabase,
        user: { username },
      },
    }) => {
      const business_id = await createBusiness(supabase, {
        name,
        slug,
        email: username,
      });
      const user = await updateUser(supabase, { business_id });

      if (!user?.data) {
        return;
      }

      revalidateTag(`user_${user.data.id}`);
      revalidateTag(`teams_${user.data.id}`);
      revalidateTag(`business_by_slug_${slug}`);

      if (redirectTo) {
        redirect(redirectTo);
      }
      return business_id;
    },
  );
