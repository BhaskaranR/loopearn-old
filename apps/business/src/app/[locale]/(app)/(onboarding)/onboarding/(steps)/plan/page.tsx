import { getBusinessBySlug } from "@loopearn/supabase/cached-queries";
import { LaterButton } from "../../later-button";
import { StepPage } from "../step-page";
import { PlanSelector } from "./plan-selector";

export default async function Plan({
  searchParams,
}: {
  searchParams: { slug: string };
}) {
  const slug = searchParams.slug;

  const business = await getBusinessBySlug(slug);

  if (!business) {
    return <div>Business not found</div>;
  }

  return (
    <StepPage
      title="Choose your plan"
      description="Find a plan that fits your needs"
      className="max-w-3xl"
    >
      <PlanSelector currentPlan={business.plan || "Free Plus"} slug={slug} />
      <div className="mt-8 flex flex-col gap-3">
        <LaterButton next="finish">
          I'll continue with the free plan
        </LaterButton>
      </div>
    </StepPage>
  );
}
