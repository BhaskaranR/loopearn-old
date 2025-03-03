import type { CreateCampaignFormValues } from "@/actions/schema";

export interface CampaignTemplate
  extends Omit<CreateCampaignFormValues, "name" | "description" | "trigger"> {
  id: string;
  platform:
    | "facebook"
    | "twitter"
    | "youtube"
    | "instagram"
    | "tiktok"
    | "instagram_business"
    | "review"
    | "gamification";
  icon: string;
  defaultName: string;
  defaultDescription: string;
  selectedAction: string;
  availableActions: {
    action_type: string;
    name: string;
    description: string;
    defaultReward?: Partial<CreateCampaignFormValues["reward"]>;
  }[];
}

export const campaignTemplates: CampaignTemplate[] = [
  {
    id: "facebook",
    platform: "facebook",
    icon: "facebook",
    defaultName: "Facebook Campaign",
    defaultDescription: "Engage with us on Facebook to earn rewards!",
    type: "Reward Campaign",
    is_repeatable: true,
    max_achievement: 1,
    min_tier: 1,
    visibility: "AlwaysVisible",
    status: "active",
    is_live_on_marketplace: false,
    audience: "all",
    reward: {
      reward_type: "percentage_discount",
      reward_value: 10,
      reward_unit: "%",
      applies_to: "entire",
      uses_per_customer: 1,
    },
    selectedAction: "share",
    availableActions: [
      {
        action_type: "share",
        name: "Share Post",
        description: "Share our content on Facebook",
        defaultReward: {
          reward_type: "percentage_discount",
          reward_value: 10,
          reward_unit: "%",
        },
      },
      {
        action_type: "like",
        name: "Like Page",
        description: "Like our Facebook page",
        defaultReward: {
          reward_type: "percentage_discount",
          reward_value: 10,
          reward_unit: "%",
        },
      },
      {
        action_type: "comment",
        name: "Comment",
        description: "Comment on our post",
        defaultReward: {
          reward_type: "percentage_discount",
          reward_value: 5,
          reward_unit: "%",
        },
      },
    ],
  },
  {
    id: "instagram",
    platform: "instagram",
    icon: "instagram",
    defaultName: "Instagram Campaign",
    defaultDescription: "Connect with us on Instagram for exclusive rewards!",
    type: "Reward Campaign",
    is_repeatable: true,
    max_achievement: 3,
    min_tier: 1,
    visibility: "AlwaysVisible",
    status: "active",
    is_live_on_marketplace: false,
    audience: "all",
    reward: {
      reward_type: "percentage_discount",
      reward_value: 15,
      reward_unit: "%",
      applies_to: "entire",
      uses_per_customer: 1,
    },
    selectedAction: "follow_instagram",
    availableActions: [
      {
        action_type: "follow_instagram",
        name: "Follow Profile",
        description: "Follow our Instagram profile",
        defaultReward: {
          reward_type: "percentage_discount",
          reward_value: 15,
          reward_unit: "%",
        },
      },
      {
        action_type: "share",
        name: "Share Story",
        description: "Share our content in your story",
        defaultReward: {
          reward_type: "fixed_amount_discount",
          reward_value: 5,
          reward_unit: "currency",
        },
      },
      {
        action_type: "comment",
        name: "Comment",
        description: "Comment on our post",
        defaultReward: {
          reward_type: "percentage_discount",
          reward_value: 5,
          reward_unit: "%",
        },
      },
    ],
  },
  {
    id: "twitter",
    platform: "twitter",
    icon: "twitter",
    defaultName: "Twitter Campaign",
    defaultDescription: "Engage with us on Twitter to earn rewards!",
    type: "Reward Campaign",
    is_repeatable: true,
    max_achievement: 3,
    min_tier: 1,
    visibility: "AlwaysVisible",
    status: "active",
    is_live_on_marketplace: true,
    audience: "all",
    reward: {
      reward_type: "percentage_discount",
      reward_value: 10,
      reward_unit: "%",
      applies_to: "entire",
      uses_per_customer: 1,
    },
    selectedAction: "share",
    availableActions: [
      {
        action_type: "share",
        name: "Share Post",
        description: "Share our content on Twitter",
      },
      {
        action_type: "like",
        name: "Like Post",
        description: "Like our post on Twitter",
      },
      {
        action_type: "comment",
        name: "Comment",
        description: "Comment on our post",
      },
    ],
  },
  {
    id: "youtube",
    platform: "youtube",
    icon: "youtube",
    defaultName: "YouTube Campaign",
    defaultDescription: "Engage with us on YouTube to earn rewards!",
    type: "Reward Campaign",
    is_repeatable: true,
    max_achievement: 3,
    min_tier: 1,
    visibility: "AlwaysVisible",
    status: "active",
    is_live_on_marketplace: true,
    audience: "all",
    reward: {
      reward_type: "percentage_discount",
      reward_value: 10,
      reward_unit: "%",
    },
    selectedAction: "share",
    availableActions: [
      {
        action_type: "subscribe",
        name: "Subscribe",
        description: "Subscribe to our YouTube channel",
      },
      {
        action_type: "share",
        name: "Share Video",
        description: "Share our video on YouTube",
      },
      {
        action_type: "like",
        name: "Like Video",
        description: "Like our video on YouTube",
      },
      {
        action_type: "comment",
        name: "Comment",
        description: "Comment on our video",
      },
    ],
  },
  {
    id: "review",
    platform: "review",
    icon: "star",
    defaultName: "Review Campaign",
    defaultDescription: "Share your experience and earn rewards!",
    type: "Reward Campaign",
    is_repeatable: true,
    max_achievement: 5,
    min_tier: 1,
    visibility: "AlwaysVisible",
    status: "active",
    is_live_on_marketplace: false,
    audience: "all",
    reward: {
      reward_type: "percentage_discount",
      reward_value: 5,
      reward_unit: "%",
      applies_to: "entire",
      uses_per_customer: 1,
    },
    selectedAction: "write_review",
    availableActions: [
      {
        action_type: "write_review",
        name: "Write Review",
        description: "Write a product review",
        defaultReward: {
          reward_type: "percentage_discount",
          reward_value: 5,
          reward_unit: "%",
        },
      },
    ],
  },
  {
    id: "gamification",
    platform: "gamification",
    icon: "wheel",
    defaultName: "Gamification Campaign",
    defaultDescription: "Play and win amazing rewards!",
    type: "Reward Campaign",
    is_repeatable: true,
    max_achievement: -1,
    min_tier: 1,
    visibility: "AlwaysVisible",
    status: "active",
    is_live_on_marketplace: true,
    audience: "all",
    reward: {
      reward_type: "percentage_discount",
      reward_value: 20,
      reward_unit: "%",
      applies_to: "entire",
      uses_per_customer: 1,
      expires_after: 86400,
    },
    selectedAction: "other",
    availableActions: [
      {
        action_type: "other",
        name: "Spin Wheel",
        description: "Spin the wheel for rewards",
        defaultReward: {
          reward_type: "percentage_discount",
          reward_value: 20,
          reward_unit: "%",
        },
      },
      {
        action_type: "other",
        name: "Daily Check-in",
        description: "Check in daily for rewards",
        defaultReward: {
          reward_type: "percentage_discount",
          reward_value: 5,
          reward_unit: "%",
        },
      },
    ],
  },
];

// Define a type for CampaignTypeGroup entries
interface CampaignTypeGroupEntry {
  id: string;
  selectedAction: string;
}

// Helper function to get templates by platform
export function getCampaignTemplatesByPlatform(
  platform: CampaignTemplate["platform"],
): CampaignTemplate[] {
  return campaignTemplates.filter((template) => template.platform === platform);
}

// Helper function to get available actions for a template
export function getTemplateActions(templateId: string) {
  const template = getCampaignTemplate(templateId);
  return template?.availableActions || [];
}

// Function to get a campaign template by ID
export function getCampaignTemplate(id: string) {
  try {
    const campaignTemplate = campaignTemplates.find(
      (template) => template.id === id,
    );
    if (!campaignTemplate) {
      throw new Error(`Campaign template not found for ID: ${id}`);
    }
    return campaignTemplate;
  } catch (error) {
    console.error("Error fetching campaign template:", error);
    return null;
  }
}
