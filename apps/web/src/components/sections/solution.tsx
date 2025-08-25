"use client";

import FlickeringGrid from "@/components/magicui/flickering-grid";
import Ripple from "@/components/magicui/ripple";
import Safari from "@/components/safari";
import Section from "@/components/section";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const features = [
  {
    title: "Open-Source Flexibility",
    description:
      "Stay in control with a transparent, extensible rewards platform—no vendor lock-in, fully customizable to your business needs.",
    className: "hover:bg-emerald-500/10 transition-all duration-500 ease-out",
    content: (
      <>
        <Safari
          src={`/screens/opensource.png`}
          url="https://loopearn.dev"
          className="mt-4 -mb-32 max-h-64 w-full px-4 drop-shadow-[0_0_28px_rgba(0,0,0,.12)] transition-all duration-300 select-none group-hover:translate-y-[-10px]"
        />
      </>
    ),
  },
  {
    title: "Gamified Engagement",
    description:
      "Launch interactive campaigns—spin the wheel, quizzes, UGC, and time-based rewards—to capture attention and inspire repeat actions.",
    className: "md:row-span-2 hover:bg-violet-500/10 transition-all duration-500 ease-out",
    content: (
      <>
        <FlickeringGrid
          className="absolute inset-0 z-0 [mask:radial-gradient(circle_at_center,#fff_420px,transparent_0)]"
          squareSize={4}
          gridGap={6}
          color="#000"
          maxOpacity={0.08}
          flickerChance={0.1}
          height={820}
          width={820}
        />
        <Safari
          src={`/screens/gamified.png`}
          url="https://loopearn.app/campaigns"
          className="mt-16 -mb-48 ml-12 h-full px-4 drop-shadow-[0_0_28px_rgba(0,0,0,.12)] transition-all duration-300 select-none group-hover:translate-x-[-10px]"
        />
      </>
    ),
  },
  {
    title: "Seamless Integrations",
    description:
      "Connect with Shopify Flow, social platforms, and payment providers—publish once and manage rewards across all channels.",
    className: "order-3 xl:order-none hover:bg-blue-500/10 transition-all duration-500 ease-out",
    content: (
      <Safari
        src={`/screens/integrations.png`}
        url="https://loopearn.app/integrations"
        className="mt-4 -mb-32 max-h-64 w-full px-4 drop-shadow-[0_0_28px_rgba(0,0,0,.12)] transition-all duration-300 select-none group-hover:translate-y-[-10px]"
      />
    ),
  },
  {
    title: "Analytics & Automated Payouts",
    description:
      "Track ROI with real-time attribution and streamline rewards distribution via Stripe and built-in payout automation.",
    className:
      "flex-row order-4 md:col-span-2 md:flex-row xl:order-none hover:bg-amber-500/10 transition-all duration-500 ease-out",
    content: (
      <>
        <Ripple className="absolute -bottom-full" />
        <Safari
          src={`/screens/analytics.png`}
          url="https://loopearn.app/analytics"
          className="mt-4 -mb-32 max-h-64 w-full px-4 drop-shadow-[0_0_28px_rgba(0,0,0,.12)] transition-all duration-300 select-none group-hover:translate-y-[-10px]"
        />
      </>
    ),
  },
];

export default function Component() {
  return (
    <Section
      title="Solution"
      subtitle="Open-Source Rewards, Built for Growth"
      description="Traditional loyalty programs are rigid and outdated. LoopEarn gives your business a flexible, gamified, and open-source platform to launch campaigns, reward customers across channels, and track ROI—all without vendor lock-in."
      className="bg-neutral-100 dark:bg-neutral-900">
      <div className="mx-auto mt-16 grid max-w-sm grid-cols-1 gap-6 text-gray-500 md:max-w-3xl md:grid-cols-2 md:grid-rows-3 xl:max-w-6xl xl:auto-rows-fr xl:grid-cols-3 xl:grid-rows-2">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className={cn(
              "group relative items-start overflow-hidden rounded-2xl bg-neutral-50 p-6 dark:bg-neutral-800",
              feature.className
            )}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 100,
              damping: 30,
              delay: index * 0.1,
            }}
            viewport={{ once: true }}>
            <div>
              <h3 className="text-primary mb-2 font-semibold">{feature.title}</h3>
              <p className="text-foreground">{feature.description}</p>
            </div>
            {feature.content}
            <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-neutral-50 dark:from-neutral-900"></div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
