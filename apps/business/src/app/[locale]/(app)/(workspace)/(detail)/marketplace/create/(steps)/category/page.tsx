import { getBusinessBySlug } from "@loopearn/supabase/cached-queries";
import { Logo } from "@loopearn/ui/logo";
import { ScrollArea } from "@loopearn/ui/scroll-area";
import { redirect } from "next/navigation";
import { ExitButton } from "../exit-button";
import { StepPage } from "../step-page";
import CategorySelection from "./category-selection";
export default async function Category({
  searchParams,
}: {
  searchParams: { slug: string };
}) {
  const slug = searchParams.slug;
  if (!slug) {
    return redirect("/not-found");
  }
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
        title="Select a category"
        description="Don't worry, you can edit this later."
        className="w-full max-w-4xl mx-auto mt-20"
      >
        <CategorySelection
          businessId={business.id.toString()}
          initialCategoryId={business.category || null}
          redirectTo={`/marketplace/create/subcategory?slug=${slug}`}
        />
      </StepPage>
    </ScrollArea>
  );
}
