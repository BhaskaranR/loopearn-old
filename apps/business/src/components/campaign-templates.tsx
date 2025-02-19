"use client";
import {
  ExpandingArrow,
  Google,
  Pinterest,
  Threads,
  Tiktok,
  Twitter,
} from "@loopearn/ui/icons";
import {
  Calculator,
  CircleDot,
  Clock,
  Coins,
  Dice5,
  Facebook,
  Globe,
  HelpCircle,
  Instagram,
  Mail,
  MessageCircle,
  Plus,
  Share2,
  Star,
  ThumbsUp,
  Trophy,
  UserPlus,
  Vote,
} from "lucide-react";

interface Template {
  id: string;
  title: string;
  description: string;
  type: string;
  category:
    | "Types"
    | "Objective"
    | "game-Based"
    | "Pop-ups"
    | "action-based"
    | "Time-Based";
  usageCount?: number;
  isNew?: boolean;
  comingSoon?: boolean;
  icon?: React.ElementType;
  items?: {
    id: string;
    icon: React.ElementType;
    title: string;
    description: string;
  }[];
}
import { Gamepad2, Heart, MousePointerClick } from "lucide-react";

export const CampaignTypeGroups = [
  {
    label: "Types",
    items: [
      { id: "game-based", label: "Game-Based", icon: Gamepad2 },
      { id: "action-based", label: "Action-Based", icon: MousePointerClick },
    ],
  },
  {
    label: "Objective",
    items: [
      { id: "gamify", label: "Gamify", icon: Trophy },
      { id: "acquire", label: "Acquire", icon: UserPlus },
      { id: "engage", label: "Engage", icon: Heart },
    ],
  },
];

export const CampaignTemplates: Template[] = [
  // Pop-ups Section
  {
    id: "newsletter-popup",
    title: "Subscribe to newsletter",
    description: "Collect emails with an engaging newsletter signup popup",
    type: "pop-ups",
    category: "Types",
    icon: Mail,
    isNew: true,
  },
  {
    id: "write-review",
    title: "Loopearn Review",
    description: "Reward customers for writing product reviews",
    type: "action-based",
    category: "Types",
    icon: Star,
    isNew: true,
  },
  {
    id: "google-review",
    title: "Google Review",
    description: "Incentivize customers to leave Google reviews",
    type: "action-based",
    category: "Types",
    icon: Google,
    usageCount: 312,
  },
  {
    id: "facebook-share",
    title: "Facebook",
    description: "Reward customers for sharing on Facebook",
    type: "action-based",
    category: "Types",
    icon: Facebook,
    usageCount: 423,
    items: [
      {
        id: "recommend",
        title: "Recommend",
        icon: ThumbsUp,
        description: "Reward customers for recommending on Facebook",
      },
      {
        id: "share",
        title: "Share",
        icon: Share2,
        description: "Reward customers for sharing on Facebook",
      },
      {
        id: "follow",
        title: "Follow",
        icon: UserPlus,
        description: "Reward customers for following on Facebook",
      },
      {
        id: "like",
        title: "Like",
        icon: ThumbsUp,
        description: "Reward customers for liking on Facebook",
      },
      {
        id: "comment",
        title: "Comment",
        icon: MessageCircle,
        description: "Reward customers for commenting on Facebook",
      },
    ],
  },
  {
    id: "instagram-share",
    title: "Instagram",
    description: "Reward customers for sharing on Instagram",
    type: "action-based",
    category: "Types",
    icon: Instagram,
    usageCount: 389,
    items: [
      {
        id: "share",
        title: "Share",
        icon: Share2,
        description: "Reward customers for sharing on Instagram",
      },
      {
        id: "follow",
        title: "Follow",
        icon: UserPlus,
        description: "Reward customers for following on Instagram",
      },
    ],
  },
  {
    id: "twitter-share",
    title: "Twitter",
    description: "Reward customers for sharing on Twitter",
    type: "action-based",
    category: "Types",
    icon: Twitter,
    usageCount: 267,
    items: [
      {
        id: "like",
        title: "Like",
        icon: ThumbsUp,
        description: "Reward customers for liking on Twitter",
      },
      {
        id: "share",
        title: "Share",
        icon: Share2,
        description: "Reward customers for sharing on Twitter",
      },
      {
        id: "follow",
        title: "Follow",
        icon: UserPlus,
        description: "Reward customers for following on Twitter",
      },
    ],
  },
  {
    id: "threads-share",
    title: "Threads",
    description: "Reward customers for sharing on Threads",
    type: "action-based",
    category: "Types",
    icon: Threads,
    usageCount: 198,
    items: [
      {
        id: "share",
        title: "Share",
        icon: Share2,
        description: "Reward customers for sharing on Threads",
      },
      {
        id: "follow",
        title: "Follow",
        icon: UserPlus,
        description: "Reward customers for following on Threads",
      },
    ],
  },
  {
    id: "tiktok-share",
    title: "Tiktok",
    description: "Reward customers for sharing on TikTok",
    type: "action-based",
    category: "Types",
    icon: Tiktok,
    usageCount: 198,
    items: [
      {
        id: "share",
        title: "Share",
        icon: Share2,
        description: "Reward customers for sharing on TikTok",
      },
      {
        id: "follow",
        title: "Follow",
        icon: UserPlus,
        description: "Reward customers for following on TikTok",
      },
    ],
  },
  {
    id: "pinterest-share",
    title: "Pinterest",
    description: "Reward customers for sharing on Pinterest",
    type: "action-based",
    category: "Types",
    icon: Pinterest,
    usageCount: 198,
    items: [
      {
        id: "share",
        title: "Share",
        icon: Share2,
        description: "Reward customers for sharing on Pinterest",
      },
    ],
  },
  {
    id: "vote-campaign",
    title: "Vote for our next campaigns!",
    description: "Engage customers in decision-making for future campaigns",
    type: "action-based",
    category: "Objective",
    comingSoon: true,
    icon: Vote,
    usageCount: 167,
    isNew: true,
  },
  {
    id: "wheel-of-fortune",
    title: "Wheel of Fortune",
    description: "Let customers spin a wheel to win exciting rewards",
    type: "game-Based",
    category: "Types",
    icon: CircleDot,
    comingSoon: true,
    isNew: true,
  },
  {
    id: "slot-machine",
    title: "Slot Machine",
    description: "Engage customers with a classic slot machine game",
    type: "game-Based",
    category: "Types",
    icon: Dice5,
    comingSoon: true,
    usageCount: 245,
  },
  {
    id: "scratch-and-win",
    title: "Scratch & Win",
    description: "Digital scratch cards with instant rewards",
    type: "game-based",
    category: "Types",
    icon: Trophy,
    comingSoon: true,
    isNew: true,
  },
  {
    id: "daily-streak",
    title: "Daily Explorer",
    description: "Reward customers for maintaining daily visit streaks",
    type: "game-based",
    category: "Types",
    icon: Globe,
    usageCount: 189,
    comingSoon: true,
  },
  {
    id: "quiz-master",
    title: "Quiz Master",
    description: "Engage customers with interactive quizzes and rewards",
    type: "game-based",
    category: "Types",
    icon: HelpCircle,
    comingSoon: true,
    usageCount: 156,
  },
];
