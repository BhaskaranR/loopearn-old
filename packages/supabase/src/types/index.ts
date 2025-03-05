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

export type Campaign = Database["public"]["Tables"]["campaigns"]["Row"];

export type CampaignAction =
  Database["public"]["Tables"]["campaign_actions"]["Row"];

export type CampaignReward =
  Database["public"]["Tables"]["campaign_rewards"]["Row"];

export type CampaignWithActionsRewards = Campaign & {
  campaign_actions: CampaignAction[];
  campaign_rewards: CampaignReward[];
};
