"use server";

import { getBusinessBySlug } from "@loopearn/supabase/cached-queries";
import { MARKETPLACE_ONBOARDING_STEPS } from "@loopearn/supabase/types";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authActionClient } from "./safe-action";

// Generate a new client secret for an integration
export const setMarketplaceOnboardingProgress = authActionClient
  .schema(
    z.object({
      onboardingStep: z.enum(MARKETPLACE_ONBOARDING_STEPS),
      slug: z.string().nullable(),
    }),
  )
  .metadata({
    name: "set-marketplace-onboarding-progress",
  })
  .action(async ({ ctx, parsedInput }) => {
    const { onboardingStep, slug } = parsedInput;

    try {
      if (!slug) {
        return { success: true };
      }

      const business = await getBusinessBySlug(slug);
      if (!business) {
        throw new Error("Business not found");
      }

      const { data, error } = await ctx.supabase
        .from("business")
        .update({
          marketplace_onboarding_step: onboardingStep,
          business_id: business.id,
        })
        .eq("slug", slug);

      if (error) {
        throw new Error("Failed to update onboarding step");
      }

      // supabase update property database
    } catch (e) {
      console.error("Failed to update onboarding step", e);
      throw new Error("Failed to update onboarding step");
    }

    return { success: true };
  });

export const setMarketplaceOnboardingGoBack = authActionClient
  .schema(
    z.object({
      slug: z.string().nullable(),
      step: z.enum(MARKETPLACE_ONBOARDING_STEPS),
    }),
  )
  .metadata({
    name: "set-marketplace-onboarding-go-back",
  })
  .action(async ({ parsedInput }) => {
    const { step, slug } = parsedInput;
    redirect(`/marketplace/create/${step}?slug=${slug}`);
  });
