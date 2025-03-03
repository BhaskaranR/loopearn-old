import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./db";
export type Client = SupabaseClient<Database>;

export * from "./db";

export const ONBOARDING_STEPS = [
  "teams",
  "workspace",
  "plan",
  "completed",
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export const MARKETPLACE_ONBOARDING_STEPS = [
  "welcome",
  "info",
  "description",
  "category",
  "subcategory",
  "verify",
  "stripe-pending",
  "amenities",
  "campaigns",
  "photos",
  "preview",
  "completed",
] as const;

export type MarketplaceOnboardingStep =
  (typeof MARKETPLACE_ONBOARDING_STEPS)[number];

export type Business = Database["public"]["Tables"]["business"]["Row"];

export type BusinessAddress =
  Database["public"]["Tables"]["business_address"]["Row"];

export type BusinessWithAddress = Business & BusinessAddress;
