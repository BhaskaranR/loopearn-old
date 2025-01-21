import StripeConnectButton from "@/components/stripe-connect-button";
import Link from "next/link";
import { LaterButton } from "../../later-button";
import { StepPage } from "../step-page";

export default function OnboardingVerification() {
  return (
    <StepPage
      title="Verify your company"
      description="Welcome to LoopEarn! To ensure a secure and compliant experience, we partner with Stripe to verify your business through their Know Your Customer (KYC) process. This step is crucial for enabling your business to access our platform's full suite of features, including seamless payment processing and financial services."
      className="w-full max-w-sm mx-auto my-10 md:mt-14"
    >
      <div className="animate-slide-up-fade mt-8 w-full [--offset:10px] [animation-delay:500ms] [animation-duration:1s] [animation-fill-mode:both]">
        <div className="divide-y divide-neutral-200 overflow-hidden rounded-lg border border-neutral-200">
          <div className="flex items-center justify-center bg-neutral-50 p-6">
            <img
              src="https://assets.dub.co/misc/stripe-wordmark.svg"
              alt="Stripe wordmark"
              className="aspect-[96/40] h-12"
            />
          </div>
        </div>
        <div className="mt-6 grid gap-4">
          <StripeConnectButton text="Continue to Stripe" />
          <LaterButton next="plan" className="mt-4">
            I'll complete this later
          </LaterButton>
        </div>
      </div>
    </StepPage>
  );
}
