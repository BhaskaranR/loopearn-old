import type { ClientMessage } from "@/actions/ai/types";
import { createCampaignAction } from "@/actions/campaign-actions";
import { processCampaignMessage } from "@/utils/campaign-processor";
import { nanoid } from "nanoid";

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
    const result = await createCampaignAction.execute(campaignConfig);

    if (!result.success) {
      throw new Error(result.error || "Failed to create campaign");
    }

    // Return success message
    return {
      id: nanoid(),
      role: "assistant",
      content: `✅ I've created a campaign with the following details:
• Name: ${campaignConfig.name}
• Type: ${campaignConfig.type}
• Action: ${campaignConfig.trigger.action_type}
• Reward: ${campaignConfig.reward.reward_value} ${campaignConfig.reward.reward_unit} ${campaignConfig.reward.reward_type}
${campaignConfig.start_date ? `• Duration: ${new Date(campaignConfig.start_date).toLocaleDateString()} to ${new Date(campaignConfig.end_date || "").toLocaleDateString()}` : "• Always active"}

Is there anything else you'd like me to help you with?`,
    };
  } catch (error) {
    // Return error message
    return {
      id: nanoid(),
      role: "assistant",
      content:
        error instanceof Error
          ? `❌ ${error.message}. Please try again with more specific details about the campaign you want to create.`
          : "❌ I couldn't create the campaign. Please try again with more specific details.",
    };
  }
}
