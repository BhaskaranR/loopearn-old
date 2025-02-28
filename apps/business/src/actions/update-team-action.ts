"use server";
import { updateBusiness } from "@loopearn/supabase/mutations";
import {
  revalidatePath as revalidatePathFunc,
  revalidateTag,
} from "next/cache";
import { redirect } from "next/navigation";
import { authActionClient } from "./safe-action";
import { updateCompanySchema } from "./schema";

export const updateTeamAction = authActionClient
  .schema(updateCompanySchema)
  .metadata({
    name: "update-team",
  })
  .action(
    async ({
      parsedInput: { revalidatePath, redirectTo, id, ...data },
      ctx: { user, supabase },
    }) => {
      const { data: team, error } = await updateBusiness(supabase, data);

      if (error) {
        throw error;
      }

      if (revalidatePath) {
        revalidatePathFunc(revalidatePath);
      }

      revalidateTag(`user_${user.id}`);
      revalidateTag(`teams_${id}`);
      revalidateTag(`business_by_slug_${team.slug}`);

      if (redirectTo) {
        redirect(redirectTo);
      }

      return team;
    },
  );
