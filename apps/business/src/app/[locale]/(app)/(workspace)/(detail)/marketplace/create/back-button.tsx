"use client";

import type { MarketplaceOnboardingStep } from "@loopearn/supabase/types";
import { Button, type ButtonProps } from "@loopearn/ui/button";
import { useMarketplaceOnboardingProgress } from "./use-marketplace-onboarding-progress";

export function BackButton({
  step,
  text = "Back",
  ...rest
}: { step: MarketplaceOnboardingStep; text?: string } & ButtonProps) {
  const { backTo } = useMarketplaceOnboardingProgress();

  return (
    <Button onClick={() => backTo(step)} {...rest}>
      {text}
    </Button>
  );
}
