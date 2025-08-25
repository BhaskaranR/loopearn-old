import { SetupForm } from "@/components/setup-form";
import { getUser } from "@loopearn/supabase/cached-queries";
import { Logo } from "@loopearn/ui/logo";
import { TooltipProvider } from "@loopearn/ui/tooltip";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Setup account | LoopEarn",
};

export default async function Page() {
  const data = await getUser();

  if (!data?.id) {
    return redirect("/");
  }

  return (
    <TooltipProvider>
      <div>
        <div className="absolute left-5 top-4 md:left-10 md:top-10">
          <Link href="/" className="inline-flex items-center">
            <Logo className="font-semibold h-8 w-auto" />
          </Link>
        </div>

        <div className="flex min-h-screen justify-center items-center overflow-hidden p-6 md:p-0">
          <div className="relative z-20 m-auto flex w-full max-w-[380px] flex-col">
            <h1 className="text-2xl font-medium pb-4">Update your account</h1>
            <p className="text-sm text-[#878787] mb-8">
              Add your name and an optional avatar.
            </p>

            <SetupForm
              userId={data?.id}
              avatarUrl={data?.avatar_url}
              fullName={data?.full_name}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
