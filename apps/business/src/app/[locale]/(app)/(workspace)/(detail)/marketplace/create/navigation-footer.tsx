"use client";

import type { MarketplaceOnboardingStep } from "@loopearn/supabase/types";
import { Button } from "@loopearn/ui/button";
import { BackButton } from "./back-button";
import { StepProgress } from "./step-progress";

interface NavigationFooterProps {
  isBackVisible?: boolean;
  backStep?: MarketplaceOnboardingStep;
  children: React.ReactNode;
  currentStep: number;
}

export function NavigationFooter({
  backStep,
  isBackVisible = true,
  children,
  currentStep,
}: NavigationFooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t bg-background ">
      <StepProgress currentStep={currentStep} totalSteps={8} />
      <div className="mx-auto px-6 py-4 flex justify-between space-between items-center">
        {isBackVisible && (
          <BackButton
            type="button"
            variant="ghost"
            className="hover:bg-secondary"
            text="Back"
            step={backStep || "info"}
          />
        )}

        {children}
      </div>
    </footer>
  );
}
