import Features from "@/components/features-horizontal";
import Section from "@/components/section";
import { BarChart3, Code2, Gamepad2, Puzzle, Share2, Users } from "lucide-react";

const data = [
  {
    id: 1,
    title: "Open Source Infrastructure",
    content: "Transparent, extensible, and community-driven foundation without vendor lock-in.",
    image: "/opensource.png",
    icon: <Code2 className="text-primary h-6 w-6" />,
  },
  {
    id: 2,
    title: "Gamified Campaigns",
    content: "Engage customers with spin-the-wheel, quizzes, UGC rewards, and time-based challenges.",
    image: "/gamification.png",
    icon: <Gamepad2 className="text-primary h-6 w-6" />,
  },
  {
    id: 3,
    title: "Multi-Channel Rewards",
    content: "Reward actions across Shopify, social media, and the LoopEarn marketplace in one platform.",
    image: "/multi-channel.png",
    icon: <Share2 className="text-primary h-6 w-6" />,
  },
  {
    id: 4,
    title: "Loyalty & Segmentation",
    content: "Create customer tiers, track engagement, and personalize rewards for every segment.",
    image: "/loyalty.png",
    icon: <Users className="text-primary h-6 w-6" />,
  },
  {
    id: 5,
    title: "Analytics & Attribution",
    content: "Understand ROI with campaign analytics, UTM tracking, and real-time insights.",
    image: "/analytics.png",
    icon: <BarChart3 className="text-primary h-6 w-6" />,
  },
  {
    id: 6,
    title: "Seamless Integrations",
    content: "Plug into Shopify Flow, Stripe, and other tools to automate payouts and workflows.",
    image: "/integrations.png",
    icon: <Puzzle className="text-primary h-6 w-6" />,
  },
];

export default function Component() {
  return (
    <Section title="Features" subtitle="User Flows and Navigational Structures">
      <Features collapseDelay={5000} linePosition="bottom" data={data} />
    </Section>
  );
}
