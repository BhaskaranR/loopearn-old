import { CreateTeamForm } from "@/components/forms/create-team-form";
import { Logo } from "@/components/logo";
import { UserMenu } from "@/components/user-menu";
import { Icons } from "@loopearn/ui/icons";
import { TooltipProvider } from "@loopearn/ui/tooltip";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Create Team | LoopEarn",
};

export default async function CreateTeam() {
  return (
    <TooltipProvider>
      <header className="w-full absolute left-0 right-0 flex justify-between items-center">
        <div className="ml-5 mt-4 md:ml-10 md:mt-10">
          <Link href="/" className="inline-flex items-center">
            <Logo className="font-semibold h-8 w-auto" />
          </Link>
        </div>

        <div className="mr-5 mt-4 md:mr-10 md:mt-10">
          <Suspense>
            <UserMenu onlySignOut />
          </Suspense>
        </div>
      </header>

      <div className="flex min-h-screen justify-center items-center overflow-hidden p-6 md:p-0">
        <div className="relative z-20 m-auto flex w-full max-w-[340px] flex-col">
          <div>
            <h1 className="text-2xl font-medium mb-8">
              What’s the name of your company or team?
            </h1>
          </div>

          <div className="mb-2">
            <p className="text-sm">
              This will be the name of your LoopEarn team — choose something
              that your team will recognize.
            </p>
          </div>

          <CreateTeamForm />
        </div>
      </div>
    </TooltipProvider>
  );
}
