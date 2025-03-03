import { getStateTwoDigitCode } from "@loopearn/location/states";
import { getBusinessBySlug, getUser } from "@loopearn/supabase/cached-queries";
import { Logo } from "@loopearn/ui/logo";
import { ScrollArea } from "@loopearn/ui/scroll-area";
import { redirect } from "next/navigation";
import { ExitButton } from "../exit-button";

export default async function UpdateAddress({
  searchParams,
}: {
  searchParams: { slug: string };
}) {
  const slug = searchParams.slug;
  const property = await getBusinessBySlug(slug);
  if (!property) {
    return redirect("/not-found");
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
        <div className="relative flex flex-col items-center min-h-screen ">
          <div className="flex w-full max-w-5xl flex-col items-center justify-center" />
        </div>
      </ScrollArea>
    </>
  );
}
