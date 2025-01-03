import { Logo } from "@/components/logo";
import { SetupForm } from "@/components/setup-form";
import { getSession, getUser } from "@loopearn/supabase/cached-queries";
import { Icons } from "@loopearn/ui/icons";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Setup account | LoopEarn",
};

export default async function Page() {
  const userData = await getUser();
  const data = userData?.data;

  if (!data?.id) {
    return redirect("/");
  }

  return (
    <div>
      <div className="absolute left-5 top-4 md:left-10 md:top-10">
        <Link
          href="/"
          className="items-center gap-6 space-x-2 md:flex keychainify-checked"
        >
          <Logo className="hidden font-semibold sm:inline-block" />
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
  );
}
