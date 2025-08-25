import { Icons } from "@/components/icons";
import { FaTwitter } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";

export const BLUR_FADE_DELAY = 0.15;

export const siteConfig = {
  name: "loopearn.com",
  description: "Open-Source Rewards & Loyalty Platform",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  keywords: ["Open Source", "Rewards", "Loyalty", "Gamification", "Shopify"],
  links: {
    email: "support@loopearn.com",
    twitter: "https://twitter.com/loopearn",
    discord: "https://discord.gg/loopearn",
    github: "https://github.com/loopearn/loopearn",
    instagram: "https://instagram.com/loopearn",
  },
  header: [
    {
      trigger: "Features",
      content: {
        main: {
          icon: <Icons.logo className="h-6 w-6" />,
          title: "Gamified Rewards Engine",
          description: "Engage customers with interactive loyalty campaigns.",
          href: "#",
        },
        items: [
          {
            href: "#",
            title: "Spin & Play",
            description: "Gamify experiences with spin-the-wheel and challenges.",
          },
          {
            href: "#",
            title: "UGC Rewards",
            description: "Reward creators for content and social actions.",
          },
          {
            href: "#",
            title: "Customer Tiers",
            description: "Build loyalty with tiered memberships and perks.",
          },
        ],
      },
    },
    {
      trigger: "Solutions",
      content: {
        items: [
          {
            title: "For Shopify",
            href: "#",
            description: "Seamlessly integrate with Shopify Flow and checkout.",
          },
          {
            title: "Local Merchants",
            href: "#",
            description: "Run neighborhood deals and community campaigns.",
          },
          {
            title: "Marketplaces",
            href: "#",
            description: "Publish rewards directly to the LoopEarn marketplace.",
          },
          {
            title: "Enterprises",
            href: "#",
            description: "Scale customer engagement across global audiences.",
          },
          {
            title: "Creators",
            href: "#",
            description: "Monetize user-generated content with payouts.",
          },
          {
            title: "Agencies",
            href: "#",
            description: "Offer loyalty and rewards as a white-label service.",
          },
        ],
      },
    },
    {
      href: "/blog",
      label: "Blog",
    },
  ],
  pricing: [
    {
      name: "FREE",
      href: "#",
      price: "$0",
      period: "month",
      yearlyPrice: "$0",
      features: [
        "Unlimited Campaigns",
        "1,000 Responses / Month",
        "2,000 Contacts",
        "3 Projects",
        "Unlimited Team Members",
        "Link Campaigns",
        "In-product Campaigns",
        "iOS & Android SDK for mobile campaigns",
        "Email Embedded Campaigns",
        "Logic Jumps, Hidden Fields, Recurring Campaigns, etc.",
        "API & Webhooks",
      ],
      description: "Perfect to get started and test campaigns",
      buttonText: "Get started",
      isPopular: false,
    },
    {
      name: "STARTUP",
      href: "#",
      price: "$49",
      period: "month",
      yearlyPrice: "$40",
      features: [
        "Everything in Free",
        "5,000 Responses / Month",
        "7,500 Contacts",
        "3 Projects",
        "Remove Branding",
        "Email Follow-ups",
        "Attribute-based Targeting",
      ],
      description: "Best for growing businesses running campaigns at scale",
      buttonText: "Start free trial",
      isPopular: true,
    },
    {
      name: "SCALE & ENTERPRISE",
      href: "#",
      price: "Custom",
      period: "month",
      yearlyPrice: "Custom",
      features: [
        "Everything in Startup",
        "Custom Responses Limit",
        "Custom Contacts Limit",
        "Custom Projects Limit",
        "Team Access Roles",
        "Multi-language Campaigns",
        "Uptime SLA (99%)",
        "Premium Support",
      ],
      description: "Tailored for enterprises with advanced needs",
      buttonText: "Request pricing",
      isPopular: false,
    },
  ],
  faqs: [
    {
      question: "What is LoopEarn?",
      answer: (
        <span>
          LoopEarn is an open-source rewards and loyalty platform that helps businesses launch gamified
          campaigns, manage loyalty, and drive customer engagement across channels.
        </span>
      ),
    },
    {
      question: "How do I get started?",
      answer: (
        <span>
          Sign up on loopearn.com, connect your Shopify store or marketplace account, and create your first
          reward campaign in minutes.
        </span>
      ),
    },
    {
      question: "Does LoopEarn support Shopify?",
      answer: (
        <span>
          Yes, LoopEarn integrates natively with Shopify Flow and checkout to trigger rewards based on
          customer actions and store events.
        </span>
      ),
    },
    {
      question: "Is LoopEarn open source?",
      answer: (
        <span>
          Yes. LoopEarn is built on an open-source foundation (AGPL license) so you have transparency,
          flexibility, and community-driven innovation.
        </span>
      ),
    },
    {
      question: "What kind of support is available?",
      answer: (
        <span>
          We provide documentation, tutorials, community channels, and premium enterprise support for teams
          that need advanced help.
        </span>
      ),
    },
  ],
  footer: [
    {
      title: "Product",
      links: [
        { href: "#", text: "Features", icon: null },
        { href: "#", text: "Pricing", icon: null },
        { href: "#", text: "Documentation", icon: null },
        { href: "#", text: "API", icon: null },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "#", text: "About Us", icon: null },
        { href: "#", text: "Careers", icon: null },
        { href: "#", text: "Blog", icon: null },
        { href: "#", text: "Press", icon: null },
        { href: "#", text: "Partners", icon: null },
      ],
    },
    {
      title: "Resources",
      links: [
        { href: "#", text: "Community", icon: null },
        { href: "#", text: "Contact", icon: null },
        { href: "#", text: "Support", icon: null },
        { href: "#", text: "Status", icon: null },
      ],
    },
    {
      title: "Social",
      links: [
        {
          href: "#",
          text: "Twitter",
          icon: <FaTwitter />,
        },
        {
          href: "#",
          text: "Instagram",
          icon: <RiInstagramFill />,
        },
        {
          href: "#",
          text: "Youtube",
          icon: <FaYoutube />,
        },
      ],
    },
  ],
};

export type SiteConfig = typeof siteConfig;
