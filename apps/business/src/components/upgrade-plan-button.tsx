"use client";

import { upgradeSubscriptionAction } from "@/actions/upgrade-subscription-action";
import { env } from "@/env.mjs";
import { getStripe } from "@/stripe/client";
import { SELF_SERVE_PAID_PLANS } from "@/utils/pricing";
import { Button } from "@loopearn/ui/button";
import { LoadingSpinner } from "@loopearn/ui/loading-spinner";
import { useToast } from "@loopearn/ui/use-toast";
import { useAction } from "next-safe-action/hooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function UpgradePlanButton({
  plan,
  period,
  text,
  slug: workspaceSlug,
  currentPlan,
}: {
  plan: string;
  period: "monthly" | "yearly";
  text?: string;
  slug: string;
  currentPlan: string;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedPlan =
    SELF_SERVE_PAID_PLANS.find(
      (p) => p.name.toLowerCase() === plan.toLowerCase(),
    ) ?? SELF_SERVE_PAID_PLANS[0];

  const [clicked, setClicked] = useState(false);

  const queryString = searchParams.toString();

  const isCurrentPlan = currentPlan === selectedPlan.name.toLowerCase();

  const { execute, executeAsync, isExecuting, hasSucceeded } = useAction(
    upgradeSubscriptionAction,
    {
      onSuccess: async (res) => {
        setClicked(false);
        if (currentPlan === "free_plus") {
          const sessionId = "your_test_session_id"; // Replace with a valid test session ID
          console.log("Using session ID:", sessionId); // Log the session ID
          const stripe = await getStripe();
          if (stripe) {
            stripe.redirectToCheckout({ sessionId }).then((result) => {
              if (result.error) {
                console.error("Stripe checkout error:", result.error.message);
                toast({
                  title: "Checkout Error",
                  description: result.error.message,
                  variant: "destructive",
                });
              } else {
                console.log("Redirecting to checkout...");
              }
            });
          } else {
            console.error("Stripe not loaded");
            toast({
              title: "Stripe Error",
              description: "Stripe could not be loaded. Please try again.",
              variant: "destructive",
            });
          }
        } else {
          const { url } = res.data;
          router.push(url);
        }
      },
      onError: ({ error }) => {
        setClicked(false);
        toast({
          title: "Failed to update onboarding progress",
          description: "Please try again.",
          variant: "destructive",
        });
        console.error("Failed to update onboarding progress", error);
      },
    },
  );

  const handleUpgrade = () => {
    setClicked(true);
    execute({
      plan,
      period,
      baseUrl: `${env.NEXT_PUBLIC_BUSINESS_DOMAIN}${pathname}${queryString.length > 0 ? `?${queryString}` : ""}`,
      onboarding: true,
    });
  };

  return (
    <Button
      className="capitalize"
      disabled={!workspaceSlug || isCurrentPlan || isExecuting}
      onClick={handleUpgrade}
    >
      {clicked && <LoadingSpinner />}
      {isCurrentPlan
        ? "Your current plan"
        : currentPlan === "free"
          ? `Get started with ${selectedPlan.name} ${period}`
          : `Switch to ${selectedPlan.name} ${period}`}
    </Button>
  );
}
