import { CreateTeamForm } from "@/components/forms/create-team-form";
import { getBusinessBySlug } from "@loopearn/supabase/cached-queries";
import { redirect } from "next/navigation";
import { StepPage } from "../step-page";

export default async function Workspace({
  searchParams,
}: {
  searchParams: { slug: string };
}) {
  return (
    <StepPage
      title="What’s the name of your company or team?"
      description={
        <a
          href="https://loopearn.co/help/article/what-is-a-workspace"
          target="_blank"
          className="transition-colors hover:text-gray-700" // Removed 'underline'
          rel="noreferrer"
        >
          This will be the name of your LoopEarn team — choose something that
          your team will recognize.
        </a>
      }
    >
      <CreateTeamForm continueTo="/onboarding/category" />
    </StepPage>
  );
}
