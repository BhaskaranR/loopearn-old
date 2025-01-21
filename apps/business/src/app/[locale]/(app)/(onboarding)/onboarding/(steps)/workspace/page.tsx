import { getBusinessBySlug } from "@loopearn/supabase/cached-queries";
import { redirect } from "next/navigation";
import { StepPage } from "../step-page";
import { OnboardTeamForm } from "./onboard-team-form";

export default async function Workspace({
  searchParams,
}: {
  searchParams: { slug: string };
}) {
  const slug = searchParams.slug;

  const { data: business } = await getBusinessBySlug(slug);

  if (!business) {
    redirect("/not-found");
  }

  return (
    <StepPage
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
      <OnboardTeamForm
        id={business.id.toString()}
        name={business.business_name}
        slug={business.slug}
        continueTo={"/onboarding/category"}
      />
    </StepPage>
  );
}
