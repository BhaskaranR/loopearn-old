import { ExitButton } from "@/app/[locale]/(app)/(onboarding)/onboarding/(steps)/exit-button";
import { getBusinessBySlug } from "@loopearn/supabase/cached-queries";
import { Logo } from "@loopearn/ui/logo";
import { ScrollArea } from "@loopearn/ui/scroll-area";
import { redirect } from "next/navigation";
import { StepPage } from "../step-page";
import SubcategorySelection from "./subcategory-selection";
export default async function Category({
  searchParams,
}: {
  searchParams: { slug: string };
}) {
  const slug = searchParams.slug;

  const business = await getBusinessBySlug(slug);

  if (!business) {
    return redirect("/not-found");
  }

  return (
    <ScrollArea className="h-[calc(100vh-100px)] border-0">
      <div className="fixed top-0 left-0 right-0 h-[64px] bg-background z-50 flex items-center px-2 md:px-10">
        <Logo className="font-semibold h-8 w-auto" />
        <div className="ml-auto">
          <ExitButton />
        </div>
      </div>

      <StepPage
        title="Select all tags"
        description="Select all tags that apply to your business. You can edit this later."
        className="w-full max-w-4xl mx-auto mt-20"
      >
        <SubcategorySelection
          businessId={business.id}
          categoryId={business.category ? Number(business.category) : null}
          tags={business.tags ? business.tags : []}
          redirectTo={`/marketplace/create/campaign?slug=${slug}`}
        />
      </StepPage>
    </ScrollArea>
  );
}
