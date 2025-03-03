"use client";

import type { MarketplaceOnboardingStep } from "@loopearn/supabase/types";
import { Button, type ButtonProps } from "@loopearn/ui/button";
import { LoadingSpinner } from "@loopearn/ui/loading-spinner";
import { useMarketplaceOnboardingProgress } from "./use-marketplace-onboarding-progress";

export function NextButton({
  step,
  text = "Next",
  ...rest
}: { step: MarketplaceOnboardingStep; text?: string } & ButtonProps) {
  const { continueTo, isLoading, isSuccessful } =
    useMarketplaceOnboardingProgress();

  return (
    <Button variant="outline" onClick={() => continueTo(step)} {...rest}>
      {isLoading || (isSuccessful && <LoadingSpinner className="mr-2" />)}{" "}
      {text}
    </Button>
  );
}
