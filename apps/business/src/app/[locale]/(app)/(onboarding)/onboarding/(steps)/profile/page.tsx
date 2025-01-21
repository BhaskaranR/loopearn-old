import { getBusinessBySlug } from "@loopearn/supabase/cached-queries";
import { LaterButton } from "../../later-button";
import { StepPage } from "../step-page";
import { UpdateProfileForm } from "./update-profile-form";

export default async function UpdateProfile({
  searchParams,
}: {
  searchParams: { slug: string };
}) {
  const slug = searchParams.slug;

  const { data: business } = await getBusinessBySlug(slug);

  if (!business) {
    return <div>Business not found</div>;
  }

  return (
    <StepPage
      title="Update your company profile"
      description="Don't worry, you can edit this later."
      className="w-full max-w-2xl mx-auto"
    >
      <div className="animate-slide-up-fade mt-8 w-full [--offset:10px] [animation-delay:500ms] [animation-duration:1s] [animation-fill-mode:both]">
        <UpdateProfileForm
          data={business}
          redirectTo={`/onboarding/verify?slug=${slug}`}
        />

        <LaterButton next="plan" className="mt-4" />
      </div>
    </StepPage>
  );
}
