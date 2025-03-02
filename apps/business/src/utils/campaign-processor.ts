import type { CreateCampaignFormValues } from "@/actions/schema";
import { type CampaignTemplate, campaignTemplates } from "./campaigns";

type RewardType =
  | "rank_points"
  | "wallet_points"
  | "wallet_multiplier"
  | "coupon"
  | "percentage_discount"
  | "fixed_amount_discount"
  | "free_product"
  | "free_shipping";

type ActionType =
  | "subscribe"
  | "write_review"
  | "follow_instagram"
  | "share"
  | "like"
  | "comment"
  | "other";

interface ProcessedIntent {
  platform?: string;
  action?: ActionType;
  rewardType?: RewardType;
  rewardValue?: number;
  customName?: string;
  customDescription?: string;
  duration?: {
    start?: Date;
    end?: Date;
  };
}

export async function processCampaignMessage(
  message: string,
): Promise<CreateCampaignFormValues> {
  const intent = extractIntent(message);
  const template = findBestTemplate(intent);

  if (!template) {
    throw new Error(
      "Could not determine campaign type. Please specify a platform (e.g., Facebook, Instagram, etc.)",
    );
  }

  // Start with template defaults
  const config: CreateCampaignFormValues = {
    name: intent.customName || template.defaultName,
    description: intent.customDescription || template.defaultDescription,
    type: template.type,
    is_repeatable: template.is_repeatable,
    max_achievement: template.max_achievement,
    min_tier: template.min_tier,
    visibility: template.visibility,
    status: "active",
    is_live_on_marketplace: template.is_live_on_marketplace,
    audience: template.audience,
    start_date: intent.duration?.start?.toISOString(),
    end_date: intent.duration?.end?.toISOString(),
    trigger: {
      action_type:
        findBestAction(template, intent.action) ||
        template.availableActions[0].action_type,
      social_link: "",
    },
    reward: {
      ...template.reward,
      ...(intent.rewardType && { reward_type: intent.rewardType }),
      ...(intent.rewardValue && { reward_value: intent.rewardValue }),
    },
  };

  return config;
}

function extractIntent(message: string): ProcessedIntent {
  const lowercaseMessage = message.toLowerCase();
  const intent: ProcessedIntent = {};

  // Extract platform
  const platforms = [
    "facebook",
    "instagram",
    "twitter",
    "youtube",
    "tiktok",
    "review",
  ];
  intent.platform = platforms.find((p) => lowercaseMessage.includes(p));

  // Extract action type
  const actionMap: Record<ActionType, string[]> = {
    share: ["share", "post", "repost"],
    like: ["like", "heart"],
    comment: ["comment", "reply"],
    subscribe: ["subscribe"],
    follow_instagram: ["follow instagram"],
    write_review: ["review", "rating"],
    other: ["other"],
  };

  for (const [action, keywords] of Object.entries(actionMap)) {
    if (keywords.some((k) => lowercaseMessage.includes(k))) {
      intent.action = action as ActionType;
      break;
    }
  }

  // Extract reward type and value
  const rewardPatterns: Array<{ type: RewardType; pattern: RegExp }> = [
    { type: "percentage_discount", pattern: /(\d+)%\s*(discount|off)/i },
    { type: "fixed_amount_discount", pattern: /\$(\d+)\s*(discount|off)/i },
    { type: "wallet_points", pattern: /(\d+)\s*(points)/i },
    { type: "rank_points", pattern: /(\d+)\s*(rank points)/i },
    { type: "wallet_multiplier", pattern: /(\d+)x\s*(multiplier)/i },
    { type: "coupon", pattern: /coupon/i },
    { type: "free_product", pattern: /free product/i },
    { type: "free_shipping", pattern: /free shipping/i },
  ];

  for (const { type, pattern } of rewardPatterns) {
    const match = message.match(pattern);
    if (match) {
      intent.rewardType = type;
      if (match[1]) {
        intent.rewardValue = Number.parseInt(match[1], 10);
      }
      break;
    }
  }

  // Extract duration
  const durationPatterns = [
    { pattern: /for (\d+) days/i, unit: "days" },
    { pattern: /until ([a-zA-Z]+ \d+)/i, unit: "date" },
    { pattern: /from ([a-zA-Z]+ \d+) to ([a-zA-Z]+ \d+)/i, unit: "range" },
  ];

  for (const { pattern, unit } of durationPatterns) {
    const match = message.match(pattern);
    if (match) {
      intent.duration = {};
      if (unit === "days") {
        intent.duration.start = new Date();
        intent.duration.end = new Date();
        intent.duration.end.setDate(
          intent.duration.end.getDate() + Number.parseInt(match[1], 10),
        );
      } else if (unit === "date") {
        intent.duration.end = new Date(match[1]);
      } else if (unit === "range") {
        intent.duration.start = new Date(match[1]);
        intent.duration.end = new Date(match[2]);
      }
      break;
    }
  }

  // Extract custom name and description
  const nameMatch = message.match(/called "([^"]+)"/i);
  if (nameMatch) {
    intent.customName = nameMatch[1];
  }

  const descMatch = message.match(/description "([^"]+)"/i);
  if (descMatch) {
    intent.customDescription = descMatch[1];
  }

  return intent;
}

function findBestTemplate(intent: ProcessedIntent): CampaignTemplate | null {
  if (!intent.platform) return null;

  return (
    campaignTemplates.find(
      (t) => t.platform.toLowerCase() === intent.platform,
    ) || null
  );
}

function findBestAction(
  template: CampaignTemplate,
  actionHint?: string,
): string | null {
  if (!actionHint) return null;

  const action = template.availableActions.find((a) =>
    a.action_type.includes(actionHint),
  );
  return action?.action_type || null;
}
