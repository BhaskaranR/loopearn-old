import Features from "@/components/features-vertical";
import Section from "@/components/section";
import { BarChart3, Gift, Globe, Share2, Zap } from "lucide-react";

const data = [
  {
    id: 1,
    title: "1. Create a Campaign",
    content:
      "Set up gamified rewards like spins, quizzes, UGC actions, or loyalty tiers. Customize triggers and rewards to match your business goals.",
    image: "/campaign.png",
    icon: <Gift className="text-primary h-6 w-6" />,
  },
  {
    id: 2,
    title: "2. Connect Your Channels",
    content:
      "Seamlessly integrate with Shopify, social platforms, and customer touchpoints to engage users wherever they are.",
    image: "/integration.png",
    icon: <Share2 className="text-primary h-6 w-6" />,
  },
  {
    id: 3,
    title: "3. Publish to Marketplace",
    content:
      "Expand your reach by publishing campaigns directly to the LoopEarn marketplace, where customers can discover and join instantly.",
    image: "/marketplace.png",
    icon: <Globe className="text-primary h-6 w-6" />,
  },
  {
    id: 4,
    title: "4. Reward & Engage",
    content:
      "Deliver instant rewards, automate payouts with Stripe, and keep customers engaged through personalized loyalty experiences.",
    image: "/rewards.png",
    icon: <Zap className="text-primary h-6 w-6" />,
  },
  {
    id: 5,
    title: "5. Track ROI in Real Time",
    content:
      "Monitor campaign performance with advanced analytics, attribution tracking, and actionable insights to optimize engagement.",
    image: "/analytics.png",
    icon: <BarChart3 className="text-primary h-6 w-6" />,
  },
];

export default function Component() {
  return (
    <Section title="How it works" subtitle="Just 3 steps to get started">
      <Features data={data} />
    </Section>
  );
}
