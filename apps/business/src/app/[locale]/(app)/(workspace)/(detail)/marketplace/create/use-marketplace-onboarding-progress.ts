import {
  setMarketplaceOnboardingGoBack,
  setMarketplaceOnboardingProgress,
} from "@/actions/set-marketplace-onboarding-progress";
import {
  MARKETPLACE_ONBOARDING_STEPS,
  type MarketplaceOnboardingStep,
} from "@loopearn/supabase/types";
import { useToast } from "@loopearn/ui/use-toast";
import { useAction } from "next-safe-action/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const PRE_WORKSPACE_STEPS = ["info"];

export function useMarketplaceOnboardingProgress() {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const { execute, executeAsync, isExecuting, hasSucceeded } = useAction(
    setMarketplaceOnboardingProgress,
    {
      onSuccess: () => {
        console.log("Onboarding progress updated");
      },
      onError: ({ error }) => {
        toast({
          title: "Failed to update onboarding progress",
          description: "Please try again.",
          variant: "destructive",
        });
        console.error("Failed to update onboarding progress", error);
      },
    },
  );

  const { execute: executeGoBack } = useAction(setMarketplaceOnboardingGoBack, {
    onSuccess: () => {
      console.log("Onboarding progress updated");
    },
  });

  const backTo = useCallback(
    async (
      step: MarketplaceOnboardingStep,
      { slug: providedSlug }: { slug?: string } = {},
    ) => {
      executeGoBack({
        step,
        slug: providedSlug || slug,
      });
    },
    [router, slug],
  );

  const continueTo = useCallback(
    async (
      step: MarketplaceOnboardingStep,
      { slug: providedSlug }: { slug?: string } = {},
    ) => {
      execute({
        onboardingStep: step,
        slug: providedSlug || slug,
      });
      if (!slug) {
        router.push(`/marketplace/create/${step}`);
        return;
      }
      const queryParams = `?slug=${providedSlug || slug}`;
      router.push(`/marketplace/create/${step}${queryParams}`);
    },
    [execute, router, slug],
  );

  const finish = useCallback(async () => {
    await executeAsync({
      onboardingStep: "completed",
      slug: slug || null,
    });

    router.push(slug ? "/?onboarded=true" : "/");
  }, [executeAsync, router, slug]);

  return {
    backTo,
    continueTo,
    finish,
    isLoading: isExecuting,
    isSuccessful: hasSucceeded,
  };
}
