import { Button } from "@loopearn/ui/button";
import { Logo } from "@loopearn/ui/logo";
import Link from "next/link";
import { ExitButton } from "../exit-button";
import { ConfettiDemo } from "./confetti";

export default async function Welcome({
  searchParams,
}: {
  searchParams: { slug: string };
}) {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-[64px] bg-background z-50 flex items-center px-2 md:px-10">
        <Logo className="font-semibold h-8 w-auto" />
        <div className="ml-auto">
          <ExitButton />
        </div>
      </div>
      <div className="relative mx-auto mt-24 flex max-w-sm flex-col items-center px-3 text-center md:mt-32 md:px-8 lg:mt-48">
        <ConfettiDemo />

        <p className="animate-slide-up-fade mt-2 text-gray-500 [--offset:10px] [animation-delay:500ms] [animation-duration:1s] [animation-fill-mode:both]">
          We will be reviewing your Listing shortly. Congratulations and thank
          you for submitting it. We will be in touch soon.
        </p>
        <div className="animate-slide-up-fade mt-10 w-full [--offset:10px] [animation-delay:750ms] [animation-duration:1s] [animation-fill-mode:both]">
          <Button variant="outline">
            <Link href="/listings">Go to your listings</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
