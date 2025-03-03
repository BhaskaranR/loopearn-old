import { getBusinessBySlug } from "@loopearn/supabase/cached-queries";
import { Logo } from "@loopearn/ui/logo";
import { ScrollArea } from "@loopearn/ui/scroll-area";
import { redirect } from "next/navigation";
import { ExitButton } from "../exit-button";
import { StepPage } from "../step-page";

export default async function UpdateAmenities({
  searchParams,
}: {
  searchParams: { slug: string };
}) {
  const slug = searchParams.slug;
  if (!slug) {
    redirect("not-found");
  }

  const business = await getBusinessBySlug(slug);
  if (!business) {
    redirect("not-found");
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-[64px] bg-background z-50 flex items-center px-2 md:px-10">
        <Logo className="font-semibold h-8 w-auto" />
        <div className="ml-auto">
          <ExitButton />
        </div>
      </div>

      <ScrollArea
        className="h-[calc(100vh-100px)] pt-[64px] bg-background flex w-full flex-col gap-4 text-left"
        hideScrollbar
      >
        <div className="relative flex flex-col items-center min-h-screen justify-center">
          <div className="flex w-full flex-col items-center justify-center">
            <StepPage
              title="Set your amenities"
              className="w-full max-w-xl mx-auto"
            >
              <div className="animate-slide-up-fade w-full [--offset:10px] [animation-delay:500ms] [animation-duration:1s] [animation-fill-mode:both]"></div>
            </StepPage>
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
