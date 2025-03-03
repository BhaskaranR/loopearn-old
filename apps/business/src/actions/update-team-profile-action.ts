"use server";

import { getStripe } from "@/stripe/client";
import { createConnectedAccount } from "@/stripe/create-connected-account";
import { updateBusiness } from "@loopearn/supabase/mutations";
import {
  revalidatePath as revalidatePathFunc,
  revalidateTag,
} from "next/cache";
import { redirect } from "next/navigation";
import { authActionClient } from "./safe-action";
import { updateCompanyProfileSchema } from "./schema";

export const updateTeamProfileAction = authActionClient
  .schema(updateCompanyProfileSchema)
  .metadata({
    name: "update-team-profile",
  })
  .action(
    async ({
      parsedInput: { revalidatePath, redirectTo, id, ...data },
      ctx: { user, supabase },
    }) => {
      const { data: team, error } = await updateBusiness(supabase, data);

      // check if the team has a stripe connect account
      if (team.tags.length > 0 && !team.stripe_connect_id) {
        // create stripe connect account
        console.log("team", team.country);
        const connectedAccount = await createConnectedAccount({
          id: team.id,
          name: team.business_name,
          email: team.business_email,
          country: team.country,
          description: team.business_description,
        });
        const { error } = await updateBusiness(supabase, {
          stripe_connect_id: connectedAccount.id,
        });
      }
      if (error) {
        throw error;
      }

      if (revalidatePath) {
        revalidatePathFunc(revalidatePath);
      }

      revalidateTag(`user_${user.id}`);
      revalidateTag(`team_${id}`);
      revalidateTag(`business_by_slug_${team.slug}`);

      if (redirectTo) {
        redirect(redirectTo);
      }

      return team;
    },
  );
