import { GridPlus } from "@loopearn/ui/grid-plus";
import { StepPage } from "../step-page";

export default function Workspace() {
  return (
    <StepPage
      icon={GridPlus}
      title="Create a workspace"
      description={
        <a
          href="https://loopearn.co/help/article/what-is-a-workspace"
          target="_blank"
          className="underline transition-colors hover:text-gray-700"
          rel="noreferrer"
        >
          What is a workspace?
        </a>
      }
    >
      <div />
    </StepPage>
  );
}
