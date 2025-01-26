import { setOnboardingProgress } from "@/actions/set-onboarding-progress";
import {
  ONBOARDING_STEPS,
  type OnboardingStep,
} from "@loopearn/supabase/types";
import { useToast } from "@loopearn/ui/use-toast";
import { useAction } from "next-safe-action/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const PRE_WORKSPACE_STEPS = ["workspace"];

export function useOnboardingProgress() {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  // const { slug: workspaceSlug } = useWorkspace();
  const slug = searchParams.get("slug");

  const { execute, executeAsync, isExecuting, hasSucceeded } = useAction(
    setOnboardingProgress,
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

  const continueTo = useCallback(
    async (
      step: OnboardingStep,
      { slug: providedSlug }: { slug?: string } = {},
    ) => {
      execute({
        onboardingStep: step,
      });
      if (!slug) {
        router.push(`/onboarding/${step}`);
        return;
      }
      const queryParams = `?slug=${providedSlug || slug}`;
      router.push(`/onboarding/${step}${queryParams}`);
    },
    [execute, router, slug],
  );

  const finish = useCallback(async () => {
    await executeAsync({
      onboardingStep: "completed",
    });

    router.push(slug ? "/?onboarded=true" : "/");
  }, [execute, router, slug]);

  return {
    continueTo,
    finish,
    isLoading: isExecuting,
    isSuccessful: hasSucceeded,
  };
}
