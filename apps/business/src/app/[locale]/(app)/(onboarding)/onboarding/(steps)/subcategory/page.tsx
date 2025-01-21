import { getBusinessBySlug } from "@loopearn/supabase/cached-queries";
import { LaterButton } from "../../later-button";
import { NextButton } from "../../next-button";
import { StepPage } from "../step-page";
import SubcategorySelection from "./subcategory-selection";
export default async function Category({
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
      title="Select all tags"
      description="Select all tags that apply to your business. You can edit this later."
      className="w-full max-w-4xl mx-auto"
    >
      <SubcategorySelection
        businessId={business.id}
        categoryId={business.category ? Number(business.category) : null}
        tags={business.tags ? business.tags : []}
        redirectTo={`/onboarding/profile?slug=${slug}`}
      />

      <LaterButton next="profile" className="mt-4" />
    </StepPage>
  );
}
