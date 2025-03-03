"use client";

import type { ClientMessage } from "@/actions/ai/types";
import { createCampaignAction } from "@/actions/campaign-actions";
import { processCampaignMessage } from "@/utils/campaign-processor";
import { nanoid } from "nanoid";
import {
  CampaignErrorMessage,
  CampaignSuccessMessage,
} from "./campaign-messages";

const CAMPAIGN_TRIGGER_PHRASES = [
  "create campaign",
  "make campaign",
  "setup campaign",
  "new campaign",
  "start campaign",
];

export function isCampaignRequest(message: string): boolean {
  return CAMPAIGN_TRIGGER_PHRASES.some((phrase) =>
    message.toLowerCase().includes(phrase),
  );
}

export async function handleCampaignCreation(
  message: string,
): Promise<ClientMessage> {
  try {
    // Process the message to create campaign configuration
    const campaignConfig = await processCampaignMessage(message);

    // Create the campaign
    const result = await createCampaignAction(campaignConfig);

    // Check for validation errors or server errors
    if (result.validationErrors || result.serverError) {
      throw new Error(
        result.serverError ||
          result.validationErrors?.formErrors?.[0] ||
          "Failed to create campaign",
      );
    }

    // Return success message
    return {
      id: nanoid(),
      role: "assistant",
      display: (
        <CampaignSuccessMessage
          name={campaignConfig.name}
          type={campaignConfig.type}
          action_type={campaignConfig.campaign_actions[0].action_type}
          reward_value={campaignConfig.campaign_rewards.reward_value}
          reward_unit={campaignConfig.campaign_rewards.reward_unit}
          reward_type={campaignConfig.campaign_rewards.reward_type}
          start_date={campaignConfig.start_date}
          end_date={campaignConfig.end_date}
        />
      ),
    };
  } catch (error) {
    // Return error message
    return {
      id: nanoid(),
      role: "assistant",
      display: (
        <CampaignErrorMessage
          error={
            error instanceof Error
              ? error.message
              : "I couldn't create the campaign"
          }
        />
      ),
    };
  }
}
