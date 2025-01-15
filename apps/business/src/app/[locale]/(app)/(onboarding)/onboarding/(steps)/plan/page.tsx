import { LaterButton } from "../../later-button";
import { StepPage } from "../step-page";

export default function Plan() {
  return (
    <StepPage
      title="Choose your plan"
      description="Find a plan that fits your needs"
      className="max-w-2xl"
    >
      <div />
      <div className="mt-8 flex flex-col gap-3">
        <a
          href="https://dub.co/enterprise"
          target="_blank"
          rel="noreferrer"
          className="w-full text-center text-sm text-gray-500 transition-colors hover:text-gray-700"
        >
          Looking for enterprise?
        </a>
        <LaterButton next="finish">I'll pick a plan later</LaterButton>
      </div>
    </StepPage>
  );
}
