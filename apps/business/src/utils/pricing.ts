export type PlanFeature = {
  id?: string;
  text: string;
  footnote?: {
    title: string;
    cta: string;
    href: string;
  };
};

export type PlanPrice = {
  monthly: number | null;
  yearly: number | null;
  ids?: string[];
};

export const PLANS = [
  {
    name: "Pro",
    tagline: "For businesses ready to scale their loyalty program",
    price: {
      monthly: 199,
      yearly: 2149,
    } as PlanPrice,
    limits: {
      rewardCampaigns: 20,
      vipTiers: "unlimited",
      appIntegrations: 3,
    },
    colors: {
      bg: "bg-blue-600",
      text: "text-blue-600",
    },
    cta: {
      text: "Get Pro Plus",
      href: "https://app.loopearn.com/register",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    featureTitle: "Everything in Free, plus:",
    features: [
      { id: "active-campaigns", text: "20 Active Reward Campaigns" },
      { id: "vip-tiers", text: "Unlimited VIP Tiers" },
      { id: "white-label", text: "Remove LoopEarn Branding" },
      { id: "segmentation", text: "Customer Segmentation" },
      { id: "communication", text: "Communication Campaigns" },
      { id: "integrations", text: "Up to 3 Apps Integrations" },
      { id: "custom-domain", text: "Custom Domain" },
      { id: "analytics", text: "Advanced Analytics" },
      { id: "api-access", text: "API Access" },
      {
        id: "AI Agent",
        text: "Social Media Agent",
        footnote: {
          title:
            "Add a social media agent to your plan for additional $100/month",
          cta: "Learn more",
          href: "/social-media-agent",
        },
      },
    ] as PlanFeature[],
  },
  {
    name: "Enterprise",
    tagline: "For large organizations with custom needs",
    price: {
      monthly: null,
      yearly: null,
    } as PlanPrice,
    limits: {
      rewardCampaigns: "unlimited",
      appIntegrations: "unlimited",
    },
    colors: {
      bg: "bg-violet-600",
      text: "text-violet-600",
    },
    cta: {
      text: "Contact us",
      href: "/enterprise",
      color:
        "bg-white hover:bg-gray-50 border border-gray-200 hover:ring-gray-100 text-neutral-800",
    },
    featureTitle: "Everything in Pro, plus:",
    features: [
      { id: "challenges", text: "Unlimited Challenges" },
      { id: "api", text: "API Access" },
      { id: "custom-events", text: "Create Custom Events" },
      { id: "app-integration", text: "Unlimited App Integration" },
      { id: "leaderboard", text: "Leaderboard" },
      { id: "custom-reporting", text: "Custom Reporting" },
      { id: "priority-support", text: "Priority Support" },
    ] as PlanFeature[],
  },
];

export const PRO_PLAN = PLANS.find((plan) => plan.name === "Pro")!;
export const ENTERPRISE_PLAN = PLANS.find(
  (plan) => plan.name === "Enterprise",
)!;

export const PUBLIC_PLANS = [PRO_PLAN, ENTERPRISE_PLAN];

export const SELF_SERVE_PAID_PLANS = PLANS.filter(
  (p) => p.name === "Pro" || p.name === "Enterprise",
);

export const FREE_WORKSPACES_LIMIT = 2;

export const getPlanFromPriceId = (priceId: string) => {
  return PLANS.find((plan) => plan.price.ids?.includes(priceId)) || null;
};

export const getPlanDetails = (plan: string) => {
  return SELF_SERVE_PAID_PLANS.find(
    (p) => p.name.toLowerCase() === plan.toLowerCase(),
  )!;
};

export const getCurrentPlan = (plan: string) => {
  return (
    PLANS.find((p) => p.name.toLowerCase() === plan.toLowerCase()) || PRO_PLAN
  );
};

export const getNextPlan = (plan?: string | null) => {
  if (!plan) return PRO_PLAN;
  return PLANS[
    PLANS.findIndex((p) => p.name.toLowerCase() === plan.toLowerCase()) + 1
  ];
};
