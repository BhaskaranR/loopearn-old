import { client as RedisClient } from "@loopearn/kv/client";
import type { OnboardingStep } from "@loopearn/supabase/types";

export async function getOnboardingStep(
  id: string,
): Promise<OnboardingStep | undefined> {
  try {
    const step = await RedisClient.get(`onboarding-step:${id}`);
    return step ?? undefined;
  } catch (e) {
    console.error("Failed to get onboarding step", e);
    return undefined;
  }
}
