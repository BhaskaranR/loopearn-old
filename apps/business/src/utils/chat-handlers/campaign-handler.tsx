import type { ClientMessage } from "@/actions/ai/types";
import { createCampaignAction } from "@/actions/campaign-actions";
import { processCampaignMessage } from "@/utils/campaign-processor";
import { nanoid } from "nanoid";
import React from "react";

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

function CampaignSuccessMessage({
  name,
  type,
  action_type,
  reward_value,
  reward_unit,
  reward_type,
  start_date,
  end_date,
}: {
  name: string;
  type: string;
  action_type: string;
  reward_value: number;
  reward_unit: string;
  reward_type: string;
  start_date?: string;
  end_date?: string;
}) {
  return (
    <div className="space-y-2">
      <p>✅ I've created a campaign with the following details:</p>
      <ul className="list-none space-y-1">
        <li>• Name: {name}</li>
        <li>• Type: {type}</li>
        <li>• Action: {action_type}</li>
        <li>
          • Reward: {reward_value} {reward_unit} {reward_type}
        </li>
        {start_date && (
          <li>
            • Duration: {new Date(start_date).toLocaleDateString()} to{" "}
            {new Date(end_date || "").toLocaleDateString()}
          </li>
        )}
      </ul>
      <p className="mt-4">
        Is there anything else you'd like me to help you with?
      </p>
    </div>
  );
}

function CampaignErrorMessage({ error }: { error: string }) {
  return (
    <div className="text-red-600">
      <p>❌ {error}</p>
      <p>
        Please try again with more specific details about the campaign you want
        to create.
      </p>
    </div>
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

    if (!result.success) {
      throw new Error(result.error || "Failed to create campaign");
    }

    // Return success message
    return {
      id: nanoid(),
      role: "assistant",
      display: (
        <CampaignSuccessMessage
          name={campaignConfig.name}
          type={campaignConfig.type}
          action_type={campaignConfig.trigger.action_type}
          reward_value={campaignConfig.reward.reward_value}
          reward_unit={campaignConfig.reward.reward_unit}
          reward_type={campaignConfig.reward.reward_type}
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
