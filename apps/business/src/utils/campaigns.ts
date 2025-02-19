import type { CreateCampaignFormValues } from "@/actions/schema";

export interface CampaignTemplate
  extends Omit<CreateCampaignFormValues, "name" | "description" | "trigger"> {
  id: string;
  platform:
    | "facebook"
    | "instagram"
    | "tiktok"
    | "instagram_business"
    | "review"
    | "gamification";
  icon: string;
  defaultName: string;
  defaultDescription: string;
  availableActions: {
    action_type:
      | "write_review"
      | "follow_instagram"
      | "share"
      | "like"
      | "comment"
      | "other";
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

export const CampaignTypeGroups: Record<string, CampaignTypeGroupEntry> = {
  "facebook-share": { id: "facebook", selectedAction: "share" },
  "facebook-like": { id: "facebook", selectedAction: "like" },
  "facebook-comment": { id: "facebook", selectedAction: "comment" },
  "facebook-follow": { id: "facebook", selectedAction: "follow" },
  "instagram-share": { id: "instagram", selectedAction: "share" },
  "instagram-like": { id: "instagram", selectedAction: "like" },
  "instagram-comment": { id: "instagram", selectedAction: "comment" },
  "instagram-follow": { id: "instagram", selectedAction: "follow" },
  "twitter-share": { id: "twitter", selectedAction: "share" },
  "twitter-like": { id: "twitter", selectedAction: "like" },
  "twitter-follow": { id: "twitter", selectedAction: "follow" },
  "threads-share": { id: "threads", selectedAction: "share" },
  "threads-like": { id: "threads", selectedAction: "like" },
  "threads-follow": { id: "threads", selectedAction: "follow" },
  "threads-comment": { id: "threads", selectedAction: "comment" },
  "tiktok-share": { id: "tiktok", selectedAction: "share" },
  "tiktok-like": { id: "tiktok", selectedAction: "like" },
  "tiktok-follow": { id: "tiktok", selectedAction: "follow" },
  "tiktok-comment": { id: "tiktok", selectedAction: "comment" },
  "youtube-share": { id: "youtube", selectedAction: "share" },
  "youtube-like": { id: "youtube", selectedAction: "like" },
  "youtube-follow": { id: "youtube", selectedAction: "follow" },
  "pinterest-share": { id: "pinterest", selectedAction: "share" },
  "vote-campaign": { id: "vote", selectedAction: "vote" },
  "wheel-of-fortune": { id: "wheel", selectedAction: "spin" },
  "slot-machine": { id: "slot", selectedAction: "spin" },
  "scratch-and-win": { id: "scratch", selectedAction: "scratch" },
  "daily-streak": { id: "daily", selectedAction: "daily" },
  "quiz-master": { id: "quiz", selectedAction: "quiz" },
};

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
    const campaignGroupId = CampaignTypeGroups[id];
    if (!campaignGroupId) {
      throw new Error(`Campaign type group not found for ID: ${id}`);
    }

    const campaignTemplate = campaignTemplates.find(
      (template) => template.id === campaignGroupId.id,
    );

    if (!campaignTemplate) {
      throw new Error(
        `Campaign template not found for ID: ${campaignGroupId.id}`,
      );
    }

    return {
      ...campaignTemplate,
      selectedAction: campaignGroupId.selectedAction,
    };
  } catch (error) {
    console.error("Error fetching campaign template:", error);
    return null;
  }
}
