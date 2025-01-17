import { CreateTeamForm } from "@/components/forms/create-team-form";
import { GridPlus } from "@loopearn/ui/grid-plus";
import { StepPage } from "../step-page";

export default function Workspace() {
  return (
    <StepPage
      icon={GridPlus}
      title="Update your business"
      description={
        <a
          href="https://loopearn.co/help/article/what-is-a-workspace"
          target="_blank"
          className="transition-colors hover:text-gray-700" // Removed 'underline'
          rel="noreferrer"
        >
          Learn more about what a workspace is and how it can help organize your
          business operations effectively.
        </a>
      }
    >
      <CreateTeamForm continueTo={"/onboarding/invite"} />
    </StepPage>
  );
}
