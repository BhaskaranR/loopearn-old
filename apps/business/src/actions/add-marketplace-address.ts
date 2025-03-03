"use server";
import { LogEvents } from "@loopearn/events/events";
import {
  createBusinessAddress,
  updateBusiness,
} from "@loopearn/supabase/mutations";
import {
  revalidatePath as revalidatePathFunc,
  revalidateTag,
} from "next/cache";
import { redirect } from "next/navigation";
import { authActionClient } from "./safe-action";
import { addMarketplaceAddressSchema } from "./schema";

export const addMarketplaceAddressAction = authActionClient
  .schema(addMarketplaceAddressSchema)
  .metadata({
    name: "add-marketplace-address",
    track: {
      event: LogEvents.AddMarketplaceAddress.name,
      channel: LogEvents.AddMarketplaceAddress.channel,
    },
  })
  .action(
    async ({
      parsedInput: {
        revalidatePath,
        redirectTo,
        marketplace_onboarding_step,
        ...data
      },
      ctx: { user, supabase },
    }) => {
      const { data: team, error } = await createBusinessAddress(supabase, data);

      // update business_marketplace table with the latest step
      const { data: updateBusinessMarketplace } = await updateBusiness(
        supabase,
        {
          business_id: data.business_id,
          marketplace_onboarding_step: marketplace_onboarding_step,
        },
      );

      if (revalidatePath) {
        revalidatePathFunc(revalidatePath);
      }

      revalidateTag(`user_${user.id}`);
      revalidateTag(`teams_${data.business_id}`);
      revalidateTag(`business_by_slug_${updateBusinessMarketplace.slug}`);

      if (redirectTo) {
        redirect(redirectTo);
      }

      return team;
    },
  );
