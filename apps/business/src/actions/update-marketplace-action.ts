"use server";

import { LogEvents } from "@loopearn/events/events";
import { getBusinessBySlug } from "@loopearn/supabase/cached-queries";
import { updateBusiness } from "@loopearn/supabase/mutations";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { authActionClient } from "./safe-action";
import { marketplaceProfileSchema } from "./schema";

// Helper function to generate numeric ID
function generateNumericId(): number {
  // Generates a 12-digit number
  return Math.floor(Date.now() + Math.random() * 1000000);
}

export const updateMarketplaceAction = authActionClient
  .schema(marketplaceProfileSchema)
  .metadata({
    name: "update-marketplace",
    track: {
      event: LogEvents.UpdateMarketplace.name,
      channel: LogEvents.UpdateMarketplace.channel,
    },
  })
  .action(
    async ({
      parsedInput: { redirectTo, slug, ...marketplace },
      ctx: {
        supabase,
        user: { business_id, id },
      },
    }) => {
      let newMarketplace = null;
      if (slug) {
        const existing = await getBusinessBySlug(slug);
        if (existing) {
          const updatedMarketplace = await updateBusiness(supabase, {
            ...marketplace,
          });
          newMarketplace = updatedMarketplace;
        }
      }
      revalidateTag(`teams_${business_id}`);
      revalidateTag(`business_by_slug_${slug}`);
      const queryParams = `?slug=${slug}`;

      if (redirectTo) {
        redirect(`${redirectTo}${queryParams}`);
      }
    },
  );
