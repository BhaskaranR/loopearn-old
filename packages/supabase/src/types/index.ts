import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./db";
export type Client = SupabaseClient<Database>;

export * from "./db";
export * from "./jwtPayload";

export const ONBOARDING_STEPS = [
  "workspace",
  "category",
  "subcategory",
  "profile",
  "plan",
  "verify",
  "completed",
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];
