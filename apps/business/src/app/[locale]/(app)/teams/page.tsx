import { SelectTeamTable } from "@/components/tables/select-team/table";
import { UserMenu } from "@/components/user-menu";
import {
  getPendingBusinessInvites,
  getTeams,
} from "@loopearn/supabase/cached-queries";
import { Logo } from "@loopearn/ui/logo";
import { TooltipProvider } from "@loopearn/ui/tooltip";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Teams | LoopEarn",
};

export default async function Teams() {
  const teams = await getTeams();
  const pendingInvites = await getPendingBusinessInvites();
  if (!teams?.data?.length && !pendingInvites?.data?.length) {
    redirect("/onboarding/teams");
  }

  return (
    <TooltipProvider>
      <header className="w-full absolute left-0 right-0 flex justify-between items-center">
        <div className="ml-5 mt-4 md:ml-10 md:mt-10">
          <button
            type="button"
            className="group flex items-center gap-1 p-3 pr-7 text-sm text-black/50 transition-colors enabled:hover:text-black/80"
          >
            Go back
          </button>
        </div>

        <div className="mr-5 mt-4 md:mr-10 md:mt-10">
          <Suspense>
            <UserMenu onlySignOut />
          </Suspense>
        </div>
      </header>

      <div className="flex min-h-screen justify-center items-center overflow-hidden p-6 md:p-0">
        <div className="relative z-20 m-auto flex w-full max-w-[480px] flex-col">
          <div>
            <h1 className="text-2xl font-medium pb-4">
              You have access to these teams/organizations
            </h1>
            <p className="text-sm text-[#878787] mb-8">
              Select team or create a new one.
            </p>
          </div>

          <SelectTeamTable
            data={teams.data}
            pendingInvites={pendingInvites?.data}
          />

          <div className="text-center mt-8 border-t-[1px] border-border pt-6">
            <Link href="/onboarding/teams" className="text-sm">
              Create team
            </Link>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
