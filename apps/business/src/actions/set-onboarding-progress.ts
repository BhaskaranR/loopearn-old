"use server";

import { client as RedisClient } from "@loopearn/kv/client";
import { ONBOARDING_STEPS } from "@loopearn/supabase/types";
import { z } from "zod";
import { authActionClient } from "./safe-action";

// Generate a new client secret for an integration
export const setOnboardingProgress = authActionClient
  .schema(
    z.object({
      onboardingStep: z.enum(ONBOARDING_STEPS).nullable(),
    }),
  )
  .action(async ({ ctx, parsedInput }) => {
    const { onboardingStep } = parsedInput;

    try {
      await RedisClient.set(
        `onboarding-step:${ctx.user.id}_${ctx.user.business_id}`,
        onboardingStep,
      );
    } catch (e) {
      console.error("Failed to update onboarding step", e);
      throw new Error("Failed to update onboarding step");
    }

    return { success: true };
  });
