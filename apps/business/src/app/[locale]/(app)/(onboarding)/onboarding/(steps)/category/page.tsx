import { getBusinessBySlug } from "@loopearn/supabase/cached-queries";
import { LaterButton } from "../../later-button";
import { StepPage } from "../step-page";
import CategorySelection from "./category-selection";
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
      title="Select a category"
      description="Don't worry, you can edit this later."
      className="w-full max-w-4xl mx-auto"
    >
      <CategorySelection
        businessId={business.id.toString()}
        initialCategoryId={business.category || null}
        redirectTo={`/onboarding/subcategory?slug=${slug}`}
      />
      <LaterButton next="plan" className="mt-4" />
    </StepPage>
  );
}
