"use server";

import { updateBusiness } from "@loopearn/supabase/mutations";
import {
  revalidatePath as revalidatePathFunc,
  revalidateTag,
} from "next/cache";
import { authActionClient } from "./safe-action";
import { updateCompanySchema } from "./schema";

export const updateTeamAction = authActionClient
  .schema(updateCompanySchema)
  .metadata({
    name: "update-team",
  })
  .action(
    async ({
      parsedInput: { revalidatePath, ...data },
      ctx: { user, supabase },
    }) => {
      const team = await updateBusiness(supabase, data);

      if (revalidatePath) {
        revalidatePathFunc(revalidatePath);
      }

      revalidateTag(`user_${user.id}`);

      return team;
    },
  );
