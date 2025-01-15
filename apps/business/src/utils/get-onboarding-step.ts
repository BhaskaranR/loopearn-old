import { client as RedisClient } from "@loopearn/kv/client";

export async function getOnboardingStep(id: string) {
  return await RedisClient.get(`onboarding-step:${id}`);
}
